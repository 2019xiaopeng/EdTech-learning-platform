import { NextResponse } from "next/server";
import { buildTutorReply } from "@/lib/server/deepseek";
import { ChatMessage } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const questionText = body?.questionText;
    const chatHistory = (body?.chatHistory || []) as ChatMessage[];
    const userMessage = body?.userMessage;
    if (!questionText || !userMessage) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }
    const result = await buildTutorReply(questionText, chatHistory, userMessage);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "对话生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
