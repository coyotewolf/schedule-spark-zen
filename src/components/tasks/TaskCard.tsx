import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, MapPin, GripVertical, Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  category: string; // User-defined category like "工作", "個人"
  taskType: 'general' | 'background' | 'light'; // Fixed task type
  estimatedTime: number;
  location?: string;
  preferredSlot?: string;
  canOverlap: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  importance: number;
  urgency: number;
  subtasks?: Task[];
}

interface TaskCardProps {
  task: Task;
  onEdit?: (taskId: string) => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryColor = (category: string) => {
    // Category colors based on design system
    switch (category.toLowerCase()) {
      case '工作':
        return 'bg-primary text-primary-foreground';
      case '個人':
        return 'bg-secondary text-secondary-foreground';
      case '學習':
        return 'bg-accent text-accent-foreground';
      case '健康':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTaskTypeBadgeClass = (taskType: Task['taskType']) => {
    switch (taskType) {
      case 'general':
        return 'bg-primary/20 text-primary-foreground';
      case 'background':
        return 'bg-secondary/20 text-secondary-foreground';
      case 'light':
        return 'bg-accent/20 text-accent-foreground';
    }
  };

  const getTaskTypeLabel = (taskType: Task['taskType']) => {
    switch (taskType) {
      case 'general':
        return '一般任務';
      case 'background':
        return '背景任務';
      case 'light':
        return '輕型任務';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'in_progress':
        return 'text-warning';
      case 'pending':
        return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in_progress':
        return '進行中';
      case 'pending':
        return '未開始';
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

  return (
    <div className="app-card p-4 interactive-hover">
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <GripVertical className="w-4 h-4 text-muted-foreground mt-1 cursor-grab" />
        
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {task.subtasks && task.subtasks.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <h3 className={`text-body font-medium ${
                task.status === 'completed' ? 'line-through text-muted-foreground' : ''
              }`}>
                {task.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Category Badge */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
              
              {/* Task Type Badge */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeBadgeClass(task.taskType)}`}>
                {getTaskTypeLabel(task.taskType)}
              </span>
              
              {/* Status Badge */}
              <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
              
              {/* Edit Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(task.id);
                  // Trigger: openEditTaskDialog
                  console.log("Trigger: openEditTaskDialog", task.id);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {/* Details */}
          <div className="flex items-center gap-4 text-caption text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTime(task.estimatedTime)}</span>
            </div>
            
            {task.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{task.location}</span>
              </div>
            )}
            
            {task.preferredSlot && (
              <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                偏好：{task.preferredSlot}
              </span>
            )}
            
            {task.canOverlap && (
              <span className="px-2 py-0.5 bg-secondary/20 text-secondary rounded-full text-xs">
                可重疊
              </span>
            )}
          </div>
          
          {/* Priority Indicators */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">重要度：</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-2 rounded-full ${
                    level <= task.importance ? 'bg-destructive' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <span className="text-muted-foreground ml-2">緊急度：</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-2 rounded-full ${
                    level <= task.urgency ? 'bg-warning' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Subtasks */}
          {isExpanded && task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-border space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className={`${
                      subtask.status === 'completed' ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {subtask.title}
                    </span>
                    <span className={`text-xs ${getStatusColor(subtask.status)}`}>
                      {getStatusText(subtask.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};