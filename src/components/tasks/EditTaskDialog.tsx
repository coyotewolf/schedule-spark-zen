import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  status: 'pending' | 'in_progress' | 'completed';
  importance: number;
  urgency: number;
  description?: string;
}

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave?: (task: Task) => void;
}

export const EditTaskDialog = ({ open, onOpenChange, task, onSave }: EditTaskDialogProps) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    category: '',
    taskType: 'general',
    estimatedTime: 30,
    location: '',
    preferredSlot: '',
    canOverlap: false,
    status: 'pending',
    importance: 3,
    urgency: 3,
    description: ''
  });

  useEffect(() => {
    if (task && open) {
      setFormData({
        ...task
      });
    } else if (!task && open) {
      // Reset form for adding new task
      setFormData({
        title: '',
        category: '',
        taskType: 'general',
        estimatedTime: 30,
        location: '',
        preferredSlot: '',
        canOverlap: false,
        status: 'pending',
        importance: 3,
        urgency: 3,
        description: ''
      });
    }
  }, [task, open]);

  const handleSave = () => {
    if (formData.title && formData.category) {
      const taskData: Task = {
        id: task?.id || Date.now().toString(),
        title: formData.title || '',
        category: formData.category || '',
        taskType: formData.taskType || 'general',
        estimatedTime: formData.estimatedTime || 30,
        location: formData.location,
        preferredSlot: formData.preferredSlot,
        canOverlap: formData.canOverlap || false,
        status: formData.status || 'pending',
        importance: formData.importance || 3,
        urgency: formData.urgency || 3
      };

      onSave?.(taskData);
      onOpenChange(false);
      
      // Trigger
      console.log(task ? "Trigger: updateTask" : "Trigger: addTask", taskData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-h3">
            {task ? '編輯任務' : '新增任務'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">任務標題</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="輸入任務標題"
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">類別</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="選擇類別" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="工作">工作</SelectItem>
                <SelectItem value="個人">個人</SelectItem>
                <SelectItem value="學習">學習</SelectItem>
                <SelectItem value="健康">健康</SelectItem>
                <SelectItem value="休閒">休閒</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskType">任務類型</Label>
            <Select
              value={formData.taskType}
              onValueChange={(value: 'general' | 'background' | 'light') => 
                setFormData({ ...formData, taskType: value })
              }
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="選擇任務類型" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="general">一般任務</SelectItem>
                <SelectItem value="background">背景任務</SelectItem>
                <SelectItem value="light">輕型任務</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedTime">預估時間 (分鐘)</Label>
            <Input
              id="estimatedTime"
              type="number"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 0 })}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">地點</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="選填"
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredSlot">偏好時段</Label>
            <Select
              value={formData.preferredSlot}
              onValueChange={(value) => setFormData({ ...formData, preferredSlot: value })}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="選擇偏好時段" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="上午">上午</SelectItem>
                <SelectItem value="下午">下午</SelectItem>
                <SelectItem value="晚上">晚上</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="canOverlap">可與其他任務重疊</Label>
            <Switch
              id="canOverlap"
              checked={formData.canOverlap}
              onCheckedChange={(checked) => setFormData({ ...formData, canOverlap: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>重要度：{formData.importance}</Label>
            <Slider
              value={[formData.importance || 3]}
              onValueChange={(value) => setFormData({ ...formData, importance: value[0] })}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>緊急度：{formData.urgency}</Label>
            <Slider
              value={[formData.urgency || 3]}
              onValueChange={(value) => setFormData({ ...formData, urgency: value[0] })}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-lg"
            >
              取消
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title || !formData.category}
              className="flex-1 rounded-lg"
            >
              {task ? '更新' : '新增'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};