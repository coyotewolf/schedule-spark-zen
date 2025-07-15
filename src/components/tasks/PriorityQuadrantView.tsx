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

      {/* Priority Quadrant Board - Axis Color Mode */}
      <div className="relative bg-card border border-border rounded-xl p-8" style={{ height: '500px' }}>
        {/* Quadrant Background Colors */}
        <div className="absolute inset-8">
          {/* Top half - 緊急 */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-orange-50/30"></div>
          {/* Bottom half - 不緊急 */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-blue-50/30"></div>
          {/* Left half - 不重要 */}
          <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-gray-50/30"></div>
          {/* Right half - 重要 */}
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-green-50/30"></div>
        </div>
        
        {/* Axis Labels */}
        {/* Top - 緊急 */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-sm font-medium text-orange-600">
          緊急
        </div>
        
        {/* Bottom - 不緊急 */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-sm font-medium text-blue-600">
          不緊急
        </div>
        
        {/* Left - 不重要 */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600 origin-center">
          不重要
        </div>
        
        {/* Right - 重要 */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-sm font-medium text-green-600 origin-center">
          重要
        </div>

        {/* Quadrant Lines */}
        <div className="absolute inset-0 m-8">
          {/* Vertical center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50" />
          {/* Horizontal center line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border/50" />
        </div>

        {/* Draggable Task Dots */}
        <div className="absolute inset-0 m-8">
          {tasks.map((task) => {
            const position = getDotPosition(task.importance, task.urgency);
            return (
              <Popover key={task.id}>
                <PopoverTrigger asChild>
                  <button
                    className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-all duration-200 cursor-move z-10"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      backgroundColor: getCategoryColor(task.category),
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => showMiniTaskInfo(task)}
                    onMouseDown={(e) => {
                      // Trigger: startDragTask for future implementation
                      console.log("Trigger: startDragTask", task.id);
                    }}
                  />
                </PopoverTrigger>
                
                 <PopoverContent className="w-64 p-3 rounded-2xl">
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