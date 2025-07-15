import { Quote } from "lucide-react";
import { useState, useEffect } from "react";

export const DailyQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyQuote();
  }, []);

  const loadDailyQuote = async () => {
    setLoading(true);
    
    // {{API}} - This will be replaced with actual API call
    // Simulate API call with random motivational quotes
    const quotes = [
      { text: "時間是最珍貴的資源，善用它就是智慧。", author: "富蘭克林" },
      { text: "成功就是把複雜的問題簡單化，然後狠狠去做。", author: "約翰·杜威" },
      { text: "專注於今天，讓明天自然到來。", author: "戴爾·卡內基" },
      { text: "效率不是做更多的事，而是做對的事。", author: "彼得·杜拉克" },
      { text: "時間管理就是生活管理。", author: "史蒂芬·柯維" },
    ];
    
    // Simulate network delay
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote.text);
      setAuthor(randomQuote.author);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="app-card p-4">
        <div className="flex items-center gap-3">
          <Quote className="w-5 h-5 text-primary animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-card p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="flex items-start gap-3">
        <Quote className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
        <div className="space-y-2">
          <p className="text-body font-medium leading-relaxed">
            "{quote}"
          </p>
          <p className="text-caption text-muted-foreground">
            — {author}
          </p>
        </div>
      </div>
    </div>
  );
};