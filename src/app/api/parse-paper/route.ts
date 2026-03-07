import { NextResponse } from "next/server";
import { structureQuestionsFromSegments } from "@/lib/server/deepseek";
import { OcrSegment, Point } from "@/types";

type InputSegment = {
  id?: string;
  content?: string;
  text?: string;
  pos?: Point[];
  confidence?: number | null;
};

function toBox(pos: Point[]) {
  const xs = pos.map((point) => point.x);
  const ys = pos.map((point) => point.y);
  return {
    xmin: Math.min(...xs),
    xmax: Math.max(...xs),
    ymin: Math.min(...ys),
    ymax: Math.max(...ys),
  };
}

function normalizeSegments(input: InputSegment[]) {
  return input
    .filter((segment) => {
      if (!segment || typeof segment !== "object") {
        return false;
      }
      const content = segment.content || segment.text || "";
      return typeof content === "string" && content.trim() && Array.isArray(segment.pos) && segment.pos.length > 0;
    })
    .map<OcrSegment>((segment, index) => {
      const content = (segment.content || segment.text || "").trim();
      const pos = (segment.pos || []).slice(0, 4);
      return {
        id: segment.id || `seg-${index + 1}`,
        text: content,
        content,
        pos,
        box: toBox(pos),
        confidence: typeof segment.confidence === "number" ? segment.confidence : undefined,
      };
    });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const segments = normalizeSegments(Array.isArray(body?.segments) ? body.segments : []);
    if (segments.length === 0) {
      return NextResponse.json({ error: "缺少有效的 OCR segments" }, { status: 400 });
    }
    const questions = await structureQuestionsFromSegments(segments);
    return NextResponse.json({ questions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "试卷结构化失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
