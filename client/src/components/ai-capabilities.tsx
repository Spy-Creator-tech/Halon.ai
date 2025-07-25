interface AICapability {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const capabilities: AICapability[] = [
  {
    icon: "fas fa-brain",
    title: "Smart Q&A",
    description: "Ask me anything - from recipes to complex questions",
    color: "text-cyan-400",
  },
  {
    icon: "fas fa-code",
    title: "Code Generation",
    description: "Generate code in any programming language",
    color: "text-purple-400",
  },
  {
    icon: "fas fa-file-alt",
    title: "Content Creation",
    description: "Write essays, blogs, summaries, and more",
    color: "text-green-400",
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Device Control",
    description: "Control apps, settings, and phone functions",
    color: "text-orange-400",
  },
  {
    icon: "fas fa-language",
    title: "Translation",
    description: "Translate text between multiple languages",
    color: "text-pink-400",
  },
];

const voiceCommands = [
  '"Ok Halon, turn on flashlight"',
  '"Ok Halon, call [contact name]"',
  '"Ok Halon, play music"',
  '"Ok Halon, write a poem about..."',
  '"Ok Halon, translate hello to Spanish"',
];

export function AICapabilities() {
  return (
    <div className="control-panel rounded-2xl p-6 h-full">
      <h3 className="text-white font-orbitron text-lg mb-6">AI Capabilities</h3>

      <div className="space-y-4">
        {capabilities.map((capability, index) => (
          <div key={index} className="p-4 rounded-xl glass-effect">
            <div className="flex items-center space-x-3 mb-2">
              <i className={`${capability.icon} ${capability.color}`} />
              <span className="text-white font-medium">{capability.title}</span>
            </div>
            <p className="text-gray-400 text-sm">{capability.description}</p>
          </div>
        ))}

        {/* Voice commands help */}
        <div className="mt-6 p-4 bg-gray-800/30 rounded-xl">
          <h4 className="text-cyan-400 font-medium mb-2">Voice Commands</h4>
          <div className="space-y-1 text-xs text-gray-400">
            {voiceCommands.map((command, index) => (
              <p key={index}>• {command}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
