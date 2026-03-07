import { NextResponse } from "next/server";
import { buildKnowledgeAnswer } from "@/lib/server/deepseek";
import { readAiCache, writeAiCache } from "@/lib/server/ai-cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const questionText = body?.questionText;
    if (!questionText || typeof questionText !== "string") {
      return NextResponse.json({ error: "缺少 questionText 参数" }, { status: 400 });
    }
    const cached = readAiCache("knowledge", questionText);
    if (cached) {
      return NextResponse.json({ content: cached, cached: true });
    }
    const content = await buildKnowledgeAnswer(questionText);
    writeAiCache("knowledge", questionText, content);
    return NextResponse.json({ content, cached: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "知识点讲解生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
