import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MiddleLabel } from "@/constants/tradingAside";
import { Order } from "../interfaces/Playground";
import { Checkbox } from "../ui/checkbox";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { CheckedState } from "@radix-ui/react-checkbox";
import { MiddleSection } from "../interfaces/TradingAside";
import Big from "big.js";
import { OrderSide } from "../interfaces/CandlestickSeries";

interface OrderActionItemProps {
  id: string;
  label: string;
  order: Order | null;
  prop: keyof Order;
}

const OrderActionItem: React.FC<OrderActionItemProps> = ({
  id,
  label,
  order,
  prop,
}) => {
  const { currentSymbol, avgAmplitude, currentCandle } = useSelector(
    (state: RootState) => state.fetchData
  );
  const [active, setActive] = useState<CheckedState>(false);
  const [inputValue, setInputValue] = useState("");
  const [valueType, setValueType] = useState<MiddleSection>(
    MiddleSection.Price
  );

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setInputValue((e.target as HTMLInputElement).value);
  };

  useEffect(() => {
    if (!order || !currentCandle || !avgAmplitude) return;
    if (order[prop]) {
      setActive(true);
      setInputValue(`${order[prop]}`);
      return;
    }

    // 给默认值
    if (!active) {
      // 当作为止损的情况
      if (prop === "stop_price") {
        // 多单
        if (order.side === OrderSide.BUY) {
          const price = new Big(currentCandle.close)
            .minus(avgAmplitude)
            .toFixed(currentSymbol?.precision);
          setInputValue(price);
        }
        // 空单
        else {
          const price = new Big(currentCandle.close)
            .add(avgAmplitude)
            .toFixed(currentSymbol?.precision);
          setInputValue(price);
        }
        // 当作为止盈的情况
      }
      // 当作为止盈的情况
      else if (prop === "limit_price") {
        // 多单
        if (order.side === OrderSide.BUY) {
          const price = new Big(currentCandle.close)
            .add(avgAmplitude)
            .toFixed(currentSymbol?.precision);
          setInputValue(price);
        }
        // 空单
        else {
          const price = new Big(currentCandle.close)
            .minus(avgAmplitude)
            .toFixed(currentSymbol?.precision);
          setInputValue(price);
        }
      }
    }
  }, [
    active,
    avgAmplitude,
    currentCandle,
    currentSymbol?.precision,
    order,
    prop,
  ]);

  return (
    <div className="form-item">
      <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          id={id}
          className="border-secondary-foreground dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
          checked={active}
          onCheckedChange={(checked) => setActive(checked)}
        />
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <Input
          type="number"
          disabled={!active}
          value={inputValue}
          onInput={handleInput}
        />
        <Select
          disabled={!active}
          value={valueType}
          onValueChange={(value) => setValueType(value as MiddleSection)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {MiddleLabel.map(({ value, label }) => (
              <SelectItem value={`${value}`} key={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrderActionItem;
