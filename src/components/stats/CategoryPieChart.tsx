import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const CategoryPieChart = () => {
  // {{API}} - This data will come from API
  const data = [
    { name: '一般任務', value: 45, color: 'hsl(var(--primary))' },
    { name: '背景進行', value: 30, color: 'hsl(var(--secondary))' },
    { name: '輕型任務', value: 25, color: 'hsl(var(--muted))' },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="app-card p-4">
      <h3 className="text-h3 font-semibold mb-4">任務分類分佈</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
              formatter={(value) => [`${value} 個任務`, '數量']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Legend */}
      <div className="space-y-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-body">{item.name}</span>
            </div>
            <span className="text-caption text-muted-foreground">
              {item.value} 個任務
            </span>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-4 p-3 bg-primary/5 rounded-lg">
        <p className="text-caption text-primary font-medium">
          💡 洞察：你在一般任務上花費最多時間，考慮將部分任務設為背景進行來提升效率。
        </p>
      </div>
    </div>
  );
};