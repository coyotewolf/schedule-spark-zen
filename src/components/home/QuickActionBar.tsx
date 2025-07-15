import { Plus, Mic, Timer, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionBarProps {
  onVoiceInput?: () => void;
}

export const QuickActionBar = ({ onVoiceInput }: QuickActionBarProps) => {
  const navigate = useNavigate();

  const addTask = () => {
    // Trigger: addTask
    console.log("Trigger: addTask");
    navigate("/tasks?action=add");
  };

  const startPomodoro = () => {
    // Trigger: startPomodoro
    console.log("Trigger: startPomodoro");
    navigate("/pomodoro?action=start");
  };

  const openPlanner = () => {
    navigate("/planner");
  };

  const handleVoiceInput = () => {
    if (onVoiceInput) {
      onVoiceInput();
    }
    // Trigger: voiceInput
    console.log("Trigger: voiceInput");
  };

  const quickActions = [
    {
      id: "addTask",
      icon: Plus,
      action: addTask
    },
    {
      id: "voiceInput", 
      icon: Mic,
      action: handleVoiceInput
    },
    {
      id: "startPomodoro",
      icon: Timer,
      action: startPomodoro
    },
    {
      id: "openPlanner",
      icon: Calendar,
      action: openPlanner
    }
  ];

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-center gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="
              flex items-center justify-center 
              w-14 h-14 rounded-2xl
              bg-surface/95 backdrop-blur-sm
              border border-border/20
              transition-all duration-200 
              interactive-hover interactive-press
              hover:bg-surface hover:scale-105
              active:scale-95
            "
          >
            <action.icon className="w-6 h-6 text-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};