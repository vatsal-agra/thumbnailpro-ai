export enum AppStep {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}

export type ThumbnailMode = 'NORMAL' | 'CLICKBAIT';

export interface GenerationConfig {
  videoUrl: string;
  additionalContext: string;
  referenceImages: string[];
}

export interface AnalysisResult {
  summary: string;
  taglineIdeas: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}