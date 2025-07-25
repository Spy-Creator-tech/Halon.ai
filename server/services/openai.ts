import OpenAI from "openai";
import type { ChatMessage } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-api-key-here"
});

export async function generateAIResponse(
  message: string, 
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are Halon, an advanced AI assistant with a futuristic personality. You are helpful, intelligent, and can assist with various tasks including:
        - Answering questions and providing information
        - Creating content like essays, blogs, summaries, and code
        - Helping with device controls and app management
        - Providing step-by-step instructions
        - Translating text between languages
        
        Keep responses concise but informative. Use a professional yet friendly tone that matches your futuristic AI persona.`
      },
      ...conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: "user" as const,
        content: message
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response at this time.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generateContentByType(
  type: 'essay' | 'blog' | 'summary' | 'code',
  topic: string,
  additionalParams?: Record<string, string>
): Promise<string> {
  try {
    let prompt = "";
    
    switch (type) {
      case 'essay':
        prompt = `Write a well-structured essay about "${topic}". Include an introduction, body paragraphs with supporting arguments, and a conclusion.`;
        break;
      case 'blog':
        prompt = `Write an engaging blog post about "${topic}". Make it informative, easy to read, and include practical insights.`;
        break;
      case 'summary':
        prompt = `Provide a comprehensive summary of "${topic}". Include the main points and key takeaways.`;
        break;
      case 'code':
        const language = additionalParams?.language || 'JavaScript';
        prompt = `Write clean, well-commented ${language} code for: ${topic}. Include explanations for complex parts.`;
        break;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Halon, an expert content creator. Provide high-quality, well-structured content based on the user's request."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I couldn't generate the requested content.";
  } catch (error) {
    console.error("Content generation error:", error);
    throw new Error("Failed to generate content");
  }
}
