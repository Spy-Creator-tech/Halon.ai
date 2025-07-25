import { useState } from "react";
import { IntroScreen } from "@/components/intro-screen";
import { MainInterface } from "@/components/main-interface";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen">
      {showIntro ? (
        <IntroScreen onComplete={handleIntroComplete} />
      ) : (
        <MainInterface />
      )}
    </div>
  );
}
