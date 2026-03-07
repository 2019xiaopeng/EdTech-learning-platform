"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Target, ArrowLeft, Loader2, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { askAI, generateSimilarQuestions, generateKnowledgeExplanation } from "@/services/api";
import { toast } from "sonner";
import { InsightKind } from "@/types";

function formatQuestionForDisplay(input: string) {
  const lines = input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    return input;
  }
  const optionPattern = /^([A-HＡ-Ｈ])[\.\、\．\)]\s*(.+)$/;
  const options = lines
    .map((line) => {
      const matched = line.match(optionPattern);
      if (!matched) {
        return null;
      }
      return { label: matched[1].toUpperCase(), text: matched[2] };
    })
    .filter((item): item is { label: string; text: string } => item !== null);
  if (options.length >= 2) {
    const firstOptionLine = lines.findIndex((line) => optionPattern.test(line));
    const stem = firstOptionLine > 0 ? lines.slice(0, firstOptionLine).join("\n\n") : "";
    const optionsMd = options.map((item) => `- **${item.label}.** ${item.text}`).join("\n");
    return [stem, optionsMd].filter(Boolean).join("\n\n");
  }
  return lines.join("\n\n");
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

  const insightControllersRef = useRef<Record<InsightKind, AbortController | null>>({
    knowledge: null,
    similar: null,
  });
  const chatControllerRef = useRef<AbortController | null>(null);
  const insightRequestIdRef = useRef(0);

  useEffect(() => {
    if (!paper) {
      router.push("/");
      return;
    }
    setActivePaper(id);
  }, [paper, router, id, setActivePaper]);

  if (!paper) return null;

  const activeQuestion = paper.questions.find((q) => q.id === activeQuestionId);
  const currentChat = activeQuestionId ? chatHistory[`${id}:${activeQuestionId}`] || [] : [];
  const displayQuestionText = useMemo(
    () => formatQuestionForDisplay(activeQuestion?.text || ""),
    [activeQuestion?.text]
  );
  const displayedInsight = activeQuestion && activeInsightTab ? getInsightCache(id, activeQuestion.id, activeInsightTab) : null;

  const handleQuestionClick = (questionId: string) => {
    setActiveQuestion(id, questionId);
    setIsChatOpen(false);
    setActiveInsightTab(null);
    Object.values(insightControllersRef.current).forEach((controller) => controller?.abort());
    setInsightLoading({ knowledge: false, similar: false });
  };

  const handleSendMessage = async (text: string = chatInput) => {
    if (!text.trim() || !activeQuestion) return;

    const userMessage = { id: Date.now().toString(), role: "user" as const, text };
    const conversation = [...currentChat, userMessage];
    appendChatMessage(id, activeQuestion.id, userMessage);
    setChatInput("");
    setIsAiTyping(true);
    chatControllerRef.current?.abort();
    const controller = new AbortController();
    chatControllerRef.current = controller;

    try {
      const response = await askAI(activeQuestion.text, conversation, text, controller.signal);
      appendChatMessage(id, activeQuestion.id, {
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
      appendChatMessage(id, activeQuestion.id, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: message,
      });
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAction = async (type: InsightKind) => {
    if (!activeQuestion) return;
    setActiveInsightTab(type);
    const cached = getInsightCache(id, activeQuestion.id, type);
    if (cached) {
      return;
    }
    Object.values(insightControllersRef.current).forEach((controller) => controller?.abort());
    const controller = new AbortController();
    insightControllersRef.current[type] = controller;
    const requestId = insightRequestIdRef.current + 1;
    insightRequestIdRef.current = requestId;
    setInsightLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const content =
        type === "knowledge"
          ? await generateKnowledgeExplanation(activeQuestion.text, controller.signal)
          : await generateSimilarQuestions(activeQuestion.text, controller.signal);
      if (requestId === insightRequestIdRef.current) {
        setInsightCache(id, activeQuestion.id, type, content);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      const message = error instanceof Error ? error.message : "生成内容失败，请重试。";
      toast.error(message);
    } finally {
      if (requestId === insightRequestIdRef.current) {
        setInsightLoading((prev) => ({ ...prev, [type]: false }));
      }
    }
  };

  const maxX = Math.max(imageNaturalSize.width, ...paper.questions.map((question) => question.box.xmax), 1000);
  const maxY = Math.max(imageNaturalSize.height, ...paper.questions.map((question) => question.box.ymax), 1000);

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
        {/* Left Panel: Image Viewer */}
        <ResizablePanel defaultSize={60} minSize={30} className="relative bg-slate-100/70 p-4 flex flex-col">
          <Card className="flex-1 overflow-hidden flex flex-col shadow-sm border-slate-200">
            <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-medium text-slate-700">原卷展示</CardTitle>
            </CardHeader>
            <div className="flex-1 relative overflow-auto bg-slate-200/50 p-4 flex items-center justify-center">
              <div className="relative inline-block shadow-md bg-white">
                <img
                  src={paper.imageUrl}
                  alt="Paper"
                  className="max-w-full h-auto block"
                  onLoad={(event) =>
                    setImageNaturalSize({
                      width: event.currentTarget.naturalWidth || 0,
                      height: event.currentTarget.naturalHeight || 0,
                    })
                  }
                />
                {paper.questions.map((q) => {
                  const isActive = q.id === activeQuestionId;
                  return (
                    <div
                      key={q.id}
                      onClick={() => handleQuestionClick(q.id)}
                      className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? "border-indigo-500 bg-indigo-500/20 z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                          : "border-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
                      }`}
                      style={{
                        top: `${(q.box.ymin / maxY) * 100}%`,
                        left: `${(q.box.xmin / maxX) * 100}%`,
                        height: `${((q.box.ymax - q.box.ymin) / maxY) * 100}%`,
                        width: `${((q.box.xmax - q.box.xmin) / maxX) * 100}%`,
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

        {/* Right Panel: Workspace */}
        <ResizablePanel defaultSize={40} minSize={30} className="bg-white flex flex-col">
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
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">题目导航</h3>
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-2 pb-2">
                      {paper.questions.map((question, index) => {
                        const active = question.id === activeQuestionId;
                        return (
                          <button
                            key={question.id}
                            type="button"
                            onClick={() => handleQuestionClick(question.id)}
                            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                              active
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                            }`}
                          >
                            第{index + 1}题
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">识别结果</h3>
                <div className="prose prose-sm max-w-none prose-slate bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap leading-7">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {displayQuestionText}
                  </ReactMarkdown>
                </div>

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
                    <Button variant="ghost" size="icon" onClick={() => setActiveInsightTab(null)}>
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
                      <div className="prose prose-sm prose-slate max-w-none pr-2 whitespace-pre-wrap leading-7">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {displayedInsight?.content || "暂无内容"}
                        </ReactMarkdown>
                      </div>
                    </ScrollArea>
                  )}
                </div>
              )}

              {isChatOpen && (
                <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
                  <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                    <h3 className="font-medium flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-indigo-600" />
                      AI 导师
                    </h3>
                  </div>
                  
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      {currentChat.length === 0 && (
                        <div className="text-center text-slate-500 text-sm py-8">
                          发送消息开始苏格拉底式的探讨吧。
                        </div>
                      )}
                      
                      {currentChat.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            msg.role === "user" 
                              ? "bg-indigo-600 text-white rounded-tr-sm" 
                              : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                          }`}>
                            <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                            
                            {/* Render Options if any */}
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
                  </ScrollArea>

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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
