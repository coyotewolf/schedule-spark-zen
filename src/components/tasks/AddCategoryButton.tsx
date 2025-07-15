import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddCategoryButtonProps {
  onClick?: () => void;
}

export const AddCategoryButton = ({ onClick }: AddCategoryButtonProps) => {
  const handleClick = () => {
    // Trigger: openAddCategoryDialog
    console.log("Trigger: openAddCategoryDialog");
    onClick?.();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="flex items-center gap-2 text-sm"
    >
      <Plus className="w-4 h-4" />
      新增類別
    </Button>
  );
};