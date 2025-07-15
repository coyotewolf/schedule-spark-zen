import { Clock, MapPin, Car } from "lucide-react";

interface TimelineTask {
  id: string;
  time: string;
  title: string;
  location?: string;
  category: 'general' | 'background' | 'light';
  travelTime?: number; // minutes
  canOverlap: boolean;
  completed?: boolean;
  status: 'upcoming' | 'in-progress' | 'completed';
}

export const ScheduleTimeline = () => {
  // Generate hourly time labels
  const generateHourlyLabels = () => {
    const hours = [];
    for (let i = 8; i <= 22; i++) {
      hours.push({
        hour: i,
        label: `${i.toString().padStart(2, '0')}:00`
      });
    }
    return hours;
  };

  const hourlyLabels = generateHourlyLabels();

  // {{API}} - This data will come from API
  const todayTasks: TimelineTask[] = [
    {
      id: "1",
      time: "09:00",
      title: "團隊晨會",
      location: "會議室 A",
      category: "general",
      canOverlap: false,
      travelTime: 5,
      status: "upcoming"
    },
    {
      id: "2", 
      time: "10:30",
      title: "專案開發",
      location: "辦公室",
      category: "general", 
      canOverlap: false,
      completed: true,
      status: "completed"
    },
    {
      id: "3",
      time: "12:00",
      title: "午餐時間",
      location: "餐廳",
      category: "light",
      canOverlap: true,
      status: "upcoming"
    },
    {
      id: "4",
      time: "14:00", 
      title: "客戶會議",
      location: "會議室 B",
      category: "general",
      canOverlap: false,
      travelTime: 10,
      status: "upcoming"
    },
    {
      id: "5",
      time: "16:00",
      title: "程式碼檢查",
      category: "background",
      canOverlap: true,
      status: "upcoming"
    }
  ];

  const openTaskDetail = (taskId: string) => {
    // Trigger: openTaskDetail
    console.log("Trigger: openTaskDetail", taskId);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'upcoming':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress':
        return '進行中';
      case 'completed':
        return '已完成';
      case 'upcoming':
        return '待開始';
      default:
        return '待開始';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4">
      <div className="relative min-h-[600px]">
        {/* Hourly Time Labels - positioned to not overlap with timeline */}
        <div className="absolute left-0 top-0 w-14 text-xs text-muted-foreground z-20">
          {hourlyLabels.map((hour) => (
            <div
              key={hour.hour}
              className="absolute font-medium text-right pr-3"
              style={{ top: `${(hour.hour - 8) * 80}px` }}
            >
              {hour.label}
            </div>
          ))}
        </div>
        
        {/* Vertical Timeline - positioned to the right of time labels */}
        <div className="absolute left-16 top-0 w-0.5 h-full" style={{ background: 'hsl(var(--border))' }}>
          {todayTasks.map((task) => {
            const hour = parseInt(task.time.split(':')[0]);
            const minute = parseInt(task.time.split(':')[1]);
            const topPosition = ((hour - 8) * 80) + (minute * 80 / 60);
            
            return (
              <div
                key={`dot-${task.id}`}
                className="absolute w-3 h-3 bg-primary rounded-full border-2 border-background z-10"
                style={{ 
                  top: `${topPosition + 20}px`, // Align with card center
                  left: '-6px'
                }}
              />
            );
          })}
        </div>

        {/* Task Cards - positioned to the right of timeline */}
        <div className="ml-20 space-y-3 pt-2">
          {todayTasks.map((task, index) => (
            <div key={task.id} className="relative">
              {/* Travel Gap Indicator */}
              {task.travelTime && index > 0 && (
                <div className="mb-2 text-caption text-muted-foreground bg-warning/10 px-3 py-1 rounded-lg inline-block">
                  <Car className="w-3 h-3 inline mr-1" />
                  移動時間 {task.travelTime} 分鐘
                </div>
              )}
              
              {/* Schedule Task Card - No Border */}
              <div 
                className="bg-background/50 p-4 rounded-lg cursor-pointer hover:bg-background/80 transition-colors border border-border/50 shadow-sm"
                onClick={() => openTaskDetail(task.id)}
              >
                {/* Header: Task title and Status Badge */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-body font-medium ${
                    task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}>
                    {task.title}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                    {task.canOverlap && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground">
                        可重疊
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Second line: Location and Time */}
                <div className="flex items-center gap-4 text-caption text-muted-foreground">
                  {task.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{task.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {todayTasks.length === 0 && (
          <div className="p-8 text-center mt-8">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-body text-muted-foreground mb-2">今日暫無排程</p>
            <p className="text-caption text-muted-foreground">
              點擊下方快捷按鈕開始規劃你的一天
            </p>
          </div>
        )}
      </div>
    </div>
  );
};