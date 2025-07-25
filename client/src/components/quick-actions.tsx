import { Button } from "@/components/ui/button";
import { executeQuickAction } from "@/lib/openai-client";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onActionComplete: (message: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  hoverColor: string;
}

const quickActions: QuickAction[] = [
  {
    id: "flashlight",
    label: "Toggle Flashlight",
    icon: "fas fa-flashlight",
    color: "text-yellow-400",
    hoverColor: "text-yellow-300",
  },
  {
    id: "call",
    label: "Make Call",
    icon: "fas fa-phone",
    color: "text-green-400",
    hoverColor: "text-green-300",
  },
  {
    id: "whatsapp",
    label: "Send WhatsApp",
    icon: "fab fa-whatsapp",
    color: "text-green-500",
    hoverColor: "text-green-400",
  },
  {
    id: "music",
    label: "Play Music",
    icon: "fas fa-music",
    color: "text-purple-400",
    hoverColor: "text-purple-300",
  },
  {
    id: "youtube",
    label: "Search YouTube",
    icon: "fab fa-youtube",
    color: "text-red-500",
    hoverColor: "text-red-400",
  },
  {
    id: "email",
    label: "Compose Email",
    icon: "fas fa-envelope",
    color: "text-blue-400",
    hoverColor: "text-blue-300",
  },
];

export function QuickActions({ onActionComplete }: QuickActionsProps) {
  const { toast } = useToast();

  const handleAction = async (actionId: string) => {
    try {
      const result = await executeQuickAction(actionId);
      onActionComplete(result.message);
      toast({
        title: "Action Executed",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to execute quick action",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="control-panel rounded-2xl p-6 h-full">
      <h3 className="text-white font-orbitron text-lg mb-6">Quick Actions</h3>

      <div className="space-y-4">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className="w-full p-4 rounded-xl glass-effect hover:bg-white/10 transition-all duration-300 group bg-transparent border-0 justify-start"
          >
            <div className="flex items-center space-x-3">
              <i className={`${action.icon} ${action.color} group-hover:${action.hoverColor}`} />
              <span className="text-white">{action.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
