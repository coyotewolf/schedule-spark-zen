import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface PomodoroTimerProps {
  timeRemaining: number; // seconds
  totalTime: number; // seconds
  isWork: boolean;
  isActive: boolean;
}

export const PomodoroTimer = ({ 
  timeRemaining, 
  totalTime, 
  isWork, 
  isActive 
}: PomodoroTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = ((totalTime - timeRemaining) / totalTime) * 100;
  
  // Color scheme based on mode
  const pathColor = isWork ? '#E65A5A' : '#3DC97F'; // pomodoro-work or pomodoro-break
  const trailColor = isWork ? '#E65A5A20' : '#3DC97F20';

  return (
    <div className="flex flex-col items-center">
      {/* Timer Circle */}
      <div className="w-64 h-64 mb-6">
        <CircularProgressbar
          value={percentage}
          text={formatTime(timeRemaining)}
          styles={buildStyles({
            textColor: 'hsl(var(--foreground))',
            pathColor: pathColor,
            trailColor: trailColor,
            textSize: '18px',
            pathTransitionDuration: 1,
            pathTransition: isActive ? 'stroke-dashoffset 1s ease 0s' : 'none',
          })}
        />
      </div>

      {/* Mode Indicator */}
      <div className="text-center">
        <p className="text-caption text-muted-foreground mb-1">
          {isWork ? '工作時間' : '休息時間'}
        </p>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          isWork ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                   'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isWork ? 'bg-red-500' : 'bg-green-500'
          } ${isActive ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium">
            {isWork ? '🍅 專注模式' : '☕ 休息模式'}
          </span>
        </div>
      </div>
    </div>
  );
};