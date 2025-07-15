import { Plus, Mic, Play, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionBarProps {
  onVoiceInput?: () => void;
}

export const QuickActionBar = ({ onVoiceInput }: QuickActionBarProps) => {
  const navigate = useNavigate();

  const addTask = () => {
    // Trigger: addTaskDialog
    console.log("Trigger: addTaskDialog");
    navigate("/tasks?action=add");
  };

  const startPomodoro = () => {
    // Trigger: startPomodoro
    console.log("Trigger: startPomodoro");
    navigate("/pomodoro?action=start");
  };

  const openPlanner = () => {
    // Trigger: navigatePlanner
    console.log("Trigger: navigatePlanner");
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
      icon: Play,
      action: startPomodoro
    },
    {
      id: "openPlanner",
      icon: Calendar,
      action: openPlanner
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 px-4">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={action.action}
          className="
            flex items-center justify-center 
            h-11 rounded-xl
            bg-secondary/20 hover:bg-secondary/30
            text-secondary-foreground
            transition-all duration-200 
            hover:scale-105
            active:scale-95
          "
        >
          <action.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};