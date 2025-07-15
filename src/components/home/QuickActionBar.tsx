import { Plus, Mic, Play, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";

interface QuickActionBarProps {
  onVoiceInput?: () => void;
}

export const QuickActionBar = ({ onVoiceInput }: QuickActionBarProps) => {
  const navigate = useNavigate();
  const [showAddTask, setShowAddTask] = useState(false);

  const addTask = () => {
    // Trigger: addTaskDialog - will trigger AddTaskDialog
    console.log("Trigger: addTaskDialog");
    setShowAddTask(true);
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
    <>
      <div className="grid grid-cols-4 gap-4 px-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="
              flex items-center justify-center 
              w-10 h-10 rounded-xl
              bg-primary/12 hover:bg-primary/20
              text-primary
              transition-all duration-200 
              hover:scale-105
              active:scale-95
            "
          >
            <action.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      
      {/* Add Task Dialog */}
      <AddTaskDialog 
        open={showAddTask}
        onOpenChange={setShowAddTask}
      />
    </>
  );
};