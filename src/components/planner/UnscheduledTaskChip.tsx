import { Clock, MapPin } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: string;
  estimatedTime: number;
  location?: string;
  categoryColor: string;
}

interface UnscheduledTaskChipProps {
  task: Task;
  onDragToSchedule?: (taskId: string) => void;
}

export const UnscheduledTaskChip = ({ task, onDragToSchedule }: UnscheduledTaskChipProps) => {
  const handleDragEnd = () => {
    // Trigger: dragToSchedule
    console.log("Trigger: dragToSchedule", task.id);
    onDragToSchedule?.(task.id);
  };

  return (
    <div
      className="
        w-35 h-10 px-3 py-2 
        bg-surface border border-border/50
        rounded-full shadow-sm
        cursor-move hover:shadow-md
        transition-all duration-200
        hover:scale-105
        flex items-center gap-2
      "
      draggable
      onDragEnd={handleDragEnd}
    >
      {/* Category Color Indicator */}
      <div 
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: task.categoryColor }}
      />
      
      {/* Task Title (truncated) */}
      <span className="text-xs font-medium text-foreground truncate flex-1">
        {task.title}
      </span>
      
      {/* Time Indicator */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>{task.estimatedTime}m</span>
      </div>
    </div>
  );
};

// Container component for multiple chips
interface UnscheduledTasksFloatProps {
  tasks: Task[];
  onDragToSchedule?: (taskId: string) => void;
}

export const UnscheduledTasksFloat = ({ tasks, onDragToSchedule }: UnscheduledTasksFloatProps) => {
  if (tasks.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-lg max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-foreground">未排程任務</h4>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {tasks.map((task) => (
            <UnscheduledTaskChip
              key={task.id}
              task={task}
              onDragToSchedule={onDragToSchedule}
            />
          ))}
        </div>
      </div>
    </div>
  );
};