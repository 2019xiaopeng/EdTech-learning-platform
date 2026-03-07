"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Target, ArrowLeft, Loader2, Send, X } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  abortAiRequest,
  askAIWithAbort,
  generateKnowledgeExplanationWithAbort,
  generateSimilarQuestionsWithAbort,
} from "@/services/api";
import { toast } from "sonner";
import { InsightKind } from "@/types";
import { QuestionRenderer } from "@/components/question-renderer";
import { MarkdownRenderer } from "@/components/markdown-renderer";

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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState<InsightKind | null>(null);
  const [insightLoading, setInsightLoading] = useState<Record<InsightKind, boolean>>({
    knowledge: false,
    similar: false,
  });
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!paper) {
      router.push("/");
      return;
    }
    setActivePaper(id);
  }, [paper, router, id, setActivePaper]);

  if (!paper) return null;

  const activeQuestion = paper.questions.find((q) => String(q.id) === activeQuestionId);
  const currentChat = activeQuestionId ? chatHistory[`${id}:${activeQuestionId}`] || [] : [];
  const displayedInsight = activeQuestion && activeInsightTab ? getInsightCache(id, String(activeQuestion.id), activeInsightTab) : null;

  const handleQuestionClick = (questionId: string) => {
    setActiveQuestion(id, questionId);
    setIsChatOpen(false);
    setActiveInsightTab(null);
    abortAiRequest("chat");
    abortAiRequest("knowledge");
    abortAiRequest("similar");
    setInsightLoading({ knowledge: false, similar: false });
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
      const message = error instanceof Error ? error.message : "对话失败，请重试。";
      toast.error(message);
      appendChatMessage(id, String(activeQuestion.id), {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: message,
      });
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleOptionSelect = (label: string) => {
    setIsChatOpen(true);
    void handleSendMessage(`我选 ${label}`);
  };

  const handleAction = async (type: InsightKind) => {
    if (!activeQuestion) return;
    setActiveInsightTab(type);
    setInsightLoading((prev) => ({ ...prev, [type]: true }));
    const cacheFromQuestion = type === "knowledge" ? activeQuestion.knowledgeCache : activeQuestion.similarCache;
    const cached = getInsightCache(id, String(activeQuestion.id), type);
    if (cached || cacheFromQuestion) {
      if (!cached && cacheFromQuestion) {
        setInsightCache(id, String(activeQuestion.id), type, cacheFromQuestion);
      }
      setInsightLoading((prev) => ({ ...prev, [type]: false }));
      return;
    }
    if (type === "knowledge") {
      abortAiRequest("similar");
    } else {
      abortAiRequest("knowledge");
    }
    try {
      const result =
        type === "knowledge"
          ? await generateKnowledgeExplanationWithAbort(getQuestionContent(activeQuestion), cacheFromQuestion)
          : await generateSimilarQuestionsWithAbort(getQuestionContent(activeQuestion), cacheFromQuestion);
      setInsightCache(id, String(activeQuestion.id), type, result.content);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      const message = error instanceof Error ? error.message : "生成内容失败，请重试。";
      toast.error(message);
    } finally {
      setInsightLoading((prev) => ({ ...prev, [type]: false }));
    }
  };
  const boundsList = paper.questions.map((question) => getQuestionBounds(question));
  const originalImageWidth = imageNaturalSize.width || Math.max(...boundsList.map((box) => box.xmax), 1);
  const originalImageHeight = imageNaturalSize.height || Math.max(...boundsList.map((box) => box.ymax), 1);

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur flex items-center px-4 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <h1 className="font-semibold text-slate-900">工作区</h1>
      </header>

      <ResizablePanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
        <ResizablePanel defaultSize={60} minSize={30} className="relative bg-slate-100/70 p-4 flex flex-col">
          <Card className="flex-1 overflow-hidden flex flex-col shadow-sm border-slate-200">
            <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-medium text-slate-700">原卷展示</CardTitle>
            </CardHeader>
            <div className="flex-1 relative overflow-auto bg-slate-200/50 p-4 flex items-start justify-center">
              <div className="relative w-full shadow-md bg-white">
                <img
                  src={paper.imageUrl}
                  alt="Paper"
                  className="w-full h-auto object-contain block"
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
                    <div
                      key={q.id}
                      onClick={() => handleQuestionClick(String(q.id))}
                      className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "border-indigo-500 bg-indigo-500/20 z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                          : "border-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
                      }`}
                      style={{
                        top: `${(box.ymin / originalImageHeight) * 100}%`,
                        left: `${(box.xmin / originalImageWidth) * 100}%`,
                        height: `${((box.ymax - box.ymin) / originalImageHeight) * 100}%`,
                        width: `${((box.xmax - box.xmin) / originalImageWidth) * 100}%`,
                      }}
                    >
                      {isActive && (
                        <div className="absolute -top-6 left-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-sm whitespace-nowrap">
                          当前选中题目
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40} minSize={30} className="bg-white">
          <div className="flex h-full overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              {!activeQuestion ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center">
                  <div>
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>请在左侧点击选择一道题目开始分析。</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">识别结果</h3>
                    <QuestionRenderer question={activeQuestion} onOptionSelect={handleOptionSelect} />
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <Button variant="outline" className="w-full" onClick={() => handleAction("knowledge")}>
                        <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
                        知识点
                      </Button>
                      <Button variant="default" className="w-full" onClick={() => setIsChatOpen(true)}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        苏格拉底对话
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => handleAction("similar")}>
                        <Target className="w-4 h-4 mr-2 text-emerald-600" />
                        相似题目
                      </Button>
                    </div>
                  </div>

                  {activeInsightTab && (
                    <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={activeInsightTab === "knowledge" ? "default" : "outline"}
                            onClick={() => handleAction("knowledge")}
                          >
                            知识点
                          </Button>
                          <Button
                            size="sm"
                            variant={activeInsightTab === "similar" ? "default" : "outline"}
                            onClick={() => handleAction("similar")}
                          >
                            相似题
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setActiveInsightTab(null);
                            abortAiRequest("knowledge");
                            abortAiRequest("similar");
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {insightLoading[activeInsightTab] && !displayedInsight?.content ? (
                        <div className="flex items-center text-sm text-slate-500">
                          <Loader2 className="w-4 h-4 animate-spin mr-2 text-indigo-600" />
                          正在生成内容...
                        </div>
                      ) : (
                        <ScrollArea className="max-h-64">
                          <MarkdownRenderer
                            content={displayedInsight?.content || "暂无内容"}
                            className="prose prose-sm max-w-none prose-slate pr-2 whitespace-pre-wrap leading-7"
                          />
                        </ScrollArea>
                      )}
                    </div>
                  )}

                  {isChatOpen && (
                    <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
                      <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                        <h3 className="font-medium flex items-center">
                          <MessageCircle className="w-4 h-4 mr-2 text-indigo-600" />
                          AI 导师
                        </h3>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-6 px-2">
                          {currentChat.length === 0 && (
                            <div className="text-center text-slate-500 text-sm py-8">
                              发送消息开始苏格拉底式的探讨吧。
                            </div>
                          )}

                          {currentChat.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                  msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-tr-sm"
                                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                                }`}
                              >
                                <MarkdownRenderer
                                  content={msg.text}
                                  className={
                                    msg.role === "user"
                                      ? "prose prose-sm max-w-none prose-invert whitespace-pre-wrap leading-7"
                                      : "prose prose-sm max-w-none prose-slate whitespace-pre-wrap leading-7"
                                  }
                                />
                                {msg.options && msg.options.length > 0 && (
                                  <div className="mt-4 space-y-2">
                                    {msg.options.map((opt) => (
                                      <Button
                                        key={opt.id}
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal"
                                        onClick={() => handleSendMessage(opt.text)}
                                      >
                                        {opt.text}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}

                          {isAiTyping && (
                            <div className="flex justify-start">
                              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                        <div className="flex items-end space-x-2">
                          <Textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="输入您的问题或想法..."
                            className="min-h-[60px] resize-none"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            className="h-[60px] w-[60px] shrink-0 rounded-xl"
                            onClick={() => handleSendMessage()}
                            disabled={!chatInput.trim() || isAiTyping}
                          >
                            <Send className="w-5 h-5" />
                          </Button>
                          </div>
                        </div>
                      </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-20 border-l border-slate-200 bg-slate-50/70">
              <div className="py-3 text-center text-[11px] font-medium text-slate-500">导航</div>
              <ScrollArea className="h-[calc(100%-2rem)] px-2 pb-4">
                <div className="flex flex-col items-center gap-2">
                  {paper.questions.map((question, index) => {
                    const active = String(question.id) === activeQuestionId;
                    return (
                      <button
                        key={String(question.id)}
                        type="button"
                        onClick={() => handleQuestionClick(String(question.id))}
                        className={`h-9 w-9 rounded-full text-xs font-semibold transition-all ${
                          active
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
