import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "@shared/schema";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export function ChatPanel({ messages, onSendMessage, isProcessing }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 glass-effect rounded-2xl p-6 overflow-hidden flex flex-col">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex items-start space-x-3">
            <div className="chat-bubble-ai p-4 max-w-md">
              <p className="text-white mb-3">
                Hello! I'm Halon, your AI assistant. I can help you control your device, 
                answer questions, and create content.
              </p>
              <div className="text-gray-300 text-sm space-y-2">
                <p><strong>Voice commands:</strong> Click the microphone and say "Ok Halon" followed by your request (Chrome/Edge/Safari only)</p>
                <p><strong>Text chat:</strong> Type your message below - works in all browsers!</p>
                <p><strong>Quick actions:</strong> Use the buttons on the left panel</p>
                <p className="text-cyan-300">Try asking me: "Tell me about AI", "Write a poem", "Generate code", etc.</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === "user" ? "justify-end" : ""
            }`}
          >
            <div
              className={`${
                message.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"
              } p-4 max-w-md`}
            >
              <p className="text-white whitespace-pre-wrap">{message.content}</p>
              <p className="text-gray-300 text-xs mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-start space-x-3">
            <div className="chat-bubble-ai p-4 max-w-md">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="text-white text-sm ml-2">Halon is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message or use voice command..."
            className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:scale-105 transition-transform duration-300"
          >
            <i className="fas fa-paper-plane" />
          </Button>
        </div>
      </form>
    </div>
  );
}
