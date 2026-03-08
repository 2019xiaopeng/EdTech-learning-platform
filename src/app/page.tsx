"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, FileText, Sparkles, History, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { processPaper } from "@/services/api";
import { convertPdfToImage } from "@/lib/pdf";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { addPaper, historyPapers, restoreHistoryPaper, isProcessing, processStep, setProcessing, setProcessStep, setGlobalError } =
    useWorkspaceStore();

  const handleFileUpload = async (file: File) => {
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPdf && !isImage) {
      toast.error("仅支持 PDF 或图片文件");
      return;
    }
    setIsUploading(true);
    setProcessing(true);
    setProcessStep("OCR扫描中...");
    setGlobalError(null);
    try {
      let fileData: File | string = file;
      if (isPdf) {
        fileData = await convertPdfToImage(file);
      }
      const result = await processPaper(fileData, isPdf ? "scan" : "photo", setProcessStep);
      result.paper.name = file.name;
      result.paper.sourceUrl = typeof fileData === "string" ? fileData : result.paper.imageUrl;
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
      setProcessStep("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
  };

  const handleOpenHistory = (recordId: string) => {
    const restoredId = restoreHistoryPaper(recordId);
    if (!restoredId) {
      toast.error("历史记录恢复失败");
      return;
    }
    router.push(`/workspace/${restoredId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-8">
        <div className="space-y-4 text-center">
          <p className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            AI EdTech Learning Platform
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">试卷分析与学习</h1>
        </div>
        <div
          className={`cursor-pointer rounded-3xl border border-dashed bg-white p-14 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
            isDragging ? "border-indigo-500 bg-indigo-50/40 shadow-md" : "border-slate-300 hover:border-indigo-300"
          }`}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
              {isUploading ? "正在处理试卷..." : isDragging ? "松开以上传文件" : "点击或拖拽上传试卷（支持 PDF / 图片）"}
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
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center">
            <History className="mr-2 h-4 w-4 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-800">历史试卷</h3>
          </div>
          {historyPapers.length === 0 ? (
            <div className="text-sm text-slate-500">暂无历史记录，上传后会自动保存到本地。</div>
          ) : (
            <div className="space-y-2">
              {historyPapers.map((paper) => (
                <div key={paper.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{paper.name}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(paper.date).toLocaleString()} · {paper.questions.length} 题
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleOpenHistory(paper.id)}>
                    继续学习
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mr-3" />
              <div className="text-sm font-medium text-slate-800">{processStep || "正在处理试卷..."}</div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-1/2 rounded-full bg-indigo-500 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
