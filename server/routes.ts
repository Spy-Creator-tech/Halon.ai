import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateAIResponse, generateContentByType } from "./services/openai";
import { aiRequestSchema, quickActionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = aiRequestSchema.parse(req.body);
      
      const response = await generateAIResponse(message, conversationHistory);
      
      res.json({
        response,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ 
        error: "Failed to process chat request",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Content generation endpoint
  app.post("/api/generate-content", async (req, res) => {
    try {
      const { type, topic, ...additionalParams } = req.body;
      
      if (!type || !topic) {
        return res.status(400).json({ error: "Type and topic are required" });
      }

      const content = await generateContentByType(type, topic, additionalParams);
      
      res.json({
        content,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Content generation API error:", error);
      res.status(500).json({ 
        error: "Failed to generate content",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Quick actions endpoint (for device controls)
  app.post("/api/quick-action", async (req, res) => {
    try {
      const { action, parameters } = quickActionSchema.parse(req.body);
      
      // In a real mobile app, these would integrate with device APIs
      const actionResponses = {
        flashlight: "Flashlight toggle command sent",
        call: `Opening phone app${parameters?.contact ? ` to call ${parameters.contact}` : ''}`,
        whatsapp: `Opening WhatsApp${parameters?.contact ? ` to message ${parameters.contact}` : ''}`,
        music: "Opening music player",
        youtube: `Opening YouTube${parameters?.search ? ` to search for ${parameters.search}` : ''}`,
        email: `Opening email composer${parameters?.recipient ? ` to ${parameters.recipient}` : ''}`,
      };
      
      res.json({
        success: true,
        message: actionResponses[action],
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Quick action API error:", error);
      res.status(500).json({ 
        error: "Failed to execute quick action",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
