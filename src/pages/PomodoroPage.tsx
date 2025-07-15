import { useState, useEffect } from "react";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { CurrentTaskBadge } from "@/components/pomodoro/CurrentTaskBadge";
import { HideOverlapToggle } from "@/components/pomodoro/HideOverlapToggle";
import { PomodoroSettings } from "@/components/pomodoro/PomodoroSettings";
import { Play, Pause, Square, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type PomodoroState = "idle" | "work" | "break" | "paused";

export const PomodoroPage = () => {
  const [state, setState] = useState<PomodoroState>("idle");
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [allowOverlapDuringFocus, setAllowOverlapDuringFocus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state === "work" || state === "break") {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer finished
            if (state === "work") {
              // Start break
              setState("break");
              setTimeRemaining(breakDuration * 60);
              // Trigger: pomodoroWorkCompleted
              console.log("Trigger: pomodoroWorkCompleted");
            } else {
              // Break finished
              setState("idle");
              setTimeRemaining(workDuration * 60);
              // Trigger: pomodoroBreakCompleted
              console.log("Trigger: pomodoroBreakCompleted");
            }
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state, workDuration, breakDuration]);

  const startTimer = () => {
    if (state === "idle") {
      setState("work");
      setTimeRemaining(workDuration * 60);
      // Trigger: startPomodoro
      console.log("Trigger: startPomodoro");
    } else if (state === "paused") {
      setState(timeRemaining > breakDuration * 60 ? "work" : "break");
      // Trigger: resumePomodoro
      console.log("Trigger: resumePomodoro");
    }
  };

  const pauseTimer = () => {
    setState("paused");
    // Trigger: pausePomodoro
    console.log("Trigger: pausePomodoro");
  };

  const stopTimer = () => {
    setState("idle");
    setTimeRemaining(workDuration * 60);
    // Trigger: stopPomodoro
    console.log("Trigger: stopPomodoro");
  };

  const selectTask = () => {
    // This would open a task selection modal
    // For demo, we'll set a placeholder task
    setCurrentTask("專案開發 - 使用者介面設計");
    // Trigger: selectPomodoroTask
    console.log("Trigger: selectPomodoroTask");
  };

  const handleOverlapToggle = (enabled: boolean) => {
    setAllowOverlapDuringFocus(enabled);
    // Trigger: setAllowOverlapDuringFocus
    console.log("Trigger: setAllowOverlapDuringFocus", enabled);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-h2 font-semibold">番茄鐘</h1>
            <p className="text-caption text-muted-foreground">
              專注工作，提升效率
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 space-y-8">
        {/* Current Task */}
        <CurrentTaskBadge 
          task={currentTask}
          onSelectTask={selectTask}
        />

        {/* Timer */}
        <PomodoroTimer
          timeRemaining={timeRemaining}
          totalTime={state === "work" ? workDuration * 60 : breakDuration * 60}
          isWork={state === "work"}
          isActive={state === "work" || state === "break"}
        />

        {/* Timer Controls */}
        <div className="flex items-center gap-4">
          {(state === "idle" || state === "paused") && (
            <Button
              onClick={startTimer}
              size="lg"
              className="px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              {state === "idle" ? "開始" : "繼續"}
            </Button>
          )}

          {(state === "work" || state === "break") && (
            <Button
              onClick={pauseTimer}
              size="lg"
              variant="outline"
              className="px-8"
            >
              <Pause className="w-5 h-5 mr-2" />
              暫停
            </Button>
          )}

          {state !== "idle" && (
            <Button
              onClick={stopTimer}
              size="lg"
              variant="destructive"
              className="px-8"
            >
              <Square className="w-5 h-5 mr-2" />
              停止
            </Button>
          )}
        </div>

        {/* Status & Settings */}
        <div className="space-y-4 w-full max-w-sm">
          {/* Focus Mode Toggle */}
          <HideOverlapToggle
            enabled={allowOverlapDuringFocus}
            onToggle={handleOverlapToggle}
          />

          {/* Session Status */}
          <div className="app-card p-4 text-center">
            <p className="text-caption text-muted-foreground mb-1">目前模式</p>
            <p className="text-h3 font-semibold">
              {state === "work" ? "🍅 專注工作" : 
               state === "break" ? "☕ 休息時間" :
               state === "paused" ? "⏸️ 已暫停" : "⭕ 待開始"}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <PomodoroSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        workDuration={workDuration}
        breakDuration={breakDuration}
        onWorkDurationChange={setWorkDuration}
        onBreakDurationChange={setBreakDuration}
      />
    </div>
  );
};