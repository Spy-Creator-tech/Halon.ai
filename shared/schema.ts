import { z } from "zod";
import { pgTable, text, timestamp, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Database tables
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' | 'ai'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sessionId: text("session_id").default("default").notNull(),
});

export const quickActions = pgTable("quick_actions", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  parameters: jsonb("parameters"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sessionId: text("session_id").default("default").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const chatMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  sender: z.enum(['user', 'ai']),
  timestamp: z.date(),
});

export const aiRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationHistory: z.array(chatMessageSchema).optional().default([]),
});

export const aiResponseSchema = z.object({
  response: z.string(),
  timestamp: z.date(),
});

export const quickActionSchema = z.object({
  action: z.enum(['flashlight', 'call', 'whatsapp', 'music', 'youtube', 'email']),
  parameters: z.record(z.string()).optional(),
});

// Insert schemas
export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const insertQuickActionSchema = createInsertSchema(quickActions);
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type AIRequest = z.infer<typeof aiRequestSchema>;
export type AIResponse = z.infer<typeof aiResponseSchema>;
export type QuickAction = z.infer<typeof quickActionSchema>;

export type DbChatMessage = typeof chatMessages.$inferSelect;
export type DbQuickAction = typeof quickActions.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertQuickAction = z.infer<typeof insertQuickActionSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
