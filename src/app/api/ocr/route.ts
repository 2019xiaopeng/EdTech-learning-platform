import { NextResponse } from "next/server";
import { recognizeEduPaperCut } from "@/lib/server/aliyun-ocr";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const imageBase64 = body?.imageBase64;
    const subject = body?.subject || "Math";
    const imageType = body?.imageType === "scan" ? "scan" : "photo";
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "缺少 imageBase64 参数" }, { status: 400 });
    }
    const result = await recognizeEduPaperCut(imageBase64, subject, imageType);
    const segments = result.segments.map((segment, index) => ({
      index: index + 1,
      id: segment.id,
      content: segment.content || segment.text,
      text: segment.text,
      pos: segment.pos,
      confidence: segment.confidence ?? null,
    }));
    return NextResponse.json({
      requestId: result.requestId,
      upstreamCode: result.rawCode,
      upstreamMessage: result.rawMessage,
      segments,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "OCR识别失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
