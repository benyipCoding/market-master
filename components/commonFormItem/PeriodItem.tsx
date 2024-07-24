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
import { Input } from "../ui/input";
import { titleCase } from "@/utils/helpers";

interface PeriodItemProps {
  period: string;
  setPeriod: (value: string) => void;
  calculatePrice: string;
  setCalculatePrice: (value: string) => void;
}

const CalculatePrices = ["open", "close"] as const;
export type CalculatePriceType = (typeof CalculatePrices)[number];

const PeriodItem: React.FC<PeriodItemProps> = ({
  period,
  setPeriod,
  calculatePrice,
  setCalculatePrice,
}) => {
  return (
    <div className="form-item">
      <Label htmlFor="lineStyle" className="py-1">
        Period
      </Label>
      <div className="flex items-center gap-3">
        {/* Period */}
        <Input
          type="number"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />
        {/* Calculate price */}
        <Select
          value={calculatePrice}
          onValueChange={(value) => setCalculatePrice(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Calculate price" />
          </SelectTrigger>
          <SelectContent position="popper">
            {CalculatePrices.map((price) => (
              <SelectItem value={price} key={price}>
                {titleCase(price)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PeriodItem;
