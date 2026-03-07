import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Paper, ChatMessage, InsightKind, InsightState, Question } from "../types";

interface WorkspaceState {
  papers: Record<string, Paper>;
  activePaperId: string | null;
  activeQuestionByPaper: Record<string, string | null>;
  chatHistory: Record<string, ChatMessage[]>;
  insightCache: Record<string, InsightState>;
  isProcessing: boolean;
  processStep: string;
  globalError: string | null;

  addPaper: (paper: Paper) => void;
  setActivePaper: (id: string) => void;
  setActiveQuestion: (paperId: string, questionId: string | null) => void;
  getActiveQuestionId: (paperId: string) => string | null;
  updateQuestionText: (paperId: string, questionId: string, text: string) => void;
  appendChatMessage: (paperId: string, questionId: string, message: ChatMessage) => void;
  clearChatHistory: (paperId: string, questionId: string) => void;
  setInsightCache: (paperId: string, questionId: string, kind: InsightKind, content: string) => void;
  getInsightCache: (paperId: string, questionId: string, kind: InsightKind) => InsightState | null;
  setProcessStep: (step: string) => void;
  setProcessing: (value: boolean) => void;
  setGlobalError: (message: string | null) => void;
}

function buildChatKey(paperId: string, questionId: string) {
  return `${paperId}:${questionId}`;
}

function buildInsightKey(paperId: string, questionId: string, kind: InsightKind) {
  return `${paperId}:${questionId}:${kind}`;
}

function normalizeQuestion(question: Question): Question {
  const fallbackPos = question.box
    ? [
        { x: question.box.xmin, y: question.box.ymin },
        { x: question.box.xmax, y: question.box.ymin },
        { x: question.box.xmax, y: question.box.ymax },
        { x: question.box.xmin, y: question.box.ymax },
      ]
    : [];
  return {
    ...question,
    id: question.id,
    type: question.type || "未知题型",
    content: question.content || question.text || "",
    pos: question.pos?.length ? question.pos : fallbackPos,
  };
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      papers: {},
      activePaperId: null,
      activeQuestionByPaper: {},
      chatHistory: {},
      insightCache: {},
      isProcessing: false,
      processStep: "",
      globalError: null,

      addPaper: (paper) =>
        set((state) => {
          const normalizedPaper: Paper = {
            ...paper,
            questions: paper.questions.map((question) => normalizeQuestion(question)),
          };
          const nextQuestionId = paper.questions[0]?.id ?? null;
          return {
            papers: { ...state.papers, [paper.id]: normalizedPaper },
            activePaperId: normalizedPaper.id,
            activeQuestionByPaper: {
              ...state.activeQuestionByPaper,
              [normalizedPaper.id]: nextQuestionId ? String(nextQuestionId) : null,
            },
          };
        }),

      setActivePaper: (id) =>
        set((state) => {
          const firstQuestionId = state.papers[id]?.questions[0]?.id;
          return {
            activePaperId: id,
            activeQuestionByPaper: {
              ...state.activeQuestionByPaper,
              [id]: state.activeQuestionByPaper[id] ?? (firstQuestionId ? String(firstQuestionId) : null),
            },
          };
        }),

      setActiveQuestion: (paperId, questionId) =>
        set((state) => ({
          activeQuestionByPaper: {
            ...state.activeQuestionByPaper,
            [paperId]: questionId,
          },
        })),

      getActiveQuestionId: (paperId) => get().activeQuestionByPaper[paperId] ?? null,

      updateQuestionText: (paperId, questionId, text) =>
        set((state) => {
          const paper = state.papers[paperId];
          if (!paper) return state;

          const updatedQuestions = paper.questions.map((q) =>
            String(q.id) === questionId ? { ...q, text, content: text } : q
          );

          return {
            papers: {
              ...state.papers,
              [paperId]: { ...paper, questions: updatedQuestions },
            },
          };
        }),

      appendChatMessage: (paperId, questionId, message) =>
        set((state) => {
          const key = buildChatKey(paperId, questionId);
          const history = state.chatHistory[key] || [];
          return {
            chatHistory: {
              ...state.chatHistory,
              [key]: [...history, message],
            },
          };
        }),

      clearChatHistory: (paperId, questionId) =>
        set((state) => {
          const key = buildChatKey(paperId, questionId);
          const newHistory = { ...state.chatHistory };
          delete newHistory[key];
          return { chatHistory: newHistory };
        }),

      setInsightCache: (paperId, questionId, kind, content) =>
        set((state) => {
          const key = buildInsightKey(paperId, questionId, kind);
          const paper = state.papers[paperId];
          const updatedQuestions = paper
            ? paper.questions.map((question) =>
                String(question.id) === questionId
                  ? {
                      ...question,
                      knowledgeCache: kind === "knowledge" ? content : question.knowledgeCache,
                      similarCache: kind === "similar" ? content : question.similarCache,
                    }
                  : question
              )
            : null;
          return {
            papers: paper
              ? {
                  ...state.papers,
                  [paperId]: {
                    ...paper,
                    questions: updatedQuestions || paper.questions,
                  },
                }
              : state.papers,
            insightCache: {
              ...state.insightCache,
              [key]: {
                content,
                updatedAt: Date.now(),
              },
            },
          };
        }),

      getInsightCache: (paperId, questionId, kind) => {
        const key = buildInsightKey(paperId, questionId, kind);
        return get().insightCache[key] ?? null;
      },

      setProcessing: (value) => set({ isProcessing: value }),
      setProcessStep: (step) => set({ processStep: step }),
      setGlobalError: (message) => set({ globalError: message }),
    }),
    {
      name: "workspace-store-v2",
      partialize: (state) => ({
        papers: state.papers,
        activePaperId: state.activePaperId,
        activeQuestionByPaper: state.activeQuestionByPaper,
        chatHistory: state.chatHistory,
        insightCache: state.insightCache,
        processStep: state.processStep,
      }),
    }
  )
);
