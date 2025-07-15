import { useState } from "react";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { LocationManager } from "@/components/settings/LocationManager";
import { DefaultTransportSelector } from "@/components/settings/DefaultTransportSelector";
import { AccountSection } from "@/components/settings/AccountSection";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw, User, MapPin, Car } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const SettingsPage = () => {
  const resetOnboarding = () => {
    // Trigger: openOnboardingWizard
    console.log("Trigger: openOnboardingWizard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-h2 font-semibold">設定</h1>
              <p className="text-caption text-muted-foreground">
                個人化你的時間管理體驗
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 pb-24 space-y-6">
        {/* Theme Settings */}
        <section className="app-card p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-h3 font-semibold">外觀設定</h2>
              <p className="text-caption text-muted-foreground">調整主題與顯示偏好</p>
            </div>
          </div>
          
          <ThemeSwitcher />
        </section>

        <Separator />

        {/* Onboarding Reset */}
        <section className="app-card p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h2 className="text-h3 font-semibold">重新設定</h2>
              <p className="text-caption text-muted-foreground">重新執行偏好問卷</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={resetOnboarding}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新設定偏好
          </Button>
        </section>

        <Separator />

        {/* Location Management */}
        <section className="app-card p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-success" />
            </div>
            <div>
              <h2 className="text-h3 font-semibold">常用地點</h2>
              <p className="text-caption text-muted-foreground">管理你的常用地點與位置</p>
            </div>
          </div>
          
          <LocationManager />
        </section>

        <Separator />

        {/* Transport Settings */}
        <section className="app-card p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
              <Car className="w-4 h-4 text-warning" />
            </div>
            <div>
              <h2 className="text-h3 font-semibold">交通方式</h2>
              <p className="text-caption text-muted-foreground">設定預設交通工具</p>
            </div>
          </div>
          
          <DefaultTransportSelector />
        </section>

        <Separator />

        {/* Account Section */}
        <section className="app-card p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-h3 font-semibold">帳號管理</h2>
              <p className="text-caption text-muted-foreground">管理帳號與同步設定</p>
            </div>
          </div>
          
          <AccountSection />
        </section>
      </div>
    </div>
  );
};