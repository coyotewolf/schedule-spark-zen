import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EyeOff } from "lucide-react";

interface HideOverlapToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const HideOverlapToggle = ({ enabled, onToggle }: HideOverlapToggleProps) => {
  return (
    <div className="app-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <EyeOff className="w-5 h-5 text-muted-foreground" />
          <div>
            <Label htmlFor="hide-overlap" className="text-body font-medium">
              專注模式
            </Label>
            <p className="text-caption text-muted-foreground">
              隱藏可重疊的任務通知
            </p>
          </div>
        </div>
        
        <Switch
          id="hide-overlap"
          checked={enabled}
          onCheckedChange={onToggle}
        />
      </div>
      
      {enabled && (
        <div className="mt-3 p-2 bg-primary/10 rounded-lg">
          <p className="text-caption text-primary">
            ✓ 專注模式已啟用，將隱藏可重疊任務的通知
          </p>
        </div>
      )}
    </div>
  );
};