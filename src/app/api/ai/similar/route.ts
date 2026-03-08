import { NextResponse } from "next/server";
import { buildSimilarExercise } from "@/lib/server/deepseek";
import { readAiCache, writeAiCache } from "@/lib/server/ai-cache";
import { SimilarExercise } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const questionText = body?.questionText;
    if (!questionText || typeof questionText !== "string") {
      return NextResponse.json({ error: "缺少 questionText 参数" }, { status: 400 });
    }
    const cached = readAiCache("similar", questionText);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as SimilarExercise;
        return NextResponse.json({ ...parsed, cached: true });
      } catch {
        return NextResponse.json({ content: cached, type: "解答题", answer: "", analysis: "暂无解析", cached: true });
      }
    }
    const exercise = await buildSimilarExercise(questionText);
    writeAiCache("similar", questionText, JSON.stringify(exercise));
    return NextResponse.json({ ...exercise, cached: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "相似题目生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
