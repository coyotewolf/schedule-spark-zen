import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCategoryDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AddCategoryDialog = ({ open, onOpenChange }: AddCategoryDialogProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#5A8BFF");

  const predefinedColors = [
    "#5A8BFF", // Primary
    "#FFB86B", // Secondary  
    "#3DC97F", // Success
    "#E65A5A", // Error
    "#9B59B6", // Purple
    "#F39C12", // Orange
    "#1ABC9C", // Teal
    "#E74C3C", // Red
  ];

  const updateCategoryList = () => {
    // Trigger: updateCategoryList
    console.log("Trigger: updateCategoryList", { categoryName, selectedColor });
    setDialogOpen(false);
    setCategoryName("");
    setSelectedColor("#5A8BFF");
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCategoryName("");
    setSelectedColor("#5A8BFF");
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!open && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>新增類別</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Category Name Input */}
          <div className="space-y-2">
            <Label htmlFor="categoryName">類別名稱</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="輸入類別名稱"
              className="w-full"
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>類別顏色</Label>
            <div className="grid grid-cols-4 gap-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-12 h-12 rounded-lg border-2 transition-all duration-200
                    ${selectedColor === color 
                      ? 'border-foreground scale-110' 
                      : 'border-border hover:border-foreground/50 hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
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
              onClick={updateCategoryList}
              disabled={!categoryName.trim()}
              className="flex-1"
            >
              確認
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};