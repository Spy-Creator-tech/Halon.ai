import type { ChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for Halon AI assistant data
export interface IStorage {
  getMessages(): Promise<ChatMessage[]>;
  addMessage(message: ChatMessage): Promise<void>;
  clearMessages(): Promise<void>;
}

export class MemStorage implements IStorage {
  private messages: ChatMessage[] = [];

  async getMessages(): Promise<ChatMessage[]> {
    return [...this.messages];
  }

  async addMessage(message: ChatMessage): Promise<void> {
    this.messages.push(message);
  }

  async clearMessages(): Promise<void> {
    this.messages = [];
  }
}

export const storage = new MemStorage();
