import { Car, ArrowRight } from "lucide-react";

interface TravelGapTagProps {
  fromLocation: string;
  toLocation: string;
  travelTime: number; // minutes
  className?: string;
}

export const TravelGapTag = ({ 
  fromLocation, 
  toLocation, 
  travelTime, 
  className = "" 
}: TravelGapTagProps) => {
  return (
    <div className={`flex items-center gap-2 p-2 bg-warning/10 border border-warning/30 rounded-lg ${className}`}>
      <Car className="w-4 h-4 text-warning" />
      <span className="text-sm text-warning-foreground">
        從 <strong>{fromLocation}</strong>
      </span>
      <ArrowRight className="w-3 h-3 text-warning" />
      <span className="text-sm text-warning-foreground">
        到 <strong>{toLocation}</strong>
      </span>
      <span className="text-sm font-medium text-warning-foreground">
        ({travelTime} 分鐘)
      </span>
    </div>
  );
};