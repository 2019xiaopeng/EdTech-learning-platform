export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface OcrSegment {
  id: string;
  text: string;
  box: BoundingBox;
  confidence?: number;
}

export interface Question {
  id: string;
  text: string;
  box: BoundingBox;
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

export interface Paper {
  id: string;
  imageUrl: string;
  questions: Question[];
  createdAt: number;
}

export interface UploadPaperResult {
  id: string;
  imageUrl: string;
}

export interface ProcessPaperResult {
  paper: Paper;
  ocrSegments: OcrSegment[];
}
