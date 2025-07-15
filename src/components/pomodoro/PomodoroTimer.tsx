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

      {/* Simplified Display - No mode text */}
      <div className="text-center">
        {/* Removed mode text as requested */}
      </div>
    </div>
  );
};