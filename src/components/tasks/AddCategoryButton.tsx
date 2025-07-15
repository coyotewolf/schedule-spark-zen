import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddCategoryButtonProps {
  onClick: () => void;
}

export const AddCategoryButton = ({ onClick }: AddCategoryButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-primary/5"
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm font-medium">新增類別</span>
    </Button>
  );
};