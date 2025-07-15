import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const DefaultTransportSelector = () => {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-body font-medium mb-2">預設交通方式</p>
        <Select defaultValue="walking">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="walking">🚶 步行</SelectItem>
            <SelectItem value="car">🚗 開車</SelectItem>
            <SelectItem value="transit">🚌 大眾運輸</SelectItem>
            <SelectItem value="bike">🚲 腳踏車</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};