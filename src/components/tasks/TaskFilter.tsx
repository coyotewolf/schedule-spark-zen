import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskFilterProps {
  filter: {
    category: string;
    status: string;
  };
  onFilterChange: (filter: { category: string; status: string }) => void;
}

export const TaskFilter = ({ filter, onFilterChange }: TaskFilterProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <Select
          value={filter.category}
          onValueChange={(value) => onFilterChange({ ...filter, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇分類" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有分類</SelectItem>
            <SelectItem value="general">一般任務</SelectItem>
            <SelectItem value="background">背景進行</SelectItem>
            <SelectItem value="light">輕型任務</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <Select
          value={filter.status}
          onValueChange={(value) => onFilterChange({ ...filter, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇狀態" />
          </SelectTrigger>
          <SelectContent>
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