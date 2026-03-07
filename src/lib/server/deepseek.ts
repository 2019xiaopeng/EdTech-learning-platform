import { randomUUID } from "crypto";
import { ChatMessage, ChatOption, OcrSegment, Question } from "@/types";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

type DeepSeekResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

function getApiKey() {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new Error("未配置 DEEPSEEK_API_KEY");
  }
  return key;
}

function parseJsonBlock<T>(content: string): T | null {
  const fenced = content.match(/```json\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : content;
  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
}

export async function callDeepSeek(messages: Message[], model = "deepseek-ai/DeepSeek-V3", temperature = 0.3) {
  const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({ model, messages, temperature }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DeepSeek调用失败: ${response.status} ${text}`);
  }
  const data = (await response.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek返回为空");
  }
  return content;
}

export async function structureQuestionsFromSegments(segments: OcrSegment[]) {
  const compactSegments = segments.map((item, index) => ({
    index: index + 1,
    text: item.text,
    box: item.box,
    confidence: item.confidence ?? null,
  }));
  const content = await callDeepSeek(
    [
      {
        role: "system",
        content:
          "你是试卷结构化助手。你必须输出严格JSON数组，每项包含id,text,box(ymin,xmin,ymax,xmax),confidence。不要包含任何额外文本。",
      },
      {
        role: "user",
        content: `请把以下OCR片段整理成题目数组，尽量合并同题分段：${JSON.stringify(compactSegments)}`,
      },
    ],
    "deepseek-ai/DeepSeek-V3",
    0.1
  );
  const parsed = parseJsonBlock<Array<{ id?: string; text?: string; box?: Question["box"]; confidence?: number }>>(content);
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
    return segments.map<Question>((segment, index) => ({
      id: `q-${index + 1}`,
      text: segment.text,
      box: segment.box,
      confidence: segment.confidence,
      source: "ocr",
    }));
  }
  return parsed
    .filter((item) => item?.text && item?.box)
    .map<Question>((item, index) => ({
      id: item.id || `q-${index + 1}`,
      text: item.text || "",
      box: item.box as Question["box"],
      confidence: item.confidence,
      source: "deepseek",
    }));
}

export async function buildTutorReply(questionText: string, history: ChatMessage[], userMessage: string) {
  const dialogHistory = history.map((item) => `${item.role === "user" ? "学生" : "导师"}:${item.text}`).join("\n");
  const content = await callDeepSeek(
    [
      {
        role: "system",
        content:
          "你是苏格拉底式数学导师。不要直接给最终答案。输出严格JSON对象，格式为{\"message\":\"...\",\"options\":[\"...\",\"...\"]}，options最多3项。",
      },
      {
        role: "user",
        content: `题目：${questionText}\n历史对话：${dialogHistory}\n学生最新输入：${userMessage}`,
      },
    ],
    "deepseek-ai/DeepSeek-V3",
    0.5
  );
  const parsed = parseJsonBlock<{ message?: string; options?: string[] }>(content);
  if (!parsed?.message) {
    return {
      message: content,
      options: [] as ChatOption[],
    };
  }
  return {
    message: parsed.message,
    options: (parsed.options || []).slice(0, 3).map((text) => ({ id: randomUUID(), text })),
  };
}

export async function buildKnowledgeAnswer(questionText: string) {
  return callDeepSeek(
    [
      {
        role: "system",
        content: "你是知识点讲解助手。解释解题所需概念，不直接给出原题最终答案。",
      },
      {
        role: "user",
        content: `请讲解这道题的核心知识点：${questionText}`,
      },
    ],
    "deepseek-ai/DeepSeek-R1",
    0.4
  );
}

export async function buildSimilarQuestions(questionText: string) {
  return callDeepSeek(
    [
      {
        role: "system",
        content: "你是出题助手。生成2道同知识点变式题并给出详细解析。",
      },
      {
        role: "user",
        content: `原题：${questionText}`,
      },
    ],
    "deepseek-ai/DeepSeek-V3",
    0.6
  );
}
