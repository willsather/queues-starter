export interface IncomingMessage {
  content: string;
  timestamp: number;
}

export interface Message {
  status: "processing" | "completed";
  id: string;
  content: string;
  timestamp: number;
  startTime: number;
  endTime?: number;
  waitTime?: number;
}

export const messages = new Map<string, Message>();
