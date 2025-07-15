import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./navigation/BottomNavigation";
import { ThemeProvider } from "./theme/ThemeProvider";
import { VoicePopup } from "./voice/VoicePopup";

export const Layout = () => {
  const [isVoicePopupOpen, setIsVoicePopupOpen] = useState(false);

  const handleVoiceInput = () => {
    setIsVoicePopupOpen(true);
    // Trigger: voiceInput
    console.log("Trigger: voiceInput");
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background theme-transition">
        <main className="pb-20">
          <Outlet />
        </main>
        
        <BottomNavigation onVoiceInput={handleVoiceInput} />
        
        <VoicePopup 
          isOpen={isVoicePopupOpen}
          onClose={() => setIsVoicePopupOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
};