import { Button } from "@/components/ui/button";
import { User, LogOut, Download } from "lucide-react";

export const AccountSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-body font-medium">訪客用戶</p>
          <p className="text-caption text-muted-foreground">未登入狀態</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          匯出資料
        </Button>
        <Button variant="outline" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          登入/註冊
        </Button>
      </div>
    </div>
  );
};