import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskFilterProps {
  filter: {
    category: string;
    taskType: string;
    status: string;
  };
  onFilterChange: (filter: { category: string; taskType: string; status: string }) => void;
}

export const TaskFilter = ({ filter, onFilterChange }: TaskFilterProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <Select
          value={filter.category}
          onValueChange={(value) => onFilterChange({ ...filter, category: value })}
        >
          <SelectTrigger className="rounded-lg">
            <SelectValue placeholder="選擇類別" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">所有類別</SelectItem>
            <SelectItem value="工作">工作</SelectItem>
            <SelectItem value="個人">個人</SelectItem>
            <SelectItem value="學習">學習</SelectItem>
            <SelectItem value="健康">健康</SelectItem>
            <SelectItem value="休閒">休閒</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <Select
          value={filter.taskType}
          onValueChange={(value) => onFilterChange({ ...filter, taskType: value })}
        >
          <SelectTrigger className="rounded-lg">
            <SelectValue placeholder="選擇任務類型" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">所有任務類型</SelectItem>
            <SelectItem value="general">一般任務</SelectItem>
            <SelectItem value="background">背景任務</SelectItem>
            <SelectItem value="light">輕型任務</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <Select
          value={filter.status}
          onValueChange={(value) => onFilterChange({ ...filter, status: value })}
        >
          <SelectTrigger className="rounded-lg">
            <SelectValue placeholder="選擇狀態" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">所有狀態</SelectItem>
            <SelectItem value="pending">未開始</SelectItem>
            <SelectItem value="in_progress">進行中</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};