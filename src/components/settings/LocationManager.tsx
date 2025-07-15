import { Button } from "@/components/ui/button";
import { MapPin, Plus, Trash2 } from "lucide-react";

export const LocationManager = () => {
  const locations = ["辦公室", "會議室A", "會議室B", "家"];

  return (
    <div className="space-y-3">
      {locations.map((location) => (
        <div key={location} className="flex items-center justify-between p-2 border border-border rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-body">{location}</span>
          </div>
          <Button variant="ghost" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      
      <Button variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        新增地點
      </Button>
    </div>
  );
};