interface VoiceVisualizerProps {
  isVisible: boolean;
  isListening: boolean;
}

export function VoiceVisualizer({ isVisible, isListening }: VoiceVisualizerProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mb-4 animate-pulse-glow">
            <i className="fas fa-microphone text-white text-6xl" />
          </div>
          <p className="text-white text-2xl font-orbitron">
            {isListening ? "Listening..." : "Processing..."}
          </p>
          {isListening && (
            <div className="mt-4 flex justify-center space-x-2">
              {/* Audio level bars */}
              {[0, 0.1, 0.2, 0.3, 0.4].map((delay, index) => (
                <div
                  key={index}
                  className={`w-2 ${
                    index === 2 || index === 3 ? "h-12" : "h-8"
                  } ${
                    index < 3 ? "bg-cyan-400" : "bg-purple-400"
                  } rounded animate-bounce-subtle`}
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
