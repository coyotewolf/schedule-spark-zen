import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CompletionRateChart = () => {
  // {{API}} - This data will come from API
  const data = [
    { date: '週一', completion: 80, total: 10, completed: 8 },
    { date: '週二', completion: 75, total: 8, completed: 6 },
    { date: '週三', completion: 85, total: 12, completed: 10 },
    { date: '週四', completion: 70, total: 9, completed: 6 },
    { date: '週五', completion: 90, total: 7, completed: 6 },
    { date: '週六', completion: 60, total: 4, completed: 2 },
    { date: '週日', completion: 95, total: 3, completed: 3 },
  ];

  return (
    <div className="app-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">完成率趨勢</h3>
        <div className="text-right">
          <p className="text-caption text-muted-foreground">本週平均</p>
          <p className="text-h3 font-semibold text-primary">79%</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
              formatter={(value, name) => [
                `${value}%`,
                '完成率'
              ]}
              labelFormatter={(label) => `日期: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="completion" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-caption text-muted-foreground">最高</p>
          <p className="text-body font-semibold text-success">95%</p>
        </div>
        <div className="text-center">
          <p className="text-caption text-muted-foreground">最低</p>
          <p className="text-body font-semibold text-destructive">60%</p>
        </div>
        <div className="text-center">
          <p className="text-caption text-muted-foreground">趨勢</p>
          <p className="text-body font-semibold text-primary">↗ +15%</p>
        </div>
      </div>
    </div>
  );
};