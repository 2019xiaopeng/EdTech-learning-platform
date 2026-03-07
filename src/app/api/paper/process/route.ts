import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { recognizeEduPaperCut } from "@/lib/server/aliyun-ocr";
import { structureQuestionsFromSegments } from "@/lib/server/deepseek";
import { Paper } from "@/types";

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then((value) => resolve(value))
      .catch((error) => reject(error))
      .finally(() => clearTimeout(timer));
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const imageBase64 = body?.imageBase64;
    const subject = body?.subject || "Math";
    const imageType = body?.imageType === "scan" ? "scan" : "photo";
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "缺少 imageBase64 参数" }, { status: 400 });
    }
    const ocrResult = await recognizeEduPaperCut(imageBase64, subject, imageType);
    let structuredQuestions: Paper["questions"] = [];
    if (ocrResult.segments.length > 0 && ocrResult.segments.length <= 120) {
      try {
        structuredQuestions = await withTimeout(structureQuestionsFromSegments(ocrResult.segments), 9000);
      } catch {
        structuredQuestions = [];
      }
    }
    const paper: Paper = {
      id: randomUUID(),
      imageUrl: imageBase64,
      questions: structuredQuestions.length > 0 ? structuredQuestions : ocrResult.questions,
      createdAt: Date.now(),
    };
    return NextResponse.json({
      paper,
      ocrSegments: ocrResult.segments,
      requestId: ocrResult.requestId,
      upstreamCode: ocrResult.rawCode,
      upstreamMessage: ocrResult.rawMessage,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "处理试卷失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
