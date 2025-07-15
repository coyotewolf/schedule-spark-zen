import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: string;
  estimatedTime: number;
  location?: string;
  status: 'pending' | 'in_progress';
}

interface ChangeTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskSelect: (taskId: string) => void;
}

export const ChangeTaskDialog = ({ open, onOpenChange, onTaskSelect }: ChangeTaskDialogProps) => {
  // Mock today's incomplete tasks
  const [todayTasks] = useState<Task[]>([
    {
      id: "1",
      title: "完成專案提案",
      category: "工作",
      estimatedTime: 120,
      location: "辦公室",
      status: "pending"
    },
    {
      id: "2",
      title: "學習新技能",
      category: "學習",
      estimatedTime: 90,
      status: "pending"
    },
    {
      id: "3",
      title: "回覆客戶郵件",
      category: "工作",
      estimatedTime: 30,
      status: "in_progress"
    },
    {
      id: "4",
      title: "整理桌面",
      category: "個人",
      estimatedTime: 15,
      status: "pending"
    }
  ]);

  const handleTaskSelect = (taskId: string) => {
    // Trigger: changeCurrentTask
    console.log("Trigger: changeCurrentTask", taskId);
    onTaskSelect(taskId);
    onOpenChange(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case '工作':
        return 'bg-primary text-primary-foreground';
      case '學習':
        return 'bg-purple-100 text-purple-700';
      case '個人':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    return status === 'in_progress' ? '進行中' : '待開始';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>選擇任務</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">
            選擇今日要執行的任務：
          </p>
          
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="border border-border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleTaskSelect(task.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                    {task.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(task.estimatedTime)}
                  </div>
                  
                  {task.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {task.location}
                    </div>
                  )}
                  
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    task.status === 'in_progress' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {todayTasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">今日無待辦任務</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};