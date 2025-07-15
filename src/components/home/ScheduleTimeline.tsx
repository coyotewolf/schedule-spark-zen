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
    <div className="relative">
      {/* Full Vertical Timeline */}
      <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col">
        {/* Main timeline line - 2px width, offset to make room for time labels */}
        <div className="absolute left-12 top-0 bottom-0 bg-border" style={{ width: '2px' }}></div>
        
        {/* Hour markers and labels */}
        {Array.from({ length: 14 }, (_, i) => {
          const hour = 7 + i; // Start from 7AM to 8PM
          const topPosition = i * 60; // More compact spacing
          return (
            <div key={hour} className="absolute left-0" style={{ top: `${topPosition}px` }}>
              {/* Hour text - left side of line, well spaced */}
              <span className="absolute text-xs font-medium text-muted-foreground" style={{ right: '16px', top: '-8px', width: '32px', textAlign: 'right' }}>
                {hour.toString().padStart(2, '0')}:00
              </span>
            </div>
          );
        })}
        
        {/* Task dots positioned on timeline */}
        {todayTasks.map((task, index) => {
          const hour = parseInt(task.time.split(':')[0]);
          const minutes = parseInt(task.time.split(':')[1]);
          const hourOffset = hour - 7; // Adjust for 7AM start
          const topPosition = (hourOffset * 60) + (minutes / 60 * 60);
          
          return (
            <div
              key={`dot-${task.id}`}
              className="absolute w-3 h-3 bg-primary rounded-full border-2 border-background z-20 shadow-sm"
              style={{ 
                top: `${topPosition + 24}px`, // Offset to align with task card center
                left: '43px', // Center on the line
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}
      </div>

      {/* Task Cards */}
      <div className="ml-20 space-y-4">
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
              className="bg-card p-3 rounded-lg cursor-pointer hover:bg-card/80 transition-colors border-0 shadow-none"
              onClick={() => openTaskDetail(task.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-body font-medium ${
                  task.completed ? 'line-through text-muted-foreground' : ''
                }`}>
                  {task.title}
                </h3>
                <div className="flex gap-2">
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
              
              <div className="flex items-center gap-4 text-caption text-muted-foreground">
                {task.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {task.location}
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
        <div className="app-card p-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-body text-muted-foreground mb-2">今日暫無排程</p>
          <p className="text-caption text-muted-foreground">
            點擊下方快捷按鈕開始規劃你的一天
          </p>
        </div>
      )}
    </div>
  );
};