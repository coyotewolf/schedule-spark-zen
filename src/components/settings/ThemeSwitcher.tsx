import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-body font-medium">主題模式</p>
        <p className="text-caption text-muted-foreground">
          選擇淺色或深色主題
        </p>
      </div>
      
      <Button
        variant="outline"
        onClick={toggleTheme}
        className="flex items-center gap-2"
      >
        {theme === 'light' ? (
          <>
            <Moon className="w-4 h-4" />
            切換深色
          </>
        ) : (
          <>
            <Sun className="w-4 h-4" />
            切換淺色
          </>
        )}
      </Button>
    </div>
  );
};