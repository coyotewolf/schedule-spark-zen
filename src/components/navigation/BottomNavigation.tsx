import { NavLink, useLocation } from "react-router-dom";
import { Home, Calendar, CheckSquare, Timer, BarChart3, Mic } from "lucide-react";

interface BottomNavigationProps {
  onVoiceInput: () => void;
}

export const BottomNavigation = ({ onVoiceInput }: BottomNavigationProps) => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "首頁" },
    { path: "/tasks", icon: CheckSquare, label: "任務" },
    { path: "/planner", icon: Calendar, label: "規劃" },
    { path: "/pomodoro", icon: Timer, label: "番茄鐘" },
    { path: "/stats", icon: BarChart3, label: "統計" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg transition-colors ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
        
        {/* Voice Input Button */}
        <button
          onClick={onVoiceInput}
          className="flex flex-col items-center justify-center flex-1 py-2 rounded-lg text-secondary hover:text-secondary/80 hover:bg-secondary/10 transition-colors"
        >
          <Mic className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">語音</span>
        </button>
      </div>
    </nav>
  );
};