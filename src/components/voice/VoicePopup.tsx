import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Check, X } from "lucide-react";

interface VoicePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoicePopup = ({ isOpen, onClose }: VoicePopupProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [parsedSuggestion, setParsedSuggestion] = useState("");

  const startRecording = () => {
    setIsRecording(true);
    // Trigger: startVoiceRecording
    console.log("Trigger: startVoiceRecording");
    
    // Simulate voice recognition (placeholder)
    setTimeout(() => {
      setVoiceText("明天下午兩點開會討論專案進度");
      setParsedSuggestion("任務：專案進度會議\n時間：明天 14:00\n分類：工作會議");
      setIsRecording(false);
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Trigger: stopVoiceRecording
    console.log("Trigger: stopVoiceRecording");
  };

  const confirmTask = () => {
    // Trigger: confirmVoiceTask
    console.log("Trigger: confirmVoiceTask", { voiceText, parsedSuggestion });
    onClose();
    resetState();
  };

  const resetState = () => {
    setIsRecording(false);
    setVoiceText("");
    setParsedSuggestion("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90%] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-h3 text-center">語音輸入任務</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Voice Recording Button */}
          <div className="flex justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? "bg-destructive hover:bg-destructive/80 animate-pulse" 
                  : "bg-primary hover:bg-primary/80"
              }`}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
          
          {/* Recording Status */}
          <div className="text-center">
            <p className="text-body text-muted-foreground">
              {isRecording ? "正在聆聽..." : "點擊麥克風開始錄音"}
            </p>
          </div>
          
          {/* Voice Text Display */}
          {voiceText && (
            <div className="app-card p-4">
              <h4 className="text-h3 mb-2">語音內容</h4>
              <p className="text-body text-muted-foreground">{voiceText}</p>
            </div>
          )}
          
          {/* Parsed Suggestion */}
          {parsedSuggestion && (
            <div className="app-card p-4">
              <h4 className="text-h3 mb-2">解析建議</h4>
              <pre className="text-body text-muted-foreground whitespace-pre-wrap">
                {parsedSuggestion}
              </pre>
            </div>
          )}
          
          {/* Action Buttons */}
          {parsedSuggestion && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                取消
              </Button>
              <Button
                onClick={confirmTask}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                確認建立
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};