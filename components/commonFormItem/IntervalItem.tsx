import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { interval } from "date-fns";
import { cn } from "@/lib/utils";

interface IntervalItemProps {
  interval: string;
  changeInterval: (value: string) => void;
  customInterval: string;
  customInputChange: (value: string) => void;
  errorMessage: string;
}

const IntervalItem: React.FC<IntervalItemProps> = ({
  interval,
  changeInterval,
  errorMessage,
  customInputChange,
  customInterval,
}) => {
  return (
    <div className="form-item">
      <Label
        htmlFor="lineStyle"
        className={cn("py-1", errorMessage && "text-destructive")}
      >
        Interval
      </Label>
      <div className="flex items-center gap-3 relative">
        <Select onValueChange={changeInterval} defaultValue={interval}>
          <SelectTrigger>
            <SelectValue placeholder="Select a interval..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m1">m1</SelectItem>
            <SelectItem value="m5">m5</SelectItem>
            <SelectItem value="m15">m15</SelectItem>
            <SelectItem value="m20">m20</SelectItem>
            <SelectItem value="m30">m30</SelectItem>
            <SelectItem value="H1">H1</SelectItem>
            <SelectItem value="H2">H2</SelectItem>
            <SelectItem value="H3">H3</SelectItem>
            <SelectItem value="H4">H4</SelectItem>
            <SelectItem value="H6">H6</SelectItem>
            <SelectItem value="H8">H8</SelectItem>
            <SelectItem value="H12">H12</SelectItem>
            <SelectItem value="D1">D1</SelectItem>
            <SelectItem value="W1">W1</SelectItem>
            <SelectItem value="M1">M1</SelectItem>
            <SelectItem value="custom">Custom interval...</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Custom interval..."
          disabled={interval !== "custom"}
          value={customInterval}
          onChange={(e) => customInputChange(e.target.value)}
        />
      </div>
      {errorMessage && (
        <p className="text-sm font-medium text-destructive select-none">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default IntervalItem;
