"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Target, ArrowLeft, Loader2, Send, CheckCircle2, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  abortAllAiRequests,
  askAIWithAbort,
  generateKnowledgeExplanationWithAbort,
  generateSimilarQuestionsWithAbort,
} from "@/services/api";
import { toast } from "sonner";
import { SimilarExercise } from "@/types";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

function getQuestionContent(question: { content?: string; text?: string }) {
  return question.content || question.text || "";
}

function getQuestionBounds(question: {
  pos?: { x: number; y: number }[];
  box?: { ymin: number; xmin: number; ymax: number; xmax: number };
}) {
  if (question.pos && question.pos.length > 0) {
    const xs = question.pos.map((point) => point.x);
    const ys = question.pos.map((point) => point.y);
    return {
      xmin: Math.min(...xs),
      xmax: Math.max(...xs),
      ymin: Math.min(...ys),
      ymax: Math.max(...ys),
    };
  }
  return question.box || { xmin: 0, xmax: 0, ymin: 0, ymax: 0 };
}

export default function Workspace() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const {
    papers,
    activePanel,
    setActivePanel,
    setActiveQuestion,
    setActivePaper,
    getActiveQuestionId,
    chatHistory,
    appendChatMessage,
    setInsightCache,
    getInsightCache,
  } = useWorkspaceStore();
  const paper = papers[id || ""];
  const activeQuestionId = getActiveQuestionId(id);

  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const [similarExercise, setSimilarExercise] = useState<SimilarExercise | null>(null);
  const [similarOption, setSimilarOption] = useState("");
  const [similarInput, setSimilarInput] = useState("");
  const [similarFeedback, setSimilarFeedback] = useState<{ correct: boolean; answer: string } | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const transformApiRef = useRef<{ setTransform: (x: number, y: number, scale: number, animationTime?: number) => void } | null>(null);
  const transformScaleRef = useRef(1);

  useEffect(() => {
    if (!paper) {
      router.push("/");
      return;
    }
    setActivePaper(id);
  }, [paper, router, id, setActivePaper]);

  useEffect(() => {
    return () => {
      abortAllAiRequests();
    };
  }, []);

  if (!paper) return null;

  const activeQuestion = paper.questions.find((q) => String(q.id) === activeQuestionId);
  const currentChat = activeQuestionId ? chatHistory[`${id}:${activeQuestionId}`] || [] : [];
  const knowledgeInsight = activeQuestion ? getInsightCache(id, String(activeQuestion.id), "knowledge") : null;

  const centerToQuestion = (questionId: string) => {
    const question = paper.questions.find((item) => String(item.id) === questionId);
    if (!question || !viewerRef.current || !imageRef.current || !transformApiRef.current) {
      return;
    }
    const box = getQuestionBounds(question);
    const centerX = (box.xmin + box.xmax) / 2;
    const centerY = (box.ymin + box.ymax) / 2;
    const originalWidth = imageNaturalSize.width || 1;
    const originalHeight = imageNaturalSize.height || 1;
    const baseWidth = imageRef.current.clientWidth || 1;
    const baseHeight = imageRef.current.clientHeight || 1;
    const xOnCanvas = (centerX / originalWidth) * baseWidth;
    const yOnCanvas = (centerY / originalHeight) * baseHeight;
    const scale = transformScaleRef.current || 1;
    const nextX = viewerRef.current.clientWidth / 2 - xOnCanvas * scale;
    const nextY = viewerRef.current.clientHeight / 2 - yOnCanvas * scale;
    transformApiRef.current.setTransform(nextX, nextY, scale, 320);
  };

  const handleQuestionClick = (questionId: string) => {
    setActiveQuestion(id, questionId);
    setSimilarFeedback(null);
    setSimilarInput("");
    setSimilarOption("");
    abortAllAiRequests();
    setTimeout(() => centerToQuestion(questionId), 40);
  };

  const handleSendMessage = async (text: string = chatInput) => {
    if (!text.trim() || !activeQuestion) return;
    const userMessage = { id: Date.now().toString(), role: "user" as const, text };
    const conversation = [...currentChat, userMessage];
    appendChatMessage(id, String(activeQuestion.id), userMessage);
    setChatInput("");
    setIsAiTyping(true);
    try {
      const response = await askAIWithAbort(getQuestionContent(activeQuestion), conversation, text);
      appendChatMessage(id, String(activeQuestion.id), {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: response.message,
        options: response.options,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      toast.error(error instanceof Error ? error.message : "对话失败，请重试");
    } finally {
      setIsAiTyping(false);
    }
  };

  const requestKnowledge = async () => {
    if (!activeQuestion) return;
    const cacheFromQuestion = activeQuestion.knowledgeCache;
    const cached = getInsightCache(id, String(activeQuestion.id), "knowledge");
    if (cached || cacheFromQuestion) {
      if (!cached && cacheFromQuestion) {
        setInsightCache(id, String(activeQuestion.id), "knowledge", cacheFromQuestion);
      }
      return;
    }
    setAnalysisLoading(true);
    try {
      const result = await generateKnowledgeExplanationWithAbort(getQuestionContent(activeQuestion), cacheFromQuestion);
      setInsightCache(id, String(activeQuestion.id), "knowledge", result.content);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error(error instanceof Error ? error.message : "题目分析生成失败");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const parseExerciseCache = (cache?: string) => {
    if (!cache) return null;
    try {
      return JSON.parse(cache) as SimilarExercise;
    } catch {
      return null;
    }
  };

  const requestSimilar = async () => {
    if (!activeQuestion) return;
    const cachedExercise = parseExerciseCache(activeQuestion.similarCache);
    if (cachedExercise) {
      setSimilarExercise(cachedExercise);
      return;
    }
    setSimilarLoading(true);
    try {
      const result = await generateSimilarQuestionsWithAbort(getQuestionContent(activeQuestion), activeQuestion.similarCache);
      setSimilarExercise(result.exercise);
      setInsightCache(id, String(activeQuestion.id), "similar", JSON.stringify(result.exercise));
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error(error instanceof Error ? error.message : "举一反三生成失败");
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleOpenPanel = (panel: "analysis" | "chat" | "similar") => {
    if (!activeQuestion) {
      toast.error("请先选择题目");
      return;
    }
    setActivePanel(panel);
  };

  const closePanel = () => {
    setActivePanel(null);
    abortAllAiRequests();
    setAnalysisLoading(false);
    setSimilarLoading(false);
  };

  const submitSimilarAnswer = () => {
    if (!similarExercise) return;
    const userAnswer = similarOption || similarInput.trim();
    if (!userAnswer) {
      toast.error("请先作答");
      return;
    }
    const normalizedUser = userAnswer.replace(/\s/g, "").toUpperCase();
    const normalizedAnswer = similarExercise.answer.replace(/\s/g, "").toUpperCase();
    const correct = normalizedUser === normalizedAnswer;
    setSimilarFeedback({
      correct,
      answer: similarExercise.answer,
    });
  };

  useEffect(() => {
    if (!activeQuestion || !activePanel) return;
    if (activePanel === "analysis") {
      void requestKnowledge();
      return;
    }
    if (activePanel === "similar") {
      void requestSimilar();
      return;
    }
    if (activePanel === "chat" && currentChat.length === 0) {
      setIsAiTyping(true);
      askAIWithAbort(getQuestionContent(activeQuestion), [], "请先引导我从题目的切入点开始思考")
        .then((response) => {
          appendChatMessage(id, String(activeQuestion.id), {
            id: Date.now().toString(),
            role: "assistant",
            text: response.message,
            options: response.options,
          });
        })
        .catch((error) => {
          if (!(error instanceof Error && error.name === "AbortError")) {
            toast.error(error instanceof Error ? error.message : "对话初始化失败");
          }
        })
        .finally(() => {
          setIsAiTyping(false);
        });
    }
  }, [activePanel, activeQuestion, currentChat.length, appendChatMessage, id, setInsightCache, getInsightCache]);

  const boundsList = paper.questions.map((question) => getQuestionBounds(question));
  const originalImageWidth = imageNaturalSize.width || Math.max(...boundsList.map((box) => box.xmax), 1);
  const originalImageHeight = imageNaturalSize.height || Math.max(...boundsList.map((box) => box.ymax), 1);

  return (
    <div className="h-screen w-full bg-slate-950 text-white">
      <header className="h-14 border-b border-slate-800/90 bg-slate-950/80 backdrop-blur flex items-center px-4 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="mr-4 text-white hover:bg-slate-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <h1 className="font-semibold">沉浸式试卷工作区</h1>
      </header>

      <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden">
        <div ref={viewerRef} className="absolute inset-0 bg-slate-950">
          <TransformWrapper minScale={0.5} maxScale={4} initialScale={1} centerOnInit wheel={{ step: 0.15 }}>
            {({ state, setTransform }) => {
              transformScaleRef.current = state.scale;
              transformApiRef.current = { setTransform };
              return (
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <div className="relative w-full max-w-5xl">
                    <img
                      ref={imageRef}
                      src={paper.imageUrl}
                      alt="Paper"
                      className="w-full h-auto object-contain block select-none"
                      onLoad={(event) =>
                        setImageNaturalSize({
                          width: event.currentTarget.naturalWidth || 0,
                          height: event.currentTarget.naturalHeight || 0,
                        })
                      }
                    />
                    {paper.questions.map((q) => {
                      const box = getQuestionBounds(q);
                      const isActive = String(q.id) === activeQuestionId;
                      return (
                        <button
                          key={String(q.id)}
                          type="button"
                          onClick={() => handleQuestionClick(String(q.id))}
                          className={`absolute border-2 transition-all duration-300 ${
                            isActive
                              ? "border-indigo-400 bg-indigo-500/20 shadow-[0_0_18px_rgba(99,102,241,0.45)]"
                              : "border-amber-300/90 bg-amber-300/10 hover:bg-amber-300/20"
                          }`}
                          style={{
                            top: `${(box.ymin / originalImageHeight) * 100}%`,
                            left: `${(box.xmin / originalImageWidth) * 100}%`,
                            height: `${((box.ymax - box.ymin) / originalImageHeight) * 100}%`,
                            width: `${((box.xmax - box.xmin) / originalImageWidth) * 100}%`,
                          }}
                        />
                      );
                    })}
                  </div>
                </TransformComponent>
              );
            }}
          </TransformWrapper>
        </div>

        <div className="fixed right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/15 p-2 backdrop-blur-md">
          <div className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto px-1 py-1">
            {paper.questions.map((question, index) => {
              const active = String(question.id) === activeQuestionId;
              return (
                <button
                  key={String(question.id)}
                  type="button"
                  onClick={() => handleQuestionClick(String(question.id))}
                  className={`h-8 w-8 rounded-full text-xs font-semibold transition-all ${
                    active ? "bg-indigo-500 text-white" : "bg-white/80 text-slate-700 hover:bg-white"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-8 left-1/2 z-20 flex w-[min(92vw,720px)] -translate-x-1/2 gap-3 rounded-2xl border border-white/25 bg-slate-900/75 p-3 backdrop-blur-xl">
          <Button className="flex-1" onClick={() => handleOpenPanel("analysis")} disabled={!activeQuestion}>
            <BookOpen className="mr-2 h-4 w-4" />
            📖 题目分析
          </Button>
          <Button className="flex-1" onClick={() => handleOpenPanel("chat")} disabled={!activeQuestion}>
            <MessageCircle className="mr-2 h-4 w-4" />
            💬 对话答疑
          </Button>
          <Button className="flex-1" onClick={() => handleOpenPanel("similar")} disabled={!activeQuestion}>
            <Target className="mr-2 h-4 w-4" />
            🎯 举一反三
          </Button>
        </div>
      </div>

      <Dialog open={activePanel !== null} onOpenChange={(open) => !open && closePanel()}>
        <DialogContent className="w-[min(94vw,960px)] h-[82vh] max-w-none p-0 overflow-hidden bg-white">
          <DialogHeader className="border-b border-slate-100 px-6 py-4">
            <DialogTitle>
              {activePanel === "analysis" && "题目分析"}
              {activePanel === "chat" && "对话答疑"}
              {activePanel === "similar" && "举一反三"}
            </DialogTitle>
          </DialogHeader>

          {activePanel === "analysis" && (
            <div className="h-[calc(82vh-74px)] overflow-y-auto px-6 py-5">
              {analysisLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-5/6 rounded bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              ) : (
                <MarkdownRenderer
                  content={knowledgeInsight?.content || activeQuestion?.knowledgeCache || "暂无题目分析"}
                  className="prose prose-slate max-w-none whitespace-pre-wrap leading-7"
                />
              )}
            </div>
          )}

          {activePanel === "chat" && (
            <div className="flex flex-col h-[calc(82vh-74px)] bg-slate-50">
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {currentChat.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white rounded-tr-sm"
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                        }`}
                      >
                        <MarkdownRenderer
                          content={msg.text}
                          className={
                            msg.role === "user"
                              ? "prose prose-sm max-w-none prose-invert whitespace-pre-wrap"
                              : "prose prose-sm max-w-none prose-slate whitespace-pre-wrap"
                          }
                        />
                        {msg.options && msg.options.length > 0 && (
                          <div className="mt-3 grid gap-2">
                            {msg.options.map((opt) => (
                              <Button key={opt.id} variant="outline" onClick={() => handleSendMessage(opt.text)}>
                                {opt.text}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI 正在思考中…</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-slate-200 bg-white p-4">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="min-h-[66px] resize-none"
                    placeholder="告诉我你的思路或答案..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={() => void handleSendMessage()} disabled={!chatInput.trim() || isAiTyping} className="h-[66px] px-5">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activePanel === "similar" && (
            <div className="h-[calc(82vh-74px)] overflow-y-auto px-6 py-5">
              {similarLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-5 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-5/6 rounded bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              ) : similarExercise ? (
                <div className="space-y-5">
                  <MarkdownRenderer content={similarExercise.content} className="prose prose-slate max-w-none whitespace-pre-wrap" />
                  {similarExercise.type.includes("选择") && similarExercise.options?.length ? (
                    <div className="space-y-2">
                      {similarExercise.options.map((option, index) => {
                        const label = String.fromCharCode(65 + index);
                        return (
                          <label
                            key={`${label}-${option}`}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                              similarOption === label ? "border-indigo-500 bg-indigo-50" : "border-slate-200"
                            }`}
                          >
                            <input type="radio" name="similar-option" checked={similarOption === label} onChange={() => setSimilarOption(label)} />
                            <span className="text-sm text-slate-800">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <Textarea
                      value={similarInput}
                      onChange={(e) => setSimilarInput(e.target.value)}
                      className="min-h-[120px]"
                      placeholder="请输入你的答案..."
                    />
                  )}
                  <Button onClick={submitSimilarAnswer}>提交验证</Button>
                  {similarFeedback && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className={`mb-2 flex items-center font-medium ${similarFeedback.correct ? "text-emerald-600" : "text-rose-600"}`}>
                        {similarFeedback.correct ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                        {similarFeedback.correct ? "回答正确" : `回答有误，正确答案：${similarFeedback.answer}`}
                      </div>
                      <MarkdownRenderer content={similarExercise.analysis} className="prose prose-sm max-w-none prose-slate whitespace-pre-wrap" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-slate-500">暂无变式题内容</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
