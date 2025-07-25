import { useEffect, useState } from "react";
import halonLogo1 from "@assets/halon-logo1_1753438304019.png";

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start progress animation after a brief delay
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);

    // Complete intro after loading animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        {/* Halon logo with animation */}
        <div className="relative mb-8">
          <img
            src={halonLogo1}
            alt="Halon AI Assistant Logo"
            className="w-72 h-auto mx-auto opacity-0 transform scale-150 animate-fadeZoom"
            style={{
              filter: "drop-shadow(0 0 20px #00f0ff) drop-shadow(0 0 40px #9900ff)",
            }}
          />
        </div>

        {/* Loading text */}
        <div
          className="text-white text-2xl font-orbitron mb-4 opacity-0 animate-slideUp"
          style={{ animationDelay: "2s" }}
        >
          Initializing Halon AI...
        </div>

        {/* Loading progress */}
        <div
          className="w-64 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden opacity-0 animate-slideUp"
          style={{ animationDelay: "2.5s" }}
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-3000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
