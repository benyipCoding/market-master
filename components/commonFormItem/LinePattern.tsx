import { LineWidthOptions, LineStyleOptions } from "@/constants/seriesOptions";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";
import { LinePatternProps } from "../interfaces/CommonFormItem";

const LinePattern: React.FC<LinePatternProps> = ({
  lineWidth,
  lineStyle,
  setLineStyle,
  setLineWidth,
}) => {
  return (
    <div className="form-item">
      <Label htmlFor="lineStyle" className="py-1">
        Line Pattern
      </Label>
      <div className="flex items-center gap-3">
        {/* Line width */}
        <Select
          value={lineWidth}
          onValueChange={(width) => setLineWidth(width)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Line width" />
          </SelectTrigger>
          <SelectContent position="popper">
            {LineWidthOptions.map((width) => (
              <SelectItem value={`${width}`} key={width}>
                <div
                  className="w-36 border-black dark:border-white my-2"
                  style={{ borderTopWidth: `${width}px` }}
                ></div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Line style */}
        <Select
          value={lineStyle}
          onValueChange={(style) => setLineStyle(style)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Line style" />
          </SelectTrigger>
          <SelectContent position="popper">
            {LineStyleOptions.map((borderStyle) => (
              <SelectItem value={`${borderStyle}`} key={borderStyle}>
                <div
                  className="w-36 border-black dark:border-white my-2 border-t-2"
                  style={{ borderStyle }}
                ></div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LinePattern;
