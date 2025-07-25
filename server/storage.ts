import { chatMessages, quickActions, type DbChatMessage, type InsertChatMessage, type InsertQuickAction, type ChatMessage } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Storage interface for Halon AI assistant data
export interface IStorage {
  getMessages(sessionId?: string): Promise<ChatMessage[]>;
  addMessage(message: Omit<InsertChatMessage, 'id'>): Promise<DbChatMessage>;
  clearMessages(sessionId?: string): Promise<void>;
  logQuickAction(action: Omit<InsertQuickAction, 'id'>): Promise<void>;
  getQuickActionHistory(sessionId?: string, limit?: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getMessages(sessionId: string = "default"): Promise<ChatMessage[]> {
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(desc(chatMessages.timestamp))
      .limit(50);
    
    // Convert database messages to ChatMessage format
    return messages.reverse().map(msg => ({
      id: msg.id.toString(),
      content: msg.content,
      sender: msg.sender as 'user' | 'ai',
      timestamp: msg.timestamp,
    }));
  }

  async addMessage(message: Omit<InsertChatMessage, 'id'>): Promise<DbChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values({
        content: message.content,
        sender: message.sender,
        sessionId: message.sessionId || "default",
      })
      .returning();
    
    return newMessage;
  }

  async clearMessages(sessionId: string = "default"): Promise<void> {
    await db
      .delete(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId));
  }

  async logQuickAction(action: Omit<InsertQuickAction, 'id'>): Promise<void> {
    await db
      .insert(quickActions)
      .values({
        action: action.action,
        parameters: action.parameters || null,
        sessionId: action.sessionId || "default",
      });
  }

  async getQuickActionHistory(sessionId: string = "default", limit: number = 20): Promise<any[]> {
    return await db
      .select()
      .from(quickActions)
      .where(eq(quickActions.sessionId, sessionId))
      .orderBy(desc(quickActions.timestamp))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
