import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TravelGapTag } from "./TravelGapTag";
import { UnscheduledTasksFloat } from "./UnscheduledTaskChip";
import { AutoScheduleSummaryModal } from "./AutoScheduleSummaryModal";

export const ScheduleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [isAutoScheduleModalOpen, setIsAutoScheduleModalOpen] = useState(false);

  // Mock scheduled tasks
  const scheduledTasks = [
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
  ];

  // Mock unscheduled tasks
  const unscheduledTasks = [
    {
      id: "unscheduled_1",
      title: "準備簡報材料",
      category: "工作",
      estimatedTime: 90,
      location: "辦公室",
      categoryColor: "#5A8BFF"
    },
    {
      id: "unscheduled_2", 
      title: "購買日用品",
      category: "個人",
      estimatedTime: 45,
      categoryColor: "#FFB86B"
    },
    {
      id: "unscheduled_3",
      title: "閱讀技術文章",
      category: "學習", 
      estimatedTime: 60,
      categoryColor: "#9B59B6"
    }
  ];

  // Mock auto-scheduled results
  const autoScheduledTasks = [
    {
      id: "unscheduled_1",
      title: "準備簡報材料",
      category: "工作",
      startTime: "15:00",
      endTime: "16:30",
      location: "辦公室",
      categoryColor: "#5A8BFF"
    },
    {
      id: "unscheduled_2",
      title: "購買日用品", 
      category: "個人",
      startTime: "17:00",
      endTime: "17:45",
      categoryColor: "#FFB86B"
    }
  ];

  const runSmartScheduler = () => {
    // Trigger: runSmartScheduler
    console.log("Trigger: runSmartScheduler");
    setIsAutoScheduleModalOpen(true);
  };

  const dragToSchedule = (taskId: string) => {
    // Trigger: dragToSchedule
    console.log("Trigger: dragToSchedule", taskId);
  };

  const smartSchedule = () => {
    // Trigger: smartSchedule
    console.log("Trigger: smartSchedule");
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + direction);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general':
        return 'bg-primary text-primary-foreground';
      case 'background':
        return 'bg-secondary text-secondary-foreground opacity-70';
      case 'light':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-h2 font-semibold">
            {currentDate.toLocaleDateString('zh-TW', { 
              year: 'numeric', 
              month: 'long',
              ...(viewMode === 'day' ? { day: 'numeric' } : {})
            })}
          </h2>
          
          <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={runSmartScheduler} 
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            自動排程
          </Button>
          
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
            <TabsList>
              <TabsTrigger value="day">日</TabsTrigger>
              <TabsTrigger value="week">週</TabsTrigger>
              <TabsTrigger value="month">月</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
        <TabsContent value="day" className="mt-0">
          <div className="app-card p-6">
            <div className="space-y-4">
              {/* Time Grid */}
              {Array.from({ length: 12 }, (_, i) => {
                const hour = i + 8; // 8 AM to 8 PM
                const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                const tasksInSlot = scheduledTasks.filter(task => 
                  parseInt(task.startTime.split(':')[0]) === hour
                );

                return (
                  <div key={timeSlot} className="flex items-start gap-4 min-h-[60px] p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    {/* Time Label */}
                    <div className="w-16 text-sm font-medium text-muted-foreground pt-1">
                      {timeSlot}
                    </div>
                    
                    {/* Task Slots */}
                    <div className="flex-1 space-y-2">
                      {tasksInSlot.map((task) => (
                        <div
                          key={task.id}
                          className={`
                            p-3 rounded-lg text-sm cursor-move hover:shadow-md transition-all duration-200
                            ${getCategoryColor(task.category)}
                            ${task.canOverlap ? 'ml-4 opacity-80' : ''}
                          `}
                          draggable
                          onDragEnd={smartSchedule}
                        >
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs opacity-80 mt-1">
                            {task.startTime} - {task.endTime}
                            {task.location && ` • ${task.location}`}
                          </div>
                        </div>
                      ))}
                      
                      {tasksInSlot.length === 0 && (
                        <div className="text-xs text-muted-foreground italic py-2">
                          拖曳任務到此時段
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Travel Time Indicators */}
            <TravelGapTag 
              fromLocation="會議室A"
              toLocation="辦公室"
              travelTime={5}
              className="mt-6"
            />
          </div>
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <div className="app-card p-6">
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-h3 mb-2">週檢視開發中</p>
              <p className="text-caption">
                請切換到日檢視來管理詳細排程
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="month" className="mt-0">
          <div className="app-card p-6">
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-h3 mb-2">月檢視開發中</p>
              <p className="text-caption">
                請切換到日檢視來管理詳細排程
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Unscheduled Tasks Float */}
      <UnscheduledTasksFloat 
        tasks={unscheduledTasks}
        onDragToSchedule={dragToSchedule}
      />

      {/* Auto Schedule Summary Modal */}
      <AutoScheduleSummaryModal
        isOpen={isAutoScheduleModalOpen}
        onClose={() => setIsAutoScheduleModalOpen(false)}
        scheduledTasks={autoScheduledTasks}
        onAccept={() => console.log("Auto schedule accepted")}
        onReject={() => console.log("Auto schedule rejected")}
      />
    </div>
  );
};