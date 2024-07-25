import { LineWidthOptions, LineStyleOptions } from "@/constants/seriesOptions";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Input } from "../ui/input";
import { titleCase } from "@/utils/helpers";
import { cn } from "@/lib/utils";

interface PeriodItemProps {
  period: string;
  setPeriod: (value: string) => void;
  calculatePrice: string;
  setCalculatePrice: (value: string) => void;
}

export interface PeriodItemRef {
  validate: (value: string) => void;
}

const CalculatePrices = ["open", "close"] as const;
export type CalculatePriceType = (typeof CalculatePrices)[number];

const PeriodItem: React.ForwardRefRenderFunction<
  PeriodItemRef,
  PeriodItemProps
> = ({ period, setPeriod, calculatePrice, setCalculatePrice }, ref) => {
  const [errorMessage, setErrorMessage] = useState("");
  const showErrorMessage = useMemo(() => errorMessage !== "", [errorMessage]);

  const validate = (value: string): boolean => {
    if (!value) {
      setErrorMessage("Period is required");
      return false;
    }
    if (!/^\+?[1-9]\d*$/.test(value)) {
      setErrorMessage("Period must be positive integer");
      return false;
    }
    if (+value > 500) {
      setErrorMessage("Out of range");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  useImperativeHandle(ref, () => ({
    validate,
  }));

  return (
    <div className="form-item">
      <Label htmlFor="lineStyle" className="py-1">
        Period
      </Label>
      <div className="flex items-center gap-3 relative">
        {/* Period */}
        <Input
          type="number"
          value={period}
          onChange={(e) => {
            validate(e.target.value);
            setPeriod(e.target.value);
          }}
        />
        <p
          className={cn(
            "absolute left-0 -bottom-5 text-red-500 overflow-hidden text-ellipsis max-w-1/2 px-1 text-sm h-fit opacity-0 transition duration-300",
            showErrorMessage && "opacity-100"
          )}
        >
          {errorMessage}
        </p>

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

export default forwardRef(PeriodItem);
