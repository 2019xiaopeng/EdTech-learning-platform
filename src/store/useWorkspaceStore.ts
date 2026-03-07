import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Paper, ChatMessage, InsightKind, InsightState } from "../types";

interface WorkspaceState {
  papers: Record<string, Paper>;
  activePaperId: string | null;
  activeQuestionByPaper: Record<string, string | null>;
  chatHistory: Record<string, ChatMessage[]>;
  insightCache: Record<string, InsightState>;
  isProcessing: boolean;
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
  setProcessing: (value: boolean) => void;
  setGlobalError: (message: string | null) => void;
}

function buildChatKey(paperId: string, questionId: string) {
  return `${paperId}:${questionId}`;
}

function buildInsightKey(paperId: string, questionId: string, kind: InsightKind) {
  return `${paperId}:${questionId}:${kind}`;
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
      globalError: null,

      addPaper: (paper) =>
        set((state) => {
          const nextQuestionId = paper.questions[0]?.id ?? null;
          return {
            papers: { ...state.papers, [paper.id]: paper },
            activePaperId: paper.id,
            activeQuestionByPaper: {
              ...state.activeQuestionByPaper,
              [paper.id]: nextQuestionId,
            },
          };
        }),

      setActivePaper: (id) =>
        set((state) => {
          const firstQuestionId = state.papers[id]?.questions[0]?.id ?? null;
          return {
            activePaperId: id,
            activeQuestionByPaper: {
              ...state.activeQuestionByPaper,
              [id]: state.activeQuestionByPaper[id] ?? firstQuestionId,
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
            q.id === questionId ? { ...q, text } : q
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
          return {
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
      }),
    }
  )
);
