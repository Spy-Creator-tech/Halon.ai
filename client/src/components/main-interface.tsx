import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./chat-panel";
import { QuickActions } from "./quick-actions";
import { AICapabilities } from "./ai-capabilities";
import { VoiceVisualizer } from "./voice-visualizer";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { sendChatMessage, getChatHistory, clearChatHistory } from "@/lib/openai-client";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@shared/schema";
import halonLogo from "@assets/halon-logo_1753438304132.png";

export function MainInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Say "Ok Halon" to activate');
  const [showVoiceVisualizer, setShowVoiceVisualizer] = useState(false);
  const [voiceRingsVisible, setVoiceRingsVisible] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [sessionId] = useState("default");
  const { toast } = useToast();

  const { speak, isSpeaking } = useTextToSpeech();

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const { messages: historyMessages } = await getChatHistory(sessionId);
        setMessages(historyMessages);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        toast({
          title: "History Load Error",
          description: "Failed to load previous conversations",
          variant: "destructive",
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [sessionId, toast]);

  const { isListening, isSupported, hasPermission, startListening, stopListening, checkMicrophonePermission } = useSpeechRecognition({
    onResult: handleVoiceResult,
    onError: (error) => {
      // Only show error if it's not an "aborted" error
      if (!error.includes("aborted")) {
        toast({
          title: "Voice Recognition Issue",
          description: error,
          variant: "destructive",
        });
      }
      setShowVoiceVisualizer(false);
      setVoiceRingsVisible(false);
      setVoiceStatus(isSupported ? 'Say "Ok Halon" to activate' : 'Voice not supported - use text input');
    },
  });

  function handleVoiceResult(transcript: string) {
    console.log("Voice transcript:", transcript);
    
    // Check for wake word "Ok Halon" or just process any speech
    const cleanTranscript = transcript.toLowerCase().trim();
    let messageToProcess = transcript;
    
    if (cleanTranscript.startsWith("ok halon")) {
      messageToProcess = transcript.substring(8).trim(); // Remove "Ok Halon"
    }
    
    if (messageToProcess.length > 0) {
      setShowVoiceVisualizer(false);
      setVoiceRingsVisible(false);
      stopListening();
      handleSendMessage(messageToProcess);
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setVoiceStatus("Processing...");

    try {
      // Send message with sessionId header  
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "session-id": sessionId,
        },
        body: JSON.stringify({
          message,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the AI response
      speak(data.response);
      
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setVoiceStatus('Say "Ok Halon" to activate');
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearChatHistory(sessionId);
      setMessages([]);
      toast({
        title: "History Cleared",
        description: "All conversation history has been cleared",
      });
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast({
        title: "Error",
        description: "Failed to clear conversation history",
        variant: "destructive",
      });
    }
  };

  const handleQuickActionComplete = (message: string) => {
    const actionMessage: ChatMessage = {
      id: `action-${Date.now()}`,
      content: `Action: ${message}`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, actionMessage]);
  };

  const toggleVoiceListening = () => {
    if (isListening) {
      stopListening();
      setShowVoiceVisualizer(false);
      setVoiceRingsVisible(false);
      setVoiceStatus('Say "Ok Halon" to activate');
    } else {
      startListening();
      setShowVoiceVisualizer(true);
      setVoiceRingsVisible(true);
      setVoiceStatus("Listening... Speak now");
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar to activate voice (when not typing)
      if (e.code === "Space" && e.target === document.body && !isListening) {
        e.preventDefault();
        toggleVoiceListening();
      }
      
      // Escape to stop listening
      if (e.code === "Escape" && isListening) {
        stopListening();
        setShowVoiceVisualizer(false);
        setVoiceRingsVisible(false);
        setVoiceStatus('Say "Ok Halon" to activate');
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isListening, stopListening]);

  return (
    <>
      <div className="fixed inset-0">
        {/* Background animated rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500 rounded-full opacity-20 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-purple-500 rounded-full opacity-30 animate-spin" style={{ animationDirection: "reverse", animationDuration: "4s" }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-300 rounded-full opacity-10 animate-spin" style={{ animationDuration: "5s" }} />
        </div>

        {/* Header */}
        <header className="relative z-10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={halonLogo} alt="Halon Logo" className="w-12 h-12 animate-float" />
              <div>
                <h1 className="text-2xl font-orbitron font-bold gradient-text">HALON</h1>
                <p className="text-gray-400 text-sm">AI Assistant Active</p>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Online</span>
              </div>
              <Button 
                onClick={handleClearHistory}
                className="p-2 rounded-full glass-effect hover:bg-red-500/20 transition-all duration-300 bg-transparent border-0"
                title="Clear conversation history"
              >
                <i className="fas fa-trash text-red-400" />
              </Button>
              <Button className="p-2 rounded-full glass-effect hover:bg-white/10 transition-all duration-300 bg-transparent border-0">
                <i className="fas fa-cog text-cyan-400" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="relative z-10 px-6 pb-6 h-full">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Left panel - Quick actions */}
            <div className="col-span-3">
              <QuickActions onActionComplete={handleQuickActionComplete} />
            </div>

            {/* Center panel - Voice interface and chat */}
            <div className="col-span-6">
              <div className="h-full flex flex-col">
                {/* Voice activation area */}
                <div className="flex-1 flex items-center justify-center relative mb-6">
                  {/* Voice rings animation */}
                  {voiceRingsVisible && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="voice-ring w-32 h-32" style={{ animationDelay: "0s" }} />
                      <div className="voice-ring w-40 h-40" style={{ animationDelay: "0.2s" }} />
                      <div className="voice-ring w-48 h-48" style={{ animationDelay: "0.4s" }} />
                    </div>
                  )}

                  {/* Central voice button */}
                  <Button
                    onClick={toggleVoiceListening}
                    disabled={!isSupported}
                    className={`relative z-10 w-32 h-32 rounded-full text-white text-3xl hover:scale-110 transition-all duration-300 border-0 ${
                      isSupported 
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse-glow" 
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                    title={!isSupported ? "Voice recognition not supported in this browser" : "Click to activate voice commands"}
                  >
                    <i className={`fas ${isListening ? "fa-stop" : "fa-microphone"}`} />
                  </Button>

                  {/* Voice status text */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-16">
                    <p className="text-white text-lg font-orbitron text-center">
                      {isProcessing ? "Processing..." : voiceStatus}
                    </p>
                    {!isSupported && (
                      <div className="text-center mt-4">
                        <p className="text-red-400 text-sm mb-2">
                          Voice recognition not supported in this browser
                        </p>
                        <p className="text-gray-400 text-xs">
                          Try Chrome, Edge, or Safari for voice features
                        </p>
                        <p className="text-cyan-400 text-sm mt-2">
                          💬 Use the text chat below instead!
                        </p>
                      </div>
                    )}
                    {isSupported && hasPermission === false && (
                      <Button
                        onClick={checkMicrophonePermission}
                        className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                      >
                        <i className="fas fa-microphone-slash mr-2" />
                        Enable Microphone
                      </Button>
                    )}
                  </div>
                </div>

                {/* Chat messages area */}
                {isLoadingHistory ? (
                  <div className="flex-1 glass-effect rounded-2xl p-6 flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-spinner fa-spin text-cyan-400 text-2xl mb-2" />
                      <p className="text-gray-300">Loading conversation history...</p>
                    </div>
                  </div>
                ) : (
                  <ChatPanel
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isProcessing={isProcessing}
                  />
                )}
              </div>
            </div>

            {/* Right panel - AI capabilities */}
            <div className="col-span-3">
              <AICapabilities />
            </div>
          </div>
        </main>
      </div>

      {/* Voice Visualizer Overlay */}
      <VoiceVisualizer 
        isVisible={showVoiceVisualizer} 
        isListening={isListening && !isProcessing} 
      />
    </>
  );
}
