import { useState } from "react";
import { Check, X, Clock, MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScheduledTask {
  id: string;
  title: string;
  category: string;
  startTime: string;
  endTime: string;
  location?: string;
  categoryColor: string;
}

interface AutoScheduleSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledTasks: ScheduledTask[];
  onAccept?: () => void;
  onReject?: () => void;
}

export const AutoScheduleSummaryModal = ({ 
  isOpen, 
  onClose, 
  scheduledTasks,
  onAccept,
  onReject 
}: AutoScheduleSummaryModalProps) => {
  
  const handleAccept = () => {
    // Trigger: acceptAutoSchedule
    console.log("Trigger: acceptAutoSchedule");
    onAccept?.();
    onClose();
  };

  const handleReject = () => {
    // Trigger: rejectAutoSchedule  
    console.log("Trigger: rejectAutoSchedule");
    onReject?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
            自動排程結果
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            已為 {scheduledTasks.length} 個任務安排時間，請確認排程結果
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {scheduledTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: task.categoryColor }}
                      />
                      <h4 className="font-medium text-sm text-foreground">
                        {task.title}
                      </h4>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{task.startTime} - {task.endTime}</span>
                      </div>
                      
                      {task.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{task.location}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {task.category}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-border pt-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReject}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              回退重排
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              接受排程
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-3">
            接受後將自動更新您的行程安排
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};