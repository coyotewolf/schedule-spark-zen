import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CurrentTaskBadgeProps {
  task: string | null;
  onSelectTask: () => void;
}

export const CurrentTaskBadge = ({ task, onSelectTask }: CurrentTaskBadgeProps) => {
  if (!task) {
    return (
      <Button 
        variant="outline" 
        onClick={onSelectTask}
        className="mb-4 interactive-hover"
      >
        <Plus className="w-4 h-4 mr-2" />
        選擇專注任務
      </Button>
    );
  }

  return (
    <div className="app-card p-4 mb-4 max-w-sm">
      <div className="flex items-center gap-3">
        <CheckSquare className="w-5 h-5 text-primary" />
        <div>
          <p className="text-caption text-muted-foreground">目前專注於</p>
          <p className="text-body font-medium">{task}</p>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onSelectTask}
        className="mt-2 w-full"
      >
        更換任務
      </Button>
    </div>
  );
};