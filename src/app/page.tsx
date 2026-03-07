"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { processPaper } from "@/services/api";
import { convertPdfToImage } from "@/lib/pdf";

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addPaper, setProcessing, setGlobalError } = useWorkspaceStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProcessing(true);
    setGlobalError(null);
    try {
      let fileData: File | string = file;
      if (file.type === "application/pdf") {
        fileData = await convertPdfToImage(file);
      }
      const result = await processPaper(fileData);
      addPaper(result.paper);
      toast.success(`识别完成，共提取 ${result.paper.questions.length} 道题目`);
      router.push(`/workspace/${result.paper.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "处理试卷失败，请重试。";
      setGlobalError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center gap-8">
        <div className="space-y-4 text-center">
          <p className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            AI EdTech Learning Platform
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">试卷分析与学习</h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-500">
            上传试卷后，系统将通过阿里云OCR完成切题识别，并由DeepSeek进行结构化分析与辅导交互。
          </p>
        </div>
        <div
          className="cursor-pointer rounded-3xl border border-dashed border-slate-300 bg-white p-14 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-2xl bg-slate-100 p-4">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              ) : (
                <Upload className="h-8 w-8 text-slate-500" />
              )}
            </div>
            <div className="text-base font-medium text-slate-800">
              {isUploading ? "正在处理试卷..." : "点击上传试卷（支持 PDF / 图片）"}
            </div>
            <div className="text-sm text-slate-500">
              上传后自动完成切题识别、题目结构化与学习工作台初始化
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <FileText className="mb-2 h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-800">OCR切题识别</h3>
            <p className="mt-1 text-xs text-slate-500">阿里云读光识别题干与坐标边界框</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <Sparkles className="mb-2 h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-800">题目结构化</h3>
            <p className="mt-1 text-xs text-slate-500">DeepSeek将OCR文本整理为可交互题目</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <Upload className="mb-2 h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-800">学习辅导</h3>
            <p className="mt-1 text-xs text-slate-500">知识点讲解、答疑对话、举一反三训练</p>
          </div>
        </div>
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
