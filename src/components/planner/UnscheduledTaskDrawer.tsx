import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UnscheduledTaskChip } from "./UnscheduledTaskChip";
import { Clock, MapPin } from "lucide-react";

interface UnscheduledTaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnscheduledTaskDrawer = ({ isOpen, onClose }: UnscheduledTaskDrawerProps) => {
  // Mock unscheduled tasks {{API}}
  const unscheduledTasks = [
    {
      id: "unscheduled_1",
      title: "準備簡報材料",
      category: "工作",
      estimatedTime: 90,
      location: "辦公室",
      categoryColor: "#5A8BFF"
    },
    {
      id: "unscheduled_2",
      title: "購買日用品",
      category: "個人",
      estimatedTime: 45,
      categoryColor: "#FFB86B"
    },
    {
      id: "unscheduled_3",
      title: "閱讀技術文章",
      category: "學習",
      estimatedTime: 60,
      categoryColor: "#9B59B6"
    },
    {
      id: "unscheduled_4",
      title: "運動健身",
      category: "健康",
      estimatedTime: 60,
      categoryColor: "#3DC97F"
    },
    {
      id: "unscheduled_5",
      title: "整理文件",
      category: "工作",
      estimatedTime: 30,
      categoryColor: "#5A8BFF"
    }
  ];

  const handleDragToSchedule = (taskId: string) => {
    // Trigger: dragToSchedule
    console.log("Trigger: dragToSchedule", taskId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>未排程任務</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
          {unscheduledTasks.map((task) => (
            <UnscheduledTaskChip
              key={task.id}
              id={task.id}
              title={task.title}
              category={task.category}
              estimatedTime={task.estimatedTime}
              categoryColor={task.categoryColor}
              onDragToSchedule={handleDragToSchedule}
            />
          ))}
          
          {unscheduledTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-body mb-2">沒有未排程的任務</p>
              <p className="text-caption">所有任務都已安排完成！</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};