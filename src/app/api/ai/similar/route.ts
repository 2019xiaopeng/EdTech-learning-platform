import { NextResponse } from "next/server";
import { buildSimilarQuestions } from "@/lib/server/deepseek";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const questionText = body?.questionText;
    if (!questionText || typeof questionText !== "string") {
      return NextResponse.json({ error: "缺少 questionText 参数" }, { status: 400 });
    }
    const content = await buildSimilarQuestions(questionText);
    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "相似题目生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
