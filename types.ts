export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface GeneratedSite {
  html: string;
  version: number;
  timestamp: number;
}

export type ViewMode = 'split' | 'chat' | 'preview';

export type DeviceView = 'desktop' | 'tablet' | 'mobile';
