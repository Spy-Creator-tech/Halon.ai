import { useState, useEffect, useCallback, useRef } from "react";

// Extend Window interface to include speech recognition properties
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language?: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export function useSpeechRecognition({
  onResult,
  onError,
  continuous = false,
  language = "en-US",
}: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          onResult(finalTranscript.trim());
        }
      };
      
      recognition.onerror = (event: any) => {
        const errorType = event.error;
        console.error("Speech recognition error:", errorType);
        
        // Handle different error types
        if (errorType === 'aborted') {
          // Ignore aborted errors as they're expected when stopping/starting
          return;
        }
        
        if (errorType === 'not-allowed') {
          onError?.("Microphone access denied. Please allow microphone permissions.");
        } else if (errorType === 'no-speech') {
          onError?.("No speech detected. Try speaking closer to the microphone.");
        } else if (errorType === 'network') {
          onError?.("Network error. Please check your internet connection.");
        } else {
          onError?.(`Speech recognition error: ${errorType}`);
        }
        
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      onError?.("Speech recognition not supported in this browser");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onResult, onError, continuous, language]);

  // Check microphone permissions
  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error("Microphone permission error:", error);
      setHasPermission(false);
      onError?.("Microphone access denied. Please allow microphone permissions in your browser settings.");
      return false;
    }
  }, [onError]);

  const startListening = useCallback(async () => {
    if (recognitionRef.current && !isListening) {
      // First check microphone permissions
      const hasAccess = await checkMicrophonePermission();
      if (!hasAccess) return;

      try {
        // Stop any existing recognition first
        recognitionRef.current.abort();
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 100);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        onError?.("Failed to start speech recognition. Please refresh the page and try again.");
      }
    }
  }, [isListening, onError, checkMicrophonePermission]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    isSupported,
    hasPermission,
    startListening,
    stopListening,
    checkMicrophonePermission,
  };
}
