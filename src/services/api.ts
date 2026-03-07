import { ChatMessage, ChatOption, OcrSegment, ProcessPaperResult, Question } from "../types";
type AiChannel = "chat" | "knowledge" | "similar";

async function fileToDataUrl(file: File | string): Promise<string> {
  if (typeof file === "string") {
    return file;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsDataURL(file);
  });
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error || "请求失败，请稍后重试";
    throw new Error(message);
  }
  return payload as T;
}

function parseContentPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }
  const content = (payload as { content?: unknown }).content;
  if (typeof content === "string" && content.trim()) {
    return content;
  }
  const text = (payload as { text?: unknown }).text;
  if (typeof text === "string" && text.trim()) {
    return text;
  }
  const data = (payload as { data?: { content?: unknown; text?: unknown } }).data;
  if (typeof data?.content === "string" && data.content.trim()) {
    return data.content;
  }
  if (typeof data?.text === "string" && data.text.trim()) {
    return data.text;
  }
  return "";
}

const aiControllers: Record<AiChannel, AbortController | null> = {
  chat: null,
  knowledge: null,
  similar: null,
};

function startAiRequest(channel: AiChannel) {
  aiControllers[channel]?.abort();
  const controller = new AbortController();
  aiControllers[channel] = controller;
  return controller.signal;
}

export function abortAiRequest(channel: AiChannel) {
  aiControllers[channel]?.abort();
  aiControllers[channel] = null;
}

export function abortAllAiRequests() {
  abortAiRequest("chat");
  abortAiRequest("knowledge");
  abortAiRequest("similar");
}

type OcrRouteSegment = {
  index: number;
  id: string;
  content: string;
  text: string;
  pos: { x: number; y: number }[];
  confidence: number | null;
};

export async function processPaper(
  file: File | string,
  imageType: "scan" | "photo" = "photo",
  onStepChange?: (step: string) => void
): Promise<ProcessPaperResult> {
  const imageBase64 = await fileToDataUrl(file);
  onStepChange?.("OCR扫描中...");
  const ocrResponse = await fetch("/api/ocr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, imageType }),
  });
  const ocrPayload = await parseResponse<{ segments: OcrRouteSegment[] }>(ocrResponse);
  onStepChange?.("AI结构化中...");
  const parseResponseResult = await fetch("/api/parse-paper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ segments: ocrPayload.segments }),
  });
  const parsedPayload = await parseResponse<{ questions: Question[] }>(parseResponseResult);
  const ocrSegments: OcrSegment[] = ocrPayload.segments.map((segment) => {
    const xs = segment.pos.map((point) => point.x);
    const ys = segment.pos.map((point) => point.y);
    return {
      id: segment.id,
      text: segment.text,
      content: segment.content,
      pos: segment.pos,
      confidence: segment.confidence ?? undefined,
      box: {
        xmin: Math.min(...xs),
        xmax: Math.max(...xs),
        ymin: Math.min(...ys),
        ymax: Math.max(...ys),
      },
    };
  });
  return {
    paper: {
      id: crypto.randomUUID(),
      imageUrl: imageBase64,
      questions: parsedPayload.questions.length > 0 ? parsedPayload.questions : ocrSegments.map((segment, index) => ({
        id: `q-${index + 1}`,
        type: "未知题型",
        content: segment.content || segment.text,
        pos: segment.pos,
        text: segment.text,
        box: segment.box,
        source: "ocr",
        confidence: segment.confidence,
      })),
      createdAt: Date.now(),
    },
    ocrSegments,
  };
}

export async function askAI(
  questionText: string,
  chatHistory: ChatMessage[],
  userMessage: string,
  signal?: AbortSignal
): Promise<{ message: string; options?: ChatOption[] }> {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionText, chatHistory, userMessage }),
    signal,
  });
  return parseResponse<{ message: string; options?: ChatOption[] }>(response);
}

export async function askAIWithAbort(
  questionText: string,
  chatHistory: ChatMessage[],
  userMessage: string
) {
  const signal = startAiRequest("chat");
  return askAI(questionText, chatHistory, userMessage, signal);
}

export async function generateSimilarQuestions(questionText: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch("/api/ai/similar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionText }),
    signal,
  });
  const payload = await parseResponse<unknown>(response);
  const content = parseContentPayload(payload);
  if (!content) {
    throw new Error("相似题接口返回为空");
  }
  return content;
}

export async function generateSimilarQuestionsWithAbort(questionText: string, cache?: string) {
  if (cache?.trim()) {
    return { content: cache, fromCache: true };
  }
  const signal = startAiRequest("similar");
  const content = await generateSimilarQuestions(questionText, signal);
  return { content, fromCache: false };
}

export async function generateKnowledgeExplanation(questionText: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch("/api/ai/knowledge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionText }),
    signal,
  });
  const payload = await parseResponse<unknown>(response);
  const content = parseContentPayload(payload);
  if (!content) {
    throw new Error("知识点接口返回为空");
  }
  return content;
}

export async function generateKnowledgeExplanationWithAbort(questionText: string, cache?: string) {
  if (cache?.trim()) {
    return { content: cache, fromCache: true };
  }
  const signal = startAiRequest("knowledge");
  const content = await generateKnowledgeExplanation(questionText, signal);
  return { content, fromCache: false };
}
