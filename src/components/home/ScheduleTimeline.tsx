import { Clock, MapPin, Car, ArrowRight } from "lucide-react";

interface TimelineTask {
  id: string;
  time: string;
  title: string;
  location?: string;
  category: 'general' | 'background' | 'light';
  travelTime?: number; // minutes
  canOverlap: boolean;
  completed?: boolean;
}

export const ScheduleTimeline = () => {
  // {{API}} - This data will come from API
  const todayTasks: TimelineTask[] = [
    {
      id: "1",
      time: "09:00",
      title: "團隊晨會",
      location: "會議室 A",
      category: "general",
      canOverlap: false,
      travelTime: 5
    },
    {
      id: "2", 
      time: "10:30",
      title: "專案開發",
      location: "辦公室",
      category: "general", 
      canOverlap: false,
      completed: true
    },
    {
      id: "3",
      time: "12:00",
      title: "午餐時間",
      location: "餐廳",
      category: "light",
      canOverlap: true
    },
    {
      id: "4",
      time: "14:00", 
      title: "客戶會議",
      location: "會議室 B",
      category: "general",
      canOverlap: false,
      travelTime: 10
    },
    {
      id: "5",
      time: "16:00",
      title: "程式碼檢查",
      category: "background",
      canOverlap: true
    }
  ];

  const openTaskDetail = (taskId: string) => {
    // Trigger: openTaskDetail
    console.log("Trigger: openTaskDetail", taskId);
  };

  const getCategoryBadgeClass = (category: TimelineTask['category']) => {
    switch (category) {
      case 'general':
        return 'badge-general';
      case 'background':
        return 'badge-background';
      case 'light':
        return 'badge-light';
      default:
        return 'badge-general';
    }
  };

  return (
    <div className="space-y-3">
      {todayTasks.map((task, index) => (
        <div key={task.id}>
          {/* Travel Time Gap */}
          {task.travelTime && index > 0 && (
            <div className="flex items-center gap-2 py-2 text-caption text-muted-foreground">
              <Car className="w-4 h-4" />
              <span>移動時間 {task.travelTime} 分鐘</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          )}
          
          {/* Task Card */}
          <div 
            onClick={() => openTaskDetail(task.id)}
            className={`app-card p-4 cursor-pointer interactive-hover interactive-press ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Time */}
              <div className="flex flex-col items-center min-w-[60px]">
                <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                <span className="text-caption font-medium">{task.time}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-body font-medium ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}>
                    {task.title}
                  </h3>
                  
                  {/* Category Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryBadgeClass(task.category)}`}>
                    {task.category === 'general' ? '一般任務' : 
                     task.category === 'background' ? '背景進行' : '輕型任務'}
                  </span>
                </div>
                
                {/* Location & Overlap Info */}
                <div className="flex items-center gap-4 text-caption text-muted-foreground">
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
                  
                  {task.completed && (
                    <span className="px-2 py-0.5 bg-success/20 text-success rounded-full text-xs">
                      已完成
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};