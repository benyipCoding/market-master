import { SeriesColors } from "@/constants/seriesOptions";
import { titleCase } from "@/utils/helpers";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";
import { ColorSelectorProps } from "../interfaces/CommonFormItem";

const ColorSelector: React.FC<ColorSelectorProps> = ({
  seriesColor,
  setSeriesColor,
}) => {
  return (
    <div className="form-item">
      <Label htmlFor="seriesColor" className="py-1">
        Series Color
      </Label>
      <Select
        value={seriesColor}
        onValueChange={(value) => setSeriesColor(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select colors..." />
        </SelectTrigger>
        <SelectContent position="popper">
          {SeriesColors.map((color) => (
            <SelectItem value={color.value} key={color.label}>
              <div className="flex items-center gap-2">
                <i
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: `${color.value}` }}
                ></i>
                {titleCase(color.label)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ColorSelector;
