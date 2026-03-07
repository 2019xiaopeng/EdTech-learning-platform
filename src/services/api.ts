import { ChatMessage, ChatOption, ProcessPaperResult } from "../types";

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

export async function processPaper(file: File | string, imageType: "scan" | "photo" = "photo"): Promise<ProcessPaperResult> {
  const imageBase64 = await fileToDataUrl(file);
  const response = await fetch("/api/paper/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, imageType }),
  });
  return parseResponse<ProcessPaperResult>(response);
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

export async function generateSimilarQuestions(questionText: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch("/api/ai/similar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionText }),
    signal,
  });
  const payload = await parseResponse<{ content: string }>(response);
  return payload.content;
}

export async function generateKnowledgeExplanation(questionText: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch("/api/ai/knowledge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionText }),
    signal,
  });
  const payload = await parseResponse<{ content: string }>(response);
  return payload.content;
}
