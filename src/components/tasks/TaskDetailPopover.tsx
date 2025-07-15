import { useState, useRef } from "react";
import { MapPin, Clock, User, Tag, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  category: string;
  taskType: 'general' | 'background' | 'light';
  estimatedTime: number;
  location?: string;
  preferredSlot?: string;
  canOverlap: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  importance: number;
  urgency: number;
}

interface TaskDetailPopoverProps {
  task: Task;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskDetailPopover = ({ task, children, open, onOpenChange }: TaskDetailPopoverProps) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待開始';
      case 'in_progress': return '進行中';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  const getTaskTypeText = (taskType: string) => {
    switch (taskType) {
      case 'general': return '一般任務';
      case 'background': return '背景任務';
      case 'light': return '輕型任務';
      default: return '未知';
    }
  };

  const getImportanceText = (importance: number) => {
    switch (importance) {
      case 1: return '極低';
      case 2: return '低';
      case 3: return '中等';
      case 4: return '高';
      case 5: return '極高';
      default: return '未設定';
    }
  };

  const getUrgencyText = (urgency: number) => {
    switch (urgency) {
      case 1: return '極低';
      case 2: return '低';
      case 3: return '中等';
      case 4: return '高';
      case 5: return '極高';
      default: return '未設定';
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 rounded-2xl border border-border shadow-lg"
        side="right"
        align="start"
        sideOffset={10}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-body font-semibold text-foreground">{task.title}</h3>
            <div className="flex items-center gap-2">
              <Badge 
                variant={task.status === 'completed' ? 'default' : 'secondary'} 
                className="text-xs"
              >
                {getStatusText(task.status)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {task.category}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-caption">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="w-4 h-4" />
              <span>{getTaskTypeText(task.taskType)}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>預估時間：{task.estimatedTime} 分鐘</span>
            </div>

            {task.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{task.location}</span>
              </div>
            )}

            {task.preferredSlot && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>偏好時段：{task.preferredSlot}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">重要度</div>
                <div className="text-sm font-medium text-foreground">
                  {getImportanceText(task.importance)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">緊急度</div>
                <div className="text-sm font-medium text-foreground">
                  {getUrgencyText(task.urgency)}
                </div>
              </div>
            </div>

            {task.canOverlap && (
              <div className="flex items-center gap-2 text-primary">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">此任務可與其他任務重疊</span>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};