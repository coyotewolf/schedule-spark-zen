import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskListView } from "@/components/tasks/TaskListView";
import { PriorityQuadrantView } from "@/components/tasks/PriorityQuadrantView";
import { TimePeriodSelector } from "@/components/tasks/TimePeriodSelector";
import { AddCategoryDialog } from "@/components/tasks/AddCategoryDialog";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";
import { AddCategoryButton } from "@/components/tasks/AddCategoryButton";
import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TasksPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [timePeriod, setTimePeriod] = useState("日");

  const addNewTask = () => {
    // Trigger: addTask
    console.log("Trigger: addTask");
  };

  const handlePeriodChange = (period: string) => {
    setTimePeriod(period);
    // Trigger: onPeriodChange
    console.log("Trigger: onPeriodChange", period);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-h2 font-semibold">任務管理</h1>
            <p className="text-caption text-muted-foreground">
              管理與整理你的任務清單
            </p>
          </div>
          
          <div className="flex gap-2">
            <AddCategoryButton />
            <AddTaskDialog />
          </div>
        </div>
      </header>

      {/* Time Period Selector */}
      <div className="p-4 border-b border-border">
        <TimePeriodSelector 
          currentPeriod={timePeriod}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {/* Main Content */}
      <div className="p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">任務清單</TabsTrigger>
            <TabsTrigger value="quadrant">四象限</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <TaskListView timePeriod={timePeriod} />
          </TabsContent>
          
          <TabsContent value="quadrant" className="mt-6">
            <PriorityQuadrantView timePeriod={timePeriod} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};