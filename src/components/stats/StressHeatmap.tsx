export const StressHeatmap = () => {
  // {{API}} - This data will come from API
  const heatmapData = [
    { day: '週一', hours: Array.from({length: 24}, (_, i) => ({ hour: i, stress: Math.random() * 5 })) },
    { day: '週二', hours: Array.from({length: 24}, (_, i) => ({ hour: i, stress: Math.random() * 5 })) },
    { day: '週三', hours: Array.from({length: 24}, (_, i) => ({ hour: i, stress: Math.random() * 5 })) },
    { day: '週四', hours: Array.from({length: 24}, (_, i) => ({ hour: i, stress: Math.random() * 5 })) },
    { day: '週五', hours: Array.from({length: 24}, (_, i) => ({ hour: i, stress: Math.random() * 5 })) },
    { day: '週六', hours: Array.from({length: 24}, (_, i) => ({ hour: i, stress: Math.random() * 5 })) },
    { day: '週日', hours: Array.from({length: 24}, (_, i) => ({ hour: i, stress: Math.random() * 5 })) },
  ];

  const getStressColor = (stress: number) => {
    if (stress < 1) return 'bg-green-100 dark:bg-green-900';
    if (stress < 2) return 'bg-green-200 dark:bg-green-800';
    if (stress < 3) return 'bg-yellow-200 dark:bg-yellow-800';
    if (stress < 4) return 'bg-orange-200 dark:bg-orange-800';
    return 'bg-red-200 dark:bg-red-800';
  };

  const getStressLabel = (stress: number) => {
    if (stress < 1) return '低壓';
    if (stress < 2) return '輕鬆';
    if (stress < 3) return '中等';
    if (stress < 4) return '忙碌';
    return '高壓';
  };

  const timeLabels = ['6', '9', '12', '15', '18', '21'];

  return (
    <div className="app-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">壓力熱力圖</h3>
        <div className="text-right">
          <p className="text-caption text-muted-foreground">本週平均壓力</p>
          <p className="text-h3 font-semibold text-warning">中等</p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-1">
        {/* Time Header */}
        <div className="flex items-center gap-1 mb-2">
          <div className="w-12 text-xs text-muted-foreground"></div>
          {timeLabels.map((time) => (
            <div key={time} className="flex-1 text-center text-xs text-muted-foreground">
              {time}
            </div>
          ))}
        </div>

        {/* Heatmap Rows */}
        {heatmapData.map((dayData) => (
          <div key={dayData.day} className="flex items-center gap-1">
            <div className="w-12 text-xs text-muted-foreground font-medium">
              {dayData.day}
            </div>
            <div className="flex-1 flex gap-0.5">
              {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((hour) => {
                const hourData = dayData.hours[hour];
                return (
                  <div
                    key={hour}
                    className={`h-4 rounded-sm cursor-pointer transition-all hover:scale-110 ${getStressColor(hourData.stress)}`}
                    style={{ width: 'calc(100% / 18)' }}
                    title={`${dayData.day} ${hour}:00 - ${getStressLabel(hourData.stress)} (${hourData.stress.toFixed(1)})`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">低壓</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900" />
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-800" />
          <div className="w-3 h-3 rounded-sm bg-yellow-200 dark:bg-yellow-800" />
          <div className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-800" />
          <div className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-800" />
        </div>
        <span className="text-xs text-muted-foreground">高壓</span>
      </div>

      {/* Analysis */}
      <div className="mt-4 p-3 bg-warning/5 rounded-lg">
        <p className="text-caption text-warning-foreground">
          📊 分析：週三下午和週五晚上是你的高壓時段，建議安排較少任務或休息時間。
        </p>
      </div>
    </div>
  );
};