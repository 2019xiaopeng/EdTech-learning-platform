import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { recognizeEduPaperCut } from "@/lib/server/aliyun-ocr";
import { structureQuestionsFromSegments } from "@/lib/server/deepseek";
import { Paper } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const imageBase64 = body?.imageBase64;
    const subject = body?.subject || "Math";
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "缺少 imageBase64 参数" }, { status: 400 });
    }
    const ocrResult = await recognizeEduPaperCut(imageBase64, subject);
    const structuredQuestions = await structureQuestionsFromSegments(ocrResult.segments);
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
