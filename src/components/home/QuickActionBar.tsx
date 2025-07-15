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
      label: "新增任務",
      icon: Plus,
      action: addTask,
      className: "bg-primary hover:bg-primary/80 text-primary-foreground"
    },
    {
      id: "voiceInput", 
      label: "語音輸入",
      icon: Mic,
      action: handleVoiceInput,
      className: "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
    },
    {
      id: "startPomodoro",
      label: "番茄鐘",
      icon: Timer,
      action: startPomodoro,
      className: "bg-success hover:bg-success/80 text-success-foreground"
    },
    {
      id: "openPlanner",
      label: "規劃",
      icon: Calendar,
      action: openPlanner,
      className: "bg-muted hover:bg-muted/80 text-muted-foreground"
    }
  ];

  return (
    <div className="app-card p-4">
      <h3 className="text-h3 mb-4">快速操作</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl 
              transition-all duration-200 
              interactive-hover interactive-press
              ${action.className}
            `}
          >
            <action.icon className="w-6 h-6 mb-2" />
            <span className="text-caption font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};