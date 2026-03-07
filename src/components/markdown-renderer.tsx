"use client";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function processLaTeX(text: string) {
  return text
    .replace(/\\\((.*?)\\\)/gs, "$$$1$$")
    .replace(/\\\[(.*?)\\\]/gs, "$$$$$1$$$$");
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const processedContent = processLaTeX(content || "");
  return (
    <div className={className || "prose prose-sm max-w-none prose-slate whitespace-pre-wrap leading-7"}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
