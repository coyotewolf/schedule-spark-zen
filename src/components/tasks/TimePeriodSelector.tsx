import { Button } from "@/components/ui/button";

interface TimePeriodSelectorProps {
  currentPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const TimePeriodSelector = ({ currentPeriod, onPeriodChange }: TimePeriodSelectorProps) => {
  const periods = ["日", "週", "月", "年", "自訂"];

  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <Button
          key={period}
          variant={currentPeriod === period ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(period)}
          className="min-w-[60px]"
        >
          {period}
        </Button>
      ))}
    </div>
  );
};