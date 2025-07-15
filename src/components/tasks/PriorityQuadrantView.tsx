import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  category: 'general' | 'background' | 'light';
  importance: number;
  urgency: number;
}

interface PriorityQuadrantViewProps {
  timePeriod: string;
}

export const PriorityQuadrantView = ({ timePeriod }: PriorityQuadrantViewProps) => {
  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
    'important-urgent': [
      { id: '1', title: '緊急客戶問題', category: 'general', importance: 5, urgency: 5 }
    ],
    'important-not-urgent': [
      { id: '2', title: '專案規劃', category: 'general', importance: 5, urgency: 2 }
    ],
    'not-important-urgent': [
      { id: '3', title: '回覆郵件', category: 'light', importance: 2, urgency: 4 }
    ],
    'not-important-not-urgent': [
      { id: '4', title: '整理檔案', category: 'light', importance: 1, urgency: 1 }
    ]
  });

  const quadrants = [
    {
      id: 'important-urgent',
      title: '重要緊急',
      subtitle: 'Do First',
      className: 'badge-important-urgent',
      description: '立即處理的任務'
    },
    {
      id: 'important-not-urgent', 
      title: '重要不緊急',
      subtitle: 'Schedule',
      className: 'badge-important-not-urgent',
      description: '規劃時間處理'
    },
    {
      id: 'not-important-urgent',
      title: '不重要緊急', 
      subtitle: 'Delegate',
      className: 'badge-not-important-urgent',
      description: '考慮委派給他人'
    },
    {
      id: 'not-important-not-urgent',
      title: '不重要不緊急',
      subtitle: 'Eliminate', 
      className: 'badge-not-important-not-urgent',
      description: '減少或消除這類活動'
    }
  ];

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) return;
    
    if (source.droppableId === destination.droppableId) {
      // Same quadrant reordering
      const quadrantTasks = Array.from(tasks[source.droppableId]);
      const [reorderedTask] = quadrantTasks.splice(source.index, 1);
      quadrantTasks.splice(destination.index, 0, reorderedTask);
      
      setTasks({
        ...tasks,
        [source.droppableId]: quadrantTasks
      });
    } else {
      // Move between quadrants
      const sourceTasks = Array.from(tasks[source.droppableId]);
      const destTasks = Array.from(tasks[destination.droppableId]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      
      // Update task priority based on destination quadrant
      const updatedTask = { ...movedTask };
      switch (destination.droppableId) {
        case 'important-urgent':
          updatedTask.importance = 5;
          updatedTask.urgency = 5;
          break;
        case 'important-not-urgent':
          updatedTask.importance = 5;
          updatedTask.urgency = 2;
          break;
        case 'not-important-urgent':
          updatedTask.importance = 2;
          updatedTask.urgency = 4;
          break;
        case 'not-important-not-urgent':
          updatedTask.importance = 1;
          updatedTask.urgency = 1;
          break;
      }
      
      destTasks.splice(destination.index, 0, updatedTask);
      
      setTasks({
        ...tasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destTasks
      });
      
      // Trigger: updatePriority
      console.log("Trigger: updatePriority", {
        taskId: movedTask.id,
        importance: updatedTask.importance,
        urgency: updatedTask.urgency,
        quadrant: destination.droppableId
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-h2 font-semibold mb-2">艾森豪威爾決策矩陣</h2>
        <p className="text-caption text-muted-foreground">
          拖曳任務到適當的象限來設定優先順序
        </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrants.map((quadrant) => (
            <div key={quadrant.id} className="space-y-3">
              {/* Quadrant Header */}
              <div className={`app-card p-4 ${quadrant.className}`}>
                <h3 className="text-h3 font-semibold">{quadrant.title}</h3>
                <p className="text-caption opacity-80">{quadrant.subtitle}</p>
                <p className="text-xs mt-1 opacity-70">{quadrant.description}</p>
              </div>

              {/* Tasks Droppable Area */}
              <Droppable droppableId={quadrant.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] p-3 border-2 border-dashed rounded-xl transition-colors ${
                      snapshot.isDraggingOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-background'
                    }`}
                  >
                    <div className="space-y-2">
                      {tasks[quadrant.id].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`app-card p-3 cursor-grab active:cursor-grabbing ${
                                snapshot.isDragging ? 'opacity-50 rotate-3 scale-105' : ''
                              }`}
                            >
                              <h4 className="text-body font-medium">{task.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  重要: {task.importance} | 緊急: {task.urgency}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  task.category === 'general' ? 'badge-general' :
                                  task.category === 'background' ? 'badge-background' : 'badge-light'
                                }`}>
                                  {task.category === 'general' ? '一般' : 
                                   task.category === 'background' ? '背景' : '輕型'}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {tasks[quadrant.id].length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="text-caption">拖曳任務到此象限</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};