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

  // Generate hourly time markers  
  const timeMarkers = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Start from 8:00 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="p-4">
      <div className="flex gap-4">
        {/* Vertical Time Axis */}
        <div className="w-10 flex-shrink-0">
          <div className="space-y-16">
            {timeMarkers.map((time) => (
              <div key={time} className="text-xs text-muted-foreground font-medium">
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Cards */}
        <div className="flex-1 space-y-3">
          {todayTasks.map((task, index) => (
            <div key={task.id} className="relative">
              {/* Travel Time Gap */}
              {task.travelTime && index > 0 && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs bg-warning/10 text-warning border border-warning/20 rounded-full">
                    <Car className="w-3 h-3 inline mr-1" />
                    移動時間 {task.travelTime} 分鐘
                  </span>
                </div>
              )}
              
              {/* Schedule Task Card - No Border */}
              <div 
                className="py-3 px-4 rounded-xl bg-surface/95 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-surface hover:scale-[1.02]"
                onClick={() => openTaskDetail(task.id)}
              >
                {/* Task Title */}
                <h4 className={`text-body font-medium mb-1 ${
                  task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}>
                  {task.title}
                </h4>
                
                {/* Location */}
                {task.location && (
                  <div className="flex items-center gap-1 text-caption text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    {task.location}
                  </div>
                )}
                
                {/* Category Badge & Status */}
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryBadgeClass(task.category)}`}>
                    {task.category === 'general' ? '一般任務' : 
                     task.category === 'background' ? '背景進行' : '輕型任務'}
                  </span>
                  
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
          ))}
        </div>
      </div>
    </div>
  );
};