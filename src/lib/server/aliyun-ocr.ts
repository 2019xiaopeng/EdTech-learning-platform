import { randomUUID } from "crypto";
import { Readable } from "stream";
import OCRClient, { RecognizeEduPaperCutRequest } from "@alicloud/ocr-api20210707";
import { Config } from "@alicloud/openapi-client";
import { BoundingBox, OcrSegment, Question } from "@/types";

type AnyRecord = Record<string, unknown>;

let client: OCRClient | null = null;

function getClient() {
  if (client) {
    return client;
  }
  const accessKeyId = process.env.ALIYUN_OCR_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIYUN_OCR_ACCESS_KEY_SECRET;
  if (!accessKeyId || !accessKeySecret) {
    throw new Error("未配置阿里云OCR访问密钥");
  }
  const region = process.env.ALIYUN_OCR_REGION || "cn-hangzhou";
  const endpoint = process.env.ALIYUN_OCR_ENDPOINT || `ocr-api.${region}.aliyuncs.com`;
  const config = new Config({
    accessKeyId,
    accessKeySecret,
    regionId: region,
    endpoint,
  });
  client = new OCRClient(config);
  return client;
}

function parseDataUrl(input: string) {
  const matched = input.match(/^data:(.+?);base64,(.+)$/);
  if (!matched) {
    throw new Error("图片Base64格式不正确");
  }
  const mimeType = matched[1];
  const base64 = matched[2];
  return { mimeType, buffer: Buffer.from(base64, "base64") };
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeBox(source: AnyRecord): BoundingBox | null {
  const ymin = asNumber(source.ymin ?? source.top ?? source.yMin);
  const xmin = asNumber(source.xmin ?? source.left ?? source.xMin);
  const ymax = asNumber(source.ymax ?? source.bottom ?? source.yMax);
  const xmax = asNumber(source.xmax ?? source.right ?? source.xMax);
  if (ymin !== null && xmin !== null && ymax !== null && xmax !== null) {
    return { ymin, xmin, ymax, xmax };
  }
  const centerX = asNumber(source.centerX);
  const centerY = asNumber(source.centerY);
  const width = asNumber(source.width);
  const height = asNumber(source.height);
  if (centerX !== null && centerY !== null && width !== null && height !== null) {
    return {
      xmin: centerX - width / 2,
      xmax: centerX + width / 2,
      ymin: centerY - height / 2,
      ymax: centerY + height / 2,
    };
  }
  const posCandidate = source.pos;
  if (Array.isArray(posCandidate) && posCandidate.length > 0) {
    const points = posCandidate
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }
        const record = item as AnyRecord;
        const x = asNumber(record.x);
        const y = asNumber(record.y);
        if (x === null || y === null) {
          return null;
        }
        return { x, y };
      })
      .filter((item): item is { x: number; y: number } => item !== null);
    if (points.length > 0) {
      const xs = points.map((point) => point.x);
      const ys = points.map((point) => point.y);
      return {
        xmin: Math.min(...xs),
        xmax: Math.max(...xs),
        ymin: Math.min(...ys),
        ymax: Math.max(...ys),
      };
    }
  }
  return null;
}

function parseOcrPayload(raw: string) {
  if (!raw.trim()) {
    return {};
  }
  try {
    return JSON.parse(raw) as AnyRecord;
  } catch {
    return { text: raw };
  }
}

function extractSegments(payload: unknown) {
  const segments: OcrSegment[] = [];
  const stack: unknown[] = [payload];
  while (stack.length > 0 && segments.length < 300) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }
    if (Array.isArray(current)) {
      for (const item of current) {
        stack.push(item);
      }
      continue;
    }
    const record = current as AnyRecord;
    const textCandidate = record.text ?? record.word ?? record.content ?? record.value ?? record.question;
    const box = normalizeBox(record);
    if (typeof textCandidate === "string" && textCandidate.trim() && box) {
      segments.push({
        id: randomUUID(),
        text: textCandidate.trim(),
        box,
        confidence: asNumber(record.confidence) ?? undefined,
      });
    }
    for (const value of Object.values(record)) {
      stack.push(value);
    }
  }
  return segments;
}

function buildFallbackQuestions(segments: OcrSegment[]) {
  return segments.map<Question>((segment, index) => ({
    id: `q-${index + 1}`,
    text: segment.text,
    box: segment.box,
    source: "ocr",
    confidence: segment.confidence,
  }));
}

export async function recognizeEduPaperCut(imageBase64: string, subject = "Math", imageType: "scan" | "photo" = "photo") {
  const sdkClient = getClient();
  const { buffer, mimeType } = parseDataUrl(imageBase64);
  if (!mimeType.startsWith("image/")) {
    throw new Error("仅支持图片格式输入");
  }
  const request = new RecognizeEduPaperCutRequest({
    cutType: "question",
    imageType,
    outputOricoord: true,
    subject,
    body: Readable.from([buffer]),
  });
  const response = await sdkClient.recognizeEduPaperCut(request);
  const payload = parseOcrPayload(response.body?.data || "");
  const segments = extractSegments(payload);
  const questions = buildFallbackQuestions(segments);
  return {
    requestId: response.body?.requestId || "",
    rawCode: response.body?.code || "",
    rawMessage: response.body?.message || "",
    rawPayload: payload,
    segments,
    questions,
  };
}
