export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface OcrSegment {
  id: string;
  text: string;
  content?: string;
  box: BoundingBox;
  pos: Point[];
  confidence?: number;
}

export interface Question {
  id: string | number;
  type: string;
  content: string;
  options?: string[];
  subQuestions?: { id: string; content: string }[];
  pos: Point[];
  knowledgeCache?: string;
  similarCache?: string;
  text?: string;
  box?: BoundingBox;
  source?: "ocr" | "deepseek";
  confidence?: number;
}

export interface ChatOption {
  id: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  options?: ChatOption[];
}

export type InsightKind = "knowledge" | "similar";

export interface InsightState {
  content: string;
  updatedAt: number;
}

export interface Paper {
  id: string;
  name?: string;
  sourceUrl?: string;
  imageUrl: string;
  questions: Question[];
  createdAt: number;
}

export interface PaperRecord {
  id: string;
  name: string;
  date: number;
  questions: Question[];
  sourceUrl: string;
}

export type ActivePanel = "analysis" | "chat" | "similar" | null;

export interface SimilarExercise {
  content: string;
  type: string;
  options?: string[];
  answer: string;
  analysis: string;
}

export interface UploadPaperResult {
  id: string;
  imageUrl: string;
}

export interface ProcessPaperResult {
  paper: Paper;
  ocrSegments: OcrSegment[];
}
