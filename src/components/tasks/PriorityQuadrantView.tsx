import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Edit, Check, MapPin, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: string;
  importance: number; // 1-5
  urgency: number; // 1-5
  estimatedTime: number;
  location?: string;
}

interface PriorityQuadrantViewProps {
  timePeriod: string;
}

export const PriorityQuadrantView = ({ timePeriod }: PriorityQuadrantViewProps) => {
  // Mock tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "完成專案提案",
      category: "工作",
      importance: 5,
      urgency: 5,
      estimatedTime: 120,
      location: "辦公室"
    },
    {
      id: "2", 
      title: "學習新技能",
      category: "學習",
      importance: 4,
      urgency: 2,
      estimatedTime: 90
    },
    {
      id: "3",
      title: "回覆客戶郵件",
      category: "工作", 
      importance: 2,
      urgency: 4,
      estimatedTime: 30,
      location: "辦公室"
    },
    {
      id: "4",
      title: "整理桌面",
      category: "個人",
      importance: 1,
      urgency: 1,
      estimatedTime: 15
    }
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const updatePriority = (taskId: string, newImportance: number, newUrgency: number) => {
    // Trigger: updatePriority
    console.log("Trigger: updatePriority", { taskId, newImportance, newUrgency });
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, importance: newImportance, urgency: newUrgency }
        : task
    ));
  };

  const showMiniTaskInfo = (task: Task) => {
    // Trigger: showMiniTaskInfo
    console.log("Trigger: showMiniTaskInfo", task.id);
    setSelectedTask(task);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "工作": "#5A8BFF",
      "學習": "#9B59B6",
      "個人": "#FFB86B",
      "健康": "#3DC97F"
    };
    return colors[category as keyof typeof colors] || "#60666C";
  };

  // Calculate dot position based on importance (x-axis) and urgency (y-axis)
  const getDotPosition = (importance: number, urgency: number) => {
    const x = ((importance - 1) / 4) * 100; // Convert 1-5 to 0-100%
    const y = 100 - ((urgency - 1) / 4) * 100; // Invert Y axis for visual clarity
    return { x, y };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-center w-full">艾森豪矩陣</h3>
      </div>

      {/* Priority Quadrant Board - Dot Mode */}
      <div className="relative bg-card border border-border rounded-xl p-8" style={{ height: '500px' }}>
        {/* Quadrant Background Colors */}
        <div className="absolute inset-8">
          {/* Top half - 緊急 */}
          <div className="absolute top-0 left-0 right-0 h-1/2" style={{ backgroundColor: '#FFECE8' }}></div>
          {/* Bottom half - 不緊急 */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{ backgroundColor: '#E8F4FF' }}></div>
          {/* Left half - 不重要 */}
          <div className="absolute top-0 left-0 bottom-0 w-1/2" style={{ backgroundColor: '#F5F5F5' }}></div>
          {/* Right half - 重要 */}
          <div className="absolute top-0 right-0 bottom-0 w-1/2" style={{ backgroundColor: '#F0FFF6' }}></div>
        </div>
        
        {/* Axis Labels */}
        {/* Top - 緊急 */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground">
          緊急
        </div>
        
        {/* Bottom - 不緊急 */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground">
          不緊急
        </div>
        
        {/* Left - 不重要 */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-muted-foreground origin-center">
          不重要
        </div>
        
        {/* Right - 重要 */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-sm font-medium text-muted-foreground origin-center">
          重要
        </div>

        {/* Quadrant Lines - More visible */}
        <div className="absolute inset-0 m-8">
          {/* Vertical center line */}
          <div className="absolute left-1/2 top-0 bottom-0 bg-border" style={{ width: '2px', transform: 'translateX(-1px)' }} />
          {/* Horizontal center line */}
          <div className="absolute top-1/2 left-0 right-0 bg-border" style={{ height: '2px', transform: 'translateY(-1px)' }} />
        </div>

        {/* Quadrant Labels */}
        <div className="absolute top-4 left-4 text-xs text-destructive font-medium">重要且緊急</div>
        <div className="absolute top-4 right-4 text-xs text-primary font-medium">重要不緊急</div>
        <div className="absolute bottom-4 left-4 text-xs text-warning font-medium">不重要但緊急</div>
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-medium">不重要不緊急</div>

        {/* Task Dots */}
        <div className="absolute inset-0 m-8">
          {tasks.map((task) => {
            const position = getDotPosition(task.importance, task.urgency);
            return (
              <Popover key={task.id}>
                <PopoverTrigger asChild>
                  <button
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-all duration-200 cursor-pointer"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      backgroundColor: getCategoryColor(task.category),
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => showMiniTaskInfo(task)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      let isDragging = false;
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const rect = e.currentTarget.closest('.relative')?.getBoundingClientRect();
                      
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        if (!rect) return;
                        
                        const deltaX = Math.abs(moveEvent.clientX - startX);
                        const deltaY = Math.abs(moveEvent.clientY - startY);
                        
                        if (deltaX > 5 || deltaY > 5) {
                          isDragging = true;
                        }
                        
                        if (isDragging) {
                          const relativeX = (moveEvent.clientX - rect.left - 32) / (rect.width - 64);
                          const relativeY = (moveEvent.clientY - rect.top - 32) / (rect.height - 64);
                          
                          const newImportance = Math.max(1, Math.min(5, Math.round(relativeX * 4) + 1));
                          const newUrgency = Math.max(1, Math.min(5, 5 - Math.round(relativeY * 4)));
                          
                          // Update position immediately for visual feedback
                          const newPosition = getDotPosition(newImportance, newUrgency);
                          e.currentTarget.style.left = `${newPosition.x}%`;
                          e.currentTarget.style.top = `${newPosition.y}%`;
                        }
                      };
                      
                      const handleMouseUp = (upEvent: MouseEvent) => {
                        if (isDragging && rect) {
                          const relativeX = (upEvent.clientX - rect.left - 32) / (rect.width - 64);
                          const relativeY = (upEvent.clientY - rect.top - 32) / (rect.height - 64);
                          
                          const newImportance = Math.max(1, Math.min(5, Math.round(relativeX * 4) + 1));
                          const newUrgency = Math.max(1, Math.min(5, 5 - Math.round(relativeY * 4)));
                          
                          updatePriority(task.id, newImportance, newUrgency);
                        }
                        
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                </PopoverTrigger>
                
                 <PopoverContent className="w-64 p-3 rounded-2xl border shadow-lg bg-popover">
                   <div className="space-y-3">
                     <h4 className="font-medium text-sm">{task.title}</h4>
                     
                     <div className="space-y-2 text-xs text-muted-foreground">
                       <div className="flex items-center gap-1">
                         <Clock className="w-3 h-3" />
                         {task.estimatedTime} 分鐘
                       </div>
                       
                       {task.location && (
                         <div className="flex items-center gap-1">
                           <MapPin className="w-3 h-3" />
                           {task.location}
                         </div>
                       )}
                       
                       <div className="flex items-center gap-1">
                         <div 
                           className="w-3 h-3 rounded-full" 
                           style={{ backgroundColor: getCategoryColor(task.category) }}
                         />
                         {task.category}
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2 text-xs">
                         <div>
                           <span className="text-muted-foreground">重要度：</span>
                           <span className="font-medium">{task.importance}/5</span>
                         </div>
                         <div>
                           <span className="text-muted-foreground">緊急度：</span>
                           <span className="font-medium">{task.urgency}/5</span>
                         </div>
                       </div>
                     </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                        <Edit className="w-3 h-3 mr-1" />
                        編輯
                      </Button>
                      <Button size="sm" className="h-7 px-2 text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        完成
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>

        {/* Scale indicators */}
        <div className="absolute bottom-0 left-8 right-8 flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
        
        <div className="absolute top-8 bottom-8 left-0 flex flex-col-reverse justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};