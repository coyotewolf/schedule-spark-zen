import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryTask {
  id: string;
  title: string;
  dateRange: string;
  actualFinish: string;
  category: 'general' | 'background' | 'light';
  pomodoroSessions: PomodoroSession[];
  estimatedTime: number;
  actualTime: number;
}

interface PomodoroSession {
  date: string;
  startTime: string;
  endTime: string;
  completed: boolean;
}

export const HistoryTaskList = () => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // {{API}} - This data will come from API
  const historyTasks: HistoryTask[] = [
    {
      id: "hist-1",
      title: "完成專案提案",
      dateRange: "2024-01-15 ~ 2024-01-17",
      actualFinish: "2024-01-17 16:30",
      category: "general",
      estimatedTime: 180, // minutes
      actualTime: 195,
      pomodoroSessions: [
        { date: "2024-01-15", startTime: "09:00", endTime: "09:25", completed: true },
        { date: "2024-01-15", startTime: "09:30", endTime: "09:55", completed: true },
        { date: "2024-01-16", startTime: "14:00", endTime: "14:25", completed: true },
        { date: "2024-01-17", startTime: "15:00", endTime: "15:25", completed: true },
        { date: "2024-01-17", startTime: "15:30", endTime: "15:50", completed: false },
      ]
    },
    {
      id: "hist-2",
      title: "客戶會議準備",
      dateRange: "2024-01-14",
      actualFinish: "2024-01-14 11:45",
      category: "general",
      estimatedTime: 60,
      actualTime: 45,
      pomodoroSessions: [
        { date: "2024-01-14", startTime: "10:00", endTime: "10:25", completed: true },
        { date: "2024-01-14", startTime: "10:30", endTime: "10:50", completed: true },
      ]
    },
    {
      id: "hist-3",
      title: "回覆郵件",
      dateRange: "2024-01-13",
      actualFinish: "2024-01-13 09:15",
      category: "light",
      estimatedTime: 20,
      actualTime: 15,
      pomodoroSessions: []
    }
  ];

  const expandHistoryTask = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
    // Trigger: expandHistoryTask
    console.log("Trigger: expandHistoryTask", taskId);
  };

  const getCategoryBadgeClass = (category: HistoryTask['category']) => {
    switch (category) {
      case 'general':
        return 'badge-general';
      case 'background':
        return 'badge-background';
      case 'light':
        return 'badge-light';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTimeVariance = (estimated: number, actual: number) => {
    const diff = actual - estimated;
    const percentage = Math.round((diff / estimated) * 100);
    
    if (diff > 0) {
      return { text: `+${formatTime(diff)} (+${percentage}%)`, color: 'text-destructive' };
    } else if (diff < 0) {
      return { text: `${formatTime(Math.abs(diff))} (${percentage}%)`, color: 'text-success' };
    }
    return { text: '準時完成', color: 'text-muted-foreground' };
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">歷史任務記錄</h3>
        <p className="text-caption text-muted-foreground">
          共 {historyTasks.length} 個已完成任務
        </p>
      </div>

      {historyTasks.map((task) => {
        const isExpanded = expandedTask === task.id;
        const timeVariance = getTimeVariance(task.estimatedTime, task.actualTime);
        
        return (
          <div key={task.id} className="app-card p-4">
            {/* Task Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => expandHistoryTask(task.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
                
                <div>
                  <h4 className="text-body font-medium">{task.title}</h4>
                  <div className="flex items-center gap-2 text-caption text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{task.dateRange}</span>
                  </div>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs ${getCategoryBadgeClass(task.category)}`}>
                {task.category === 'general' ? '一般' : 
                 task.category === 'background' ? '背景' : '輕型'}
              </span>
            </div>

            {/* Task Summary */}
            <div className="grid grid-cols-2 gap-4 text-caption">
              <div>
                <span className="text-muted-foreground">完成時間: </span>
                <span>{task.actualFinish}</span>
              </div>
              <div>
                <span className="text-muted-foreground">時間準確度: </span>
                <span className={timeVariance.color}>{timeVariance.text}</span>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-4 text-caption">
                  <div>
                    <span className="text-muted-foreground">預估時間: </span>
                    <span>{formatTime(task.estimatedTime)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">實際時間: </span>
                    <span>{formatTime(task.actualTime)}</span>
                  </div>
                </div>

                {/* Pomodoro Sessions */}
                {task.pomodoroSessions.length > 0 && (
                  <div>
                    <h5 className="text-body font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      番茄鐘記錄 ({task.pomodoroSessions.length} 個時段)
                    </h5>
                    <div className="space-y-1">
                      {task.pomodoroSessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between text-caption">
                          <span className="text-muted-foreground">
                            {session.date} {session.startTime} - {session.endTime}
                          </span>
                          <span className={session.completed ? 'text-success' : 'text-destructive'}>
                            {session.completed ? '✓ 完成' : '✗ 未完成'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {historyTasks.length === 0 && (
        <div className="app-card p-8 text-center">
          <p className="text-muted-foreground">尚無歷史任務記錄</p>
        </div>
      )}
    </div>
  );
};