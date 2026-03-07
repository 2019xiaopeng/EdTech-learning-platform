import { create } from "zustand";
import { Paper, ChatMessage } from "../types";

interface WorkspaceState {
  papers: Record<string, Paper>;
  activePaperId: string | null;
  activeQuestionId: string | null;
  chatHistory: Record<string, ChatMessage[]>;
  isProcessing: boolean;
  globalError: string | null;

  addPaper: (paper: Paper) => void;
  setActivePaper: (id: string) => void;
  setActiveQuestion: (id: string | null) => void;
  updateQuestionText: (paperId: string, questionId: string, text: string) => void;
  appendChatMessage: (questionId: string, message: ChatMessage) => void;
  clearChatHistory: (questionId: string) => void;
  setProcessing: (value: boolean) => void;
  setGlobalError: (message: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  papers: {},
  activePaperId: null,
  activeQuestionId: null,
  chatHistory: {},
  isProcessing: false,
  globalError: null,

  addPaper: (paper) =>
    set((state) => {
      const nextQuestionId = paper.questions[0]?.id ?? null;
      return {
        papers: { ...state.papers, [paper.id]: paper },
        activePaperId: paper.id,
        activeQuestionId: nextQuestionId,
      };
    }),

  setActivePaper: (id) =>
    set((state) => {
      const firstQuestionId = state.papers[id]?.questions[0]?.id ?? null;
      return { activePaperId: id, activeQuestionId: state.activeQuestionId ?? firstQuestionId };
    }),

  setActiveQuestion: (id) => set({ activeQuestionId: id }),

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

  appendChatMessage: (questionId, message) =>
    set((state) => {
      const history = state.chatHistory[questionId] || [];
      return {
        chatHistory: {
          ...state.chatHistory,
          [questionId]: [...history, message],
        },
      };
    }),

  clearChatHistory: (questionId) =>
    set((state) => {
      const newHistory = { ...state.chatHistory };
      delete newHistory[questionId];
      return { chatHistory: newHistory };
    }),
  setProcessing: (value) => set({ isProcessing: value }),
  setGlobalError: (message) => set({ globalError: message }),
}));
