import { useState } from "react";
import { TaskDetailPopover } from "./TaskDetailPopover";

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
  importance: number; // 1-5 scale
  urgency: number; // 1-5 scale
}

interface PriorityQuadrantViewProps {
  timePeriod: string;
}

export const PriorityQuadrantView = ({ timePeriod }: PriorityQuadrantViewProps) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "完成專案提案",
      category: "工作",
      taskType: "general",
      estimatedTime: 120,
      location: "辦公室",
      preferredSlot: "上午",
      canOverlap: false,
      status: "pending",
      importance: 5,
      urgency: 4
    },
    {
      id: "2",
      title: "回覆客戶郵件",
      category: "工作",
      taskType: "light",
      estimatedTime: 15,
      canOverlap: true,
      status: "pending",
      importance: 3,
      urgency: 5
    },
    {
      id: "3",
      title: "檢查系統監控",
      category: "技術",
      taskType: "background",
      estimatedTime: 10,
      canOverlap: true,
      status: "pending",
      importance: 2,
      urgency: 2
    },
    {
      id: "4",
      title: "學習新技術",
      category: "學習",
      taskType: "general",
      estimatedTime: 60,
      canOverlap: false,
      status: "pending",
      importance: 4,
      urgency: 1
    }
  ]);


  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      '工作': 'hsl(220, 70%, 50%)',
      '技術': 'hsl(120, 60%, 50%)', 
      '學習': 'hsl(280, 70%, 50%)',
      '休閒': 'hsl(60, 70%, 50%)',
      '健康': 'hsl(0, 70%, 50%)',
    };
    return categoryColors[category] || 'hsl(var(--primary))';
  };

  const handleTaskClick = (taskId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTask(selectedTask === taskId ? null : taskId);
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    
    if (!draggedTask) return;

    const matrixContainer = document.getElementById('matrix-container');
    if (!matrixContainer) return;

    const rect = matrixContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert pixel coordinates to percentages
    const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

    // Convert percentages to importance (1-5) and urgency (1-5)
    // X axis represents importance (left = 1, right = 5)
    const newImportance = Math.max(1, Math.min(5, Math.round((xPercent / 100) * 4) + 1));
    // Y axis represents urgency (top = 5, bottom = 1) - inverted
    const newUrgency = Math.max(1, Math.min(5, Math.round(((100 - yPercent) / 100) * 4) + 1));

    setTasks(prev => prev.map(task => 
      task.id === draggedTask 
        ? { ...task, importance: newImportance, urgency: newUrgency }
        : task
    ));

    setDraggedTask(null);

    // Trigger: updateTaskImportanceUrgency
    console.log("Trigger: updateTaskImportanceUrgency", {
      taskId: draggedTask,
      importance: newImportance,
      urgency: newUrgency
    });
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Allow drop
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-h2 mb-2">艾森豪矩陣</h2>
        <p className="text-caption text-muted-foreground">
          根據重要性和緊急性分類任務
        </p>
      </div>

      {/* Matrix Container */}
      <div 
        id="matrix-container"
        className="relative w-full h-96 rounded-lg overflow-hidden border border-border"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          background: `
            linear-gradient(to right, 
              hsl(0, 30%, 97%) 0%, 
              hsl(0, 30%, 97%) 50%, 
              hsl(120, 30%, 97%) 50%, 
              hsl(120, 30%, 97%) 100%
            ),
            linear-gradient(to bottom,
              hsl(350, 30%, 97%) 0%,
              hsl(350, 30%, 97%) 50%,
              hsl(210, 30%, 97%) 50%,
              hsl(210, 30%, 97%) 100%
            )
          `
        }}
      >
        {/* Axis Lines - More prominent */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-foreground/30 transform -translate-x-0.5 z-10"></div>
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-foreground/30 transform -translate-y-0.5 z-10"></div>

        {/* Axis Labels - Centered on axes */}
        <div className="absolute left-1/2 top-4 text-sm font-semibold text-foreground transform -translate-x-1/2 z-20 bg-background/80 px-2 py-1 rounded">
          緊急
        </div>
        <div className="absolute left-1/2 bottom-4 text-sm font-semibold text-foreground transform -translate-x-1/2 z-20 bg-background/80 px-2 py-1 rounded">
          不緊急
        </div>
        <div className="absolute left-4 top-1/2 text-sm font-semibold text-foreground transform -translate-y-1/2 z-20 bg-background/80 px-2 py-1 rounded">
          不重要
        </div>
        <div className="absolute right-4 top-1/2 text-sm font-semibold text-foreground transform -translate-y-1/2 z-20 bg-background/80 px-2 py-1 rounded">
          重要
        </div>

        {/* Task Dots */}
        <div className="absolute inset-0">
          {tasks.map((task, index) => {
            const x = ((task.importance - 1) / 4) * 100; // Convert 1-5 to 0-100%
            const y = 100 - ((task.urgency - 1) / 4) * 100; // Invert Y axis, convert 1-5 to 0-100%
            
            return (
              <TaskDetailPopover
                key={task.id}
                task={task}
                open={selectedTask === task.id}
                onOpenChange={(open) => setSelectedTask(open ? task.id : null)}
              >
                <div
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  className={`absolute w-4 h-4 rounded-full cursor-move transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 z-30 border-2 border-white shadow-lg ${
                    draggedTask === task.id ? 'opacity-50 scale-110' : ''
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: getCategoryColor(task.category),
                  }}
                  onClick={(e) => handleTaskClick(task.id, e)}
                  title={task.title}
                />
              </TaskDetailPopover>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
            <div>
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-sm text-muted-foreground">
                重要度: {task.importance} | 緊急度: {task.urgency}
              </p>
            </div>
            <span className="text-xs bg-muted px-2 py-1 rounded">
              {task.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};