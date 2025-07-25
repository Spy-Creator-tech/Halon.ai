import { apiRequest } from "./queryClient";
import type { ChatMessage, AIRequest, AIResponse } from "@shared/schema";

export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> {
  const response = await apiRequest("POST", "/api/chat", {
    message,
    conversationHistory,
  });
  
  return await response.json();
}

export async function generateContent(
  type: 'essay' | 'blog' | 'summary' | 'code',
  topic: string,
  additionalParams?: Record<string, string>
): Promise<{ content: string; timestamp: Date }> {
  const response = await apiRequest("POST", "/api/generate-content", {
    type,
    topic,
    ...additionalParams,
  });
  
  return await response.json();
}

export async function executeQuickAction(
  action: string,
  parameters?: Record<string, string>
): Promise<{ success: boolean; message: string; timestamp: Date }> {
  const response = await apiRequest("POST", "/api/quick-action", {
    action,
    parameters,
  });
  
  return await response.json();
}
