"use client";

import { Question } from "@/types";
import { Card } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/markdown-renderer";

function splitOptionText(option: string, index: number) {
  const matched = option.trim().match(/^([A-HＡ-Ｈ])[\.\、\．\)]\s*(.+)$/);
  if (matched) {
    return { label: matched[1].toUpperCase(), content: matched[2] };
  }
  return { label: String.fromCharCode(65 + index), content: option };
}

interface QuestionRendererProps {
  question: Question;
  onOptionSelect?: (label: string, optionContent: string) => void;
}

export function QuestionRenderer({ question, onOptionSelect }: QuestionRendererProps) {
  const content = question.content || question.text || "";
  const options = Array.isArray(question.options) ? question.options : [];
  const isChoiceQuestion = question.type.includes("选择") && options.length > 0;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
        <MarkdownRenderer content={content} className="prose prose-sm max-w-none prose-slate whitespace-pre-wrap leading-7" />
      </div>
      {isChoiceQuestion && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {options.map((option, index) => {
            const parsed = splitOptionText(option, index);
            return (
              <Card
                key={`${parsed.label}-${index}`}
                className="cursor-pointer border-slate-200 p-3 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40"
                onClick={() => onOptionSelect?.(parsed.label, parsed.content)}
              >
                <div className="mb-1 text-xs font-semibold text-indigo-600">{parsed.label}</div>
                <MarkdownRenderer content={parsed.content} className="prose prose-sm max-w-none prose-slate whitespace-pre-wrap leading-6" />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
