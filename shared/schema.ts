import { z } from "zod";

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

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type AIRequest = z.infer<typeof aiRequestSchema>;
export type AIResponse = z.infer<typeof aiResponseSchema>;
export type QuickAction = z.infer<typeof quickActionSchema>;
