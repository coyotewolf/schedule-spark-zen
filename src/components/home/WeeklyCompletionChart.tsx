import { BarChart3 } from "lucide-react";

interface DayCompletion {
  day: string;
  completed: number;
  total: number;
  percentage: number;
}

export const WeeklyCompletionChart = () => {
  // {{API}} - This data will come from API
  const weeklyData: DayCompletion[] = [
    { day: "週一", completed: 8, total: 10, percentage: 80 },
    { day: "週二", completed: 6, total: 8, percentage: 75 },
    { day: "週三", completed: 9, total: 12, percentage: 75 },
    { day: "週四", completed: 7, total: 9, percentage: 78 },
    { day: "週五", completed: 5, total: 7, percentage: 71 },
    { day: "週六", completed: 3, total: 4, percentage: 75 },
    { day: "週日", completed: 2, total: 3, percentage: 67 },
  ];

  const averageCompletion = Math.round(
    weeklyData.reduce((sum, day) => sum + day.percentage, 0) / weeklyData.length
  );

  return (
    <div className="app-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-h3">任務完成趨勢</h3>
        </div>
        <div className="text-right">
          <p className="text-caption text-muted-foreground">平均完成率</p>
          <p className="text-h3 text-primary font-semibold">{averageCompletion}%</p>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="space-y-3">
        {weeklyData.map((day) => (
          <div key={day.day} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-body font-medium">{day.day}</span>
              <span className="text-caption text-muted-foreground">
                {day.completed}/{day.total} ({day.percentage}%)
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{ width: `${day.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-caption text-muted-foreground">總任務</p>
            <p className="text-h3 font-semibold">
              {weeklyData.reduce((sum, day) => sum + day.total, 0)}
            </p>
          </div>
          <div>
            <p className="text-caption text-muted-foreground">已完成</p>
            <p className="text-h3 font-semibold text-success">
              {weeklyData.reduce((sum, day) => sum + day.completed, 0)}
            </p>
          </div>
          <div>
            <p className="text-caption text-muted-foreground">剩餘</p>
            <p className="text-h3 font-semibold text-warning">
              {weeklyData.reduce((sum, day) => sum + (day.total - day.completed), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};