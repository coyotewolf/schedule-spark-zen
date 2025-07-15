import { useState } from "react";
import { CompletionRateChart } from "@/components/stats/CompletionRateChart";
import { CategoryPieChart } from "@/components/stats/CategoryPieChart";
import { StressHeatmap } from "@/components/stats/StressHeatmap";
import { HistoryTaskList } from "@/components/stats/HistoryTaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, PieChart, TrendingUp, History } from "lucide-react";

export const StatsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-h2 font-semibold">統計分析</h1>
              <p className="text-caption text-muted-foreground">
                檢視你的時間管理效率與進度
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">概覽</TabsTrigger>
            <TabsTrigger value="completion" className="text-xs">完成率</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs">分類</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">歷史</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="app-card p-4 text-center">
                <p className="text-caption text-muted-foreground">本週完成</p>
                <p className="text-h2 font-bold text-success">28</p>
                <p className="text-xs text-muted-foreground">+12% 比上週</p>
              </div>
              <div className="app-card p-4 text-center">
                <p className="text-caption text-muted-foreground">平均專注</p>
                <p className="text-h2 font-bold text-primary">2.5h</p>
                <p className="text-xs text-muted-foreground">每日番茄鐘</p>
              </div>
            </div>
            
            {/* Completion Chart */}
            <CompletionRateChart />
            
            {/* Stress Heatmap */}
            <StressHeatmap />
          </TabsContent>
          
          <TabsContent value="completion" className="mt-6">
            <CompletionRateChart />
          </TabsContent>
          
          <TabsContent value="categories" className="mt-6">
            <CategoryPieChart />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <HistoryTaskList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};