import { ScheduleTimeline } from "@/components/home/ScheduleTimeline";
import { WeeklyCompletionChart } from "@/components/home/WeeklyCompletionChart";
import { DailyQuote } from "@/components/home/DailyQuote";
import { QuickActionBar } from "@/components/home/QuickActionBar";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-h2 font-semibold">今日規劃</h1>
            <p className="text-caption text-muted-foreground">
              {new Date().toLocaleDateString('zh-TW', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full"
            >
              <Link to="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-8 p-4 pb-24">
        {/* Daily Quote */}
        <DailyQuote />
        
        {/* Quick Actions */}
        <QuickActionBar />
        
        {/* Today's Schedule Timeline */}
        <section className="space-y-4">
          <h2 className="text-h3 mb-4">今日行程</h2>
          <ScheduleTimeline />
        </section>
        
        {/* Weekly Completion Chart */}
        <section className="space-y-4">
          <h2 className="text-h3 mb-4">本週完成率</h2>
          <WeeklyCompletionChart />
        </section>
      </div>
    </div>
  );
};