import { useState } from "react";
import { TaskManageCard } from "./TaskManageCard";
import { TaskFilter } from "./TaskFilter";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface TaskListViewProps {
  timePeriod: string;
  onEditTask?: (taskId: string) => void;
}

interface Task {
  id: string;
  title: string;
  category: string; // User-defined category
  taskType: 'general' | 'background' | 'light'; // Fixed task type
  estimatedTime: number; // minutes
  location?: string;
  preferredSlot?: string;
  canOverlap: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  importance: number; // 1-5
  urgency: number; // 1-5
  subtasks?: Task[];
}

export const TaskListView = ({ timePeriod, onEditTask }: TaskListViewProps) => {
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
      urgency: 4,
      subtasks: [
        {
          id: "1-1",
          title: "收集需求資料",
          category: "工作",
          taskType: "general",
          estimatedTime: 30,
          canOverlap: false,
          status: "completed",
          importance: 4,
          urgency: 4
        },
        {
          id: "1-2", 
          title: "撰寫提案內容",
          category: "工作",
          taskType: "general",
          estimatedTime: 90,
          canOverlap: false,
          status: "in_progress",
          importance: 5,
          urgency: 4
        }
      ]
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
    }
  ]);

  const [filter, setFilter] = useState({
    category: "all",
    taskType: "all",
    status: "all"
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
    
    // Trigger: reorderTask
    console.log("Trigger: reorderTask", {
      taskId: result.draggableId,
      from: result.source.index,
      to: result.destination.index
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.category !== "all" && task.category !== filter.category) return false;
    if (filter.taskType !== "all" && task.taskType !== filter.taskType) return false;
    if (filter.status !== "all" && task.status !== filter.status) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter */}
      <TaskFilter 
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Task List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                    >
                      <TaskManageCard task={task} onEdit={(taskId) => {
                        // Trigger: openEditTaskDialog  
                        console.log("Trigger: openEditTaskDialog", taskId);
                        onEditTask?.(taskId);
                      }} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {filteredTasks.length === 0 && (
        <div className="app-card p-8 text-center">
          <p className="text-muted-foreground">沒有符合條件的任務</p>
        </div>
      )}
    </div>
  );
};