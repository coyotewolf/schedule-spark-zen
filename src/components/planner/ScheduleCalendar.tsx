import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { TravelGapTag } from "./TravelGapTag";

interface CalendarTask {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'general' | 'background' | 'light';
  canOverlap: boolean;
  location?: string;
}

interface ScheduleCalendarProps {
  currentDate: Date;
  viewMode: "day" | "week" | "month";
}

export const ScheduleCalendar = ({ currentDate, viewMode }: ScheduleCalendarProps) => {
  const [scheduledTasks, setScheduledTasks] = useState<CalendarTask[]>([
    {
      id: "cal-1",
      title: "晨會",
      startTime: "09:00",
      endTime: "09:30",
      category: "general",
      canOverlap: false,
      location: "會議室A"
    },
    {
      id: "cal-2",
      title: "專案開發",
      startTime: "10:00",
      endTime: "12:00",
      category: "general",
      canOverlap: false,
      location: "辦公室"
    },
    {
      id: "cal-3",
      title: "系統監控",
      startTime: "10:30",
      endTime: "11:00",
      category: "background",
      canOverlap: true
    }
  ]);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Handle task reordering and time slot changes
    const taskId = result.draggableId;
    const newTimeSlot = result.destination.droppableId;
    
    // Trigger: smartSchedule
    console.log("Trigger: smartSchedule", {
      taskId,
      newTimeSlot,
      date: currentDate.toISOString()
    });
  };

  const getTasksByTimeSlot = (timeSlot: string) => {
    return scheduledTasks.filter(task => 
      task.startTime <= timeSlot && task.endTime > timeSlot
    );
  };

  const getCategoryColor = (category: CalendarTask['category']) => {
    switch (category) {
      case 'general':
        return 'bg-primary text-primary-foreground';
      case 'background':
        return 'bg-secondary text-secondary-foreground opacity-70';
      case 'light':
        return 'bg-muted text-muted-foreground';
    }
  };

  if (viewMode === "day") {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="app-card p-4">
          <div className="space-y-1">
            {timeSlots.map((timeSlot) => {
              const tasks = getTasksByTimeSlot(timeSlot);
              
              return (
                <Droppable key={timeSlot} droppableId={timeSlot}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex items-center gap-3 min-h-[60px] p-2 border border-border rounded-lg ${
                        snapshot.isDraggingOver ? 'bg-primary/5 border-primary' : ''
                      }`}
                    >
                      {/* Time Label */}
                      <div className="w-16 text-sm font-medium text-muted-foreground">
                        {timeSlot}
                      </div>
                      
                      {/* Task Slots */}
                      <div className="flex-1 space-y-1">
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  p-2 rounded-lg text-sm cursor-grab active:cursor-grabbing
                                  ${getCategoryColor(task.category)}
                                  ${snapshot.isDragging ? 'opacity-50 rotate-1 scale-105' : ''}
                                  ${task.canOverlap ? 'ml-4' : ''}
                                `}
                              >
                                <div className="font-medium">{task.title}</div>
                                <div className="text-xs opacity-80">
                                  {task.startTime} - {task.endTime}
                                  {task.location && ` • ${task.location}`}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {tasks.length === 0 && (
                          <div className="text-xs text-muted-foreground italic py-2">
                            拖曳任務到此時段
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
          
          {/* Travel Time Indicators */}
          <TravelGapTag 
            fromLocation="會議室A"
            toLocation="辦公室"
            travelTime={5}
            className="mt-4"
          />
        </div>
      </DragDropContext>
    );
  }

  // Week and Month views (simplified)
  return (
    <div className="app-card p-4">
      <div className="text-center py-8 text-muted-foreground">
        <p>
          {viewMode === "week" ? "週" : "月"}檢視模式開發中...
        </p>
        <p className="text-caption mt-2">
          請切換到日檢視來拖曳排程任務
        </p>
      </div>
    </div>
  );
};