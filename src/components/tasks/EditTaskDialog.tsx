import { useState, useEffect } from "react";
import { Edit, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface Task {
  id: string;
  title: string;
  category: string;
  taskType: 'general' | 'background' | 'light';
  estimatedTime: number;
  location?: string;
  preferredSlot?: string;
  canOverlap: boolean;
  description?: string;
}

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (task: Task) => void;
}

export const EditTaskDialog = ({ open, onOpenChange, task, onSave }: EditTaskDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    taskType: "general" as 'general' | 'background' | 'light',
    estimatedTime: [60], // in minutes
    location: "",
    preferredSlot: "",
    canOverlap: false,
    description: ""
  });

  const categories = [
    { id: "工作", name: "工作", color: "#5A8BFF" },
    { id: "個人", name: "個人", color: "#FFB86B" },
    { id: "健康", name: "健康", color: "#3DC97F" },
    { id: "學習", name: "學習", color: "#9B59B6" }
  ];

  const taskTypes = [
    { id: "general", name: "一般任務" },
    { id: "background", name: "背景任務" },
    { id: "light", name: "輕型任務" }
  ];

  const timeSlots = [
    "早上 (6:00-12:00)",
    "下午 (12:00-18:00)", 
    "晚上 (18:00-24:00)",
    "深夜 (24:00-6:00)"
  ];

  // Load task data when dialog opens
  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title,
        category: task.category,
        taskType: task.taskType,
        estimatedTime: [task.estimatedTime],
        location: task.location || "",
        preferredSlot: task.preferredSlot || "",
        canOverlap: task.canOverlap,
        description: task.description || ""
      });
    }
  }, [task, open]);

  const saveTask = () => {
    if (task) {
      const updatedTask: Task = {
        ...task,
        title: formData.title,
        category: formData.category,
        taskType: formData.taskType,
        estimatedTime: formData.estimatedTime[0],
        location: formData.location,
        preferredSlot: formData.preferredSlot,
        canOverlap: formData.canOverlap,
        description: formData.description
      };
      
      // Trigger: updateTask
      console.log("Trigger: updateTask", updatedTask);
      onSave(updatedTask);
      onOpenChange(false);
    }
  };

  const closeDialog = () => {
    // Trigger: closeEditDialog
    console.log("Trigger: closeEditDialog");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            編輯任務
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">任務名稱 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="輸入任務名稱"
            />
          </div>

          {/* Category and Task Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>類別</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇類別" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>任務類型</Label>
              <Select value={formData.taskType} onValueChange={(value: 'general' | 'background' | 'light') => setFormData(prev => ({ ...prev, taskType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇類型" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              預估時間: {formData.estimatedTime[0]} 分鐘
            </Label>
            <Slider
              value={formData.estimatedTime}
              onValueChange={(value) => setFormData(prev => ({ ...prev, estimatedTime: value }))}
              max={480}
              min={15}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15分</span>
              <span>8小時</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              地點
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="輸入地點"
            />
          </div>

          {/* Preferred Time Slot */}
          <div className="space-y-2">
            <Label>偏好時段</Label>
            <Select value={formData.preferredSlot} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredSlot: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="選擇偏好時段" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Can Overlap Switch */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Label>允許重疊執行</Label>
              <p className="text-xs text-muted-foreground">
                此任務可與其他任務同時進行
              </p>
            </div>
            <Switch
              checked={formData.canOverlap}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, canOverlap: checked }))}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">備註</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="輸入任務備註"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={closeDialog}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={saveTask}
              disabled={!formData.title.trim()}
              className="flex-1"
            >
              儲存變更
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};