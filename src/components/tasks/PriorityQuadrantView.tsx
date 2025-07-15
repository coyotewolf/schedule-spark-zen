import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId } = result;
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Calculate new importance and urgency based on drop position
    const rect = document.getElementById('matrix-container')?.getBoundingClientRect();
    if (!rect) return;

    const x = result.destination.index % 100; // Mock position
    const y = Math.floor(result.destination.index / 100);
    
    const newImportance = Math.max(1, Math.min(5, Math.round((x / 100) * 5)));
    const newUrgency = Math.max(1, Math.min(5, Math.round(((100 - y) / 100) * 5)));

    const updatedTasks = tasks.map(t => 
      t.id === draggableId 
        ? { ...t, importance: newImportance, urgency: newUrgency }
        : t
    );

    setTasks(updatedTasks);
    
    // Trigger: updateTaskImportanceUrgency
    console.log("Trigger: updateTaskImportanceUrgency", {
      taskId: draggableId,
      importance: newImportance,
      urgency: newUrgency
    });
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <div 
          id="matrix-container"
          className="relative w-full h-96 rounded-lg overflow-hidden"
          style={{
            background: `
              linear-gradient(to right, 
                hsl(var(--muted)) 0%, 
                hsl(var(--muted)) 50%, 
                hsl(146, 30%, 95%) 50%, 
                hsl(146, 30%, 95%) 100%
              ),
              linear-gradient(to bottom,
                hsl(0, 30%, 95%) 0%,
                hsl(0, 30%, 95%) 50%,
                hsl(210, 30%, 95%) 50%,
                hsl(210, 30%, 95%) 100%
              )
            `
          }}
        >
          {/* Axis Lines - More prominent */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border transform -translate-x-0.5 z-10"></div>
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border transform -translate-y-0.5 z-10"></div>

          {/* Axis Labels - Centered on axes */}
          <div className="absolute left-1/2 top-6 text-sm font-medium text-foreground transform -translate-x-1/2 z-20">
            緊急
          </div>
          <div className="absolute left-1/2 bottom-6 text-sm font-medium text-foreground transform -translate-x-1/2 z-20">
            不緊急
          </div>
          <div className="absolute left-6 top-1/2 text-sm font-medium text-foreground transform -translate-y-1/2 z-20">
            不重要
          </div>
          <div className="absolute right-6 top-1/2 text-sm font-medium text-foreground transform -translate-y-1/2 z-20">
            重要
          </div>

          {/* Draggable Task Dots */}
          <Droppable droppableId="matrix" type="task">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="absolute inset-0"
              >
                {tasks.map((task, index) => {
                  const x = (task.importance / 5) * 100; // Convert 1-5 to 0-100%
                  const y = 100 - (task.urgency / 5) * 100; // Invert Y axis
                  
                  return (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`absolute w-3 h-3 bg-primary rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 z-30 ${
                            snapshot.isDragging ? 'shadow-lg scale-125' : ''
                          }`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            ...provided.draggableProps.style
                          }}
                          title={task.title}
                        />
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

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