import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Clock, MapPin } from "lucide-react";

interface UnscheduledTask {
  id: string;
  title: string;
  category: 'general' | 'background' | 'light';
  estimatedTime: number;
  location?: string;
  canOverlap: boolean;
}

interface UnscheduledTaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnscheduledTaskDrawer = ({ isOpen, onClose }: UnscheduledTaskDrawerProps) => {
  const unscheduledTasks: UnscheduledTask[] = [
    {
      id: "unsch-1",
      title: "回覆客戶郵件",
      category: "light",
      estimatedTime: 15,
      canOverlap: true
    },
    {
      id: "unsch-2",
      title: "準備明日簡報",
      category: "general",
      estimatedTime: 90,
      location: "辦公室",
      canOverlap: false
    },
    {
      id: "unsch-3",
      title: "程式碼審查",
      category: "background",
      estimatedTime: 30,
      canOverlap: true
    },
    {
      id: "unsch-4",
      title: "團隊會議準備",
      category: "general",
      estimatedTime: 45,
      location: "會議室B",
      canOverlap: false
    }
  ];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    // This would typically handle dragging tasks to the calendar
    const taskId = result.draggableId;
    // Trigger: smartSchedule
    console.log("Trigger: smartSchedule", { taskId, source: "unscheduled" });
  };

  const getCategoryBadgeClass = (category: UnscheduledTask['category']) => {
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>未排程任務</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <p className="text-caption text-muted-foreground mb-4">
            拖曳任務到行事曆中進行智慧排程
          </p>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="unscheduled-tasks">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3"
                >
                  {unscheduledTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            app-card p-3 cursor-grab active:cursor-grabbing
                            interactive-hover
                            ${snapshot.isDragging ? 'opacity-50 rotate-1 scale-105' : ''}
                          `}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-body font-medium">{task.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${getCategoryBadgeClass(task.category)}`}>
                              {task.category === 'general' ? '一般' : 
                               task.category === 'background' ? '背景' : '輕型'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-caption text-muted-foreground">
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
                            
                            {task.canOverlap && (
                              <span className="px-2 py-0.5 bg-secondary/20 text-secondary rounded-full text-xs">
                                可重疊
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          {unscheduledTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-caption">所有任務都已排程完成！</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};