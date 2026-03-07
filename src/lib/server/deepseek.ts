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
    content: item.content || item.text,
    pos: item.pos,
    confidence: item.confidence ?? null,
  }));
  const content = await callDeepSeek(
    [
      {
        role: "system",
        content: `你是一个专业的教育数据结构化助手。请对传入的试卷文本内容执行以下步骤：

识别并分离独立的题目。

判断题型（选择题、填空题、解答题等）。

提取内容：若是选择题，务必分离出题干和选项 (A, B, C, D) 存入 options 数组。

严格返回干净的 JSON 格式（不要 Markdown 标记），包含字段：id, type, content, options, subQuestions。保留原文本的 LaTeX 公式语法（使用 $ 或 $$ 包裹）。
你必须同时返回 sourceIndexes 字段（数字数组）表示该题来自哪些OCR分段索引，用于坐标透传。`,
      },
      {
        role: "user",
        content: `OCR分段如下（每段都有index和pos坐标）：${JSON.stringify(compactSegments)}。请输出JSON数组。`,
      },
    ],
    "deepseek-ai/DeepSeek-V3",
    0.1
  );
  const parsed = parseJsonBlock<
    Array<{
      id?: string | number;
      type?: string;
      content?: string;
      options?: string[];
      subQuestions?: Array<{ id?: string | number; content?: string }>;
      sourceIndexes?: number[];
    }>
  >(content);
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
    return segments.map<Question>((segment, index) => ({
      id: `q-${index + 1}`,
      type: "未知题型",
      content: segment.content || segment.text,
      pos: segment.pos,
      text: segment.content || segment.text,
      box: segment.box,
      confidence: segment.confidence,
      source: "ocr",
    }));
  }
  const indexMap = new Map<number, OcrSegment>();
  segments.forEach((segment, index) => {
    indexMap.set(index + 1, segment);
  });
  return parsed
    .filter((item) => item?.content)
    .map<Question>((item, index) => {
      const candidatePos = (item.sourceIndexes || [])
        .map((sourceIndex) => indexMap.get(sourceIndex))
        .filter((segment): segment is OcrSegment => Boolean(segment))
        .flatMap((segment) => segment.pos);
      const fallbackPos = indexMap.get(index + 1)?.pos || [];
      const finalPos = candidatePos.length > 0 ? candidatePos : fallbackPos;
      return {
        id: item.id || `q-${index + 1}`,
        type: item.type || "未知题型",
        content: item.content || "",
        options: Array.isArray(item.options) ? item.options.filter((option) => typeof option === "string" && option.trim()) : undefined,
        subQuestions: Array.isArray(item.subQuestions)
          ? item.subQuestions
              .filter((sub) => sub?.content)
              .map((sub, subIndex) => ({
                id: String(sub.id || `${index + 1}-${subIndex + 1}`),
                content: String(sub.content || ""),
              }))
          : undefined,
        pos: finalPos,
        text: item.content || "",
        box: undefined,
        confidence: undefined,
        source: "deepseek",
      };
    });
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
