import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleCalendar } from "@/components/planner/ScheduleCalendar";
import { UnscheduledTaskDrawer } from "@/components/planner/UnscheduledTaskDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PlannerPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const formatDateTitle = () => {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (viewMode) {
      case "day":
        return currentDate.toLocaleDateString('zh-TW', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        });
      case "week":
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return `${weekStart.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}`;
      case "month":
        return currentDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-h2 font-semibold">行程規劃</h1>
                <p className="text-caption text-muted-foreground">拖曳任務到時間軸進行排程</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setIsDrawerOpen(true)}
              className="text-sm"
            >
              <List className="w-4 h-4 mr-2" />
              未排程任務
            </Button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h2 className="text-h3 font-medium min-w-[200px] text-center">
                {formatDateTitle()}
              </h2>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* View Mode Tabs */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
              <TabsList>
                <TabsTrigger value="day">日</TabsTrigger>
                <TabsTrigger value="week">週</TabsTrigger>
                <TabsTrigger value="month">月</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Calendar Content */}
      <div className="p-4 pb-24">
        <ScheduleCalendar />
      </div>

      {/* Unscheduled Tasks Drawer */}
      <UnscheduledTaskDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};