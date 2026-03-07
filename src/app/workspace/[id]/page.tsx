"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Target, ArrowLeft, Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { askAI, generateSimilarQuestions, generateKnowledgeExplanation } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Workspace() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { papers, activeQuestionId, setActiveQuestion, setActivePaper, chatHistory, appendChatMessage } = useWorkspaceStore();
  const paper = papers[id || ""];

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const [dialogContent, setDialogContent] = useState<{ title: string; content: string } | null>(null);
  const [isDialogLoading, setIsDialogLoading] = useState(false);

  useEffect(() => {
    if (!paper) {
      router.push("/");
      return;
    }
    setActivePaper(id);
  }, [paper, router, id, setActivePaper]);

  if (!paper) return null;

  const activeQuestion = paper.questions.find((q) => q.id === activeQuestionId);
  const currentChat = activeQuestionId ? chatHistory[activeQuestionId] || [] : [];

  const handleQuestionClick = (questionId: string) => {
    setActiveQuestion(questionId);
    setIsChatOpen(false);
  };

  const handleSendMessage = async (text: string = chatInput) => {
    if (!text.trim() || !activeQuestion) return;

    const userMessage = { id: Date.now().toString(), role: "user" as const, text };
    appendChatMessage(activeQuestion.id, userMessage);
    setChatInput("");
    setIsAiTyping(true);

    try {
      const response = await askAI(activeQuestion.text, currentChat, text);
      appendChatMessage(activeQuestion.id, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: response.message,
        options: response.options,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "对话失败，请重试。";
      toast.error(message);
      appendChatMessage(activeQuestion.id, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: message,
      });
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAction = async (type: "knowledge" | "similar") => {
    if (!activeQuestion) return;
    
    setIsDialogLoading(true);
    setDialogContent({ title: type === "knowledge" ? "知识点讲解" : "相似题目", content: "" });
    
    try {
      const content = type === "knowledge" 
        ? await generateKnowledgeExplanation(activeQuestion.text)
        : await generateSimilarQuestions(activeQuestion.text);
        
      setDialogContent({
        title: type === "knowledge" ? "知识点讲解" : "相似题目",
        content,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "生成内容失败，请重试。";
      toast.error(message);
      setDialogContent({
        title: "错误",
        content: message,
      });
    } finally {
      setIsDialogLoading(false);
    }
  };

  const maxX = Math.max(...paper.questions.map((question) => question.box.xmax), 1000);
  const maxY = Math.max(...paper.questions.map((question) => question.box.ymax), 1000);

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
                <img src={paper.imageUrl} alt="Paper" className="max-w-full h-auto block" />
                
                {/* Render Bounding Boxes */}
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
              {/* Top: OCR Result */}
              <div className="p-6 border-b border-slate-100 shrink-0">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">识别结果</h3>
                <div className="prose prose-sm max-w-none prose-slate bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {activeQuestion.text}
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

              {/* Bottom: Chat Area (if open) */}
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

      {/* Dialog for Knowledge / Similar Questions */}
      <Dialog open={!!dialogContent} onOpenChange={(open) => !open && setDialogContent(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 mt-4">
            {isDialogLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
                <p>正在生成内容...</p>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none pb-6">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {dialogContent?.content || ""}
                </ReactMarkdown>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
