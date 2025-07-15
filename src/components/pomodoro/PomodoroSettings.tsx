import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings, Clock } from "lucide-react";

interface PomodoroSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  workDuration: number; // minutes
  breakDuration: number; // minutes
  onWorkDurationChange: (duration: number) => void;
  onBreakDurationChange: (duration: number) => void;
}

export const PomodoroSettings = ({
  isOpen,
  onClose,
  workDuration,
  breakDuration,
  onWorkDurationChange,
  onBreakDurationChange
}: PomodoroSettingsProps) => {

  const handleSave = () => {
    // Trigger: savePomodoroSettings
    console.log("Trigger: savePomodoroSettings", { workDuration, breakDuration });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            番茄鐘設定
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Work Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-body font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                工作時間
              </Label>
              <span className="text-h3 font-semibold text-primary">
                {workDuration} 分鐘
              </span>
            </div>
            
            <Slider
              value={[workDuration]}
              onValueChange={(value) => onWorkDurationChange(value[0])}
              max={60}
              min={5}
              step={5}
              className="w-full"
            />
            
            <div className="flex justify-between text-caption text-muted-foreground">
              <span>5 分鐘</span>
              <span>60 分鐘</span>
            </div>
          </div>

          {/* Break Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-body font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-success" />
                休息時間
              </Label>
              <span className="text-h3 font-semibold text-success">
                {breakDuration} 分鐘
              </span>
            </div>
            
            <Slider
              value={[breakDuration]}
              onValueChange={(value) => onBreakDurationChange(value[0])}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-caption text-muted-foreground">
              <span>1 分鐘</span>
              <span>30 分鐘</span>
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <Label className="text-body font-medium">常用設定</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onWorkDurationChange(25);
                  onBreakDurationChange(5);
                }}
                className="text-sm"
              >
                經典 (25/5)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onWorkDurationChange(50);
                  onBreakDurationChange(10);
                }}
                className="text-sm"
              >
                長專注 (50/10)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onWorkDurationChange(15);
                  onBreakDurationChange(3);
                }}
                className="text-sm"
              >
                短專注 (15/3)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onWorkDurationChange(90);
                  onBreakDurationChange(20);
                }}
                className="text-sm"
              >
                深度工作 (90/20)
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              取消
            </Button>
            <Button onClick={handleSave} className="flex-1">
              儲存設定
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};