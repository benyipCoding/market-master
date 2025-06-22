import React, { useContext, useEffect, useState } from "react";
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
import { OperationMode, Order } from "../interfaces/Playground";
import { Checkbox } from "../ui/checkbox";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { CheckedState } from "@radix-ui/react-checkbox";
import { MiddleSection } from "../interfaces/TradingAside";
import Big from "big.js";
import { OrderSide, PriceLineType } from "../interfaces/CandlestickSeries";
import { AuthContext } from "@/context/Auth";

interface OrderActionItemProps {
  id: PriceLineType;
  label: string;
  order: Order | null;
  prop: keyof Order;
  dynamicPrice: number | undefined;
}

const OrderActionItem: React.FC<OrderActionItemProps> = ({
  id,
  label,
  order,
  prop,
  dynamicPrice,
}) => {
  const { currentSymbol, avgAmplitude, currentCandle, operationMode } =
    useSelector((state: RootState) => state.fetchData);

  const [active, setActive] = useState<CheckedState>(false);
  const [displayValue, setDisplayValue] = useState("");
  const [actualValue, setActualValue] = useState(0);
  const [valueType, setValueType] = useState<MiddleSection>(
    MiddleSection.Price
  );
  const { userProfile } = useContext(AuthContext);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setDisplayValue((e.target as HTMLInputElement).value);
  };

  const handleSelect = (value: MiddleSection) => {
    setValueType(value);
  };

  const onActiveChange = (checked: boolean) => {
    setActive(checked);
  };

  useEffect(() => {
    if (!order || !currentCandle || !avgAmplitude) return;
    if (order[prop]) {
      setActualValue(dynamicPrice || Number(order[prop]));
      setActive(true);
      return;
    }

    // 给默认值
    if (!order[prop]) {
      console.log("给默认值");

      const multiple = 3;
      // 当作为止损的情况
      if (prop === "stop_price") {
        // 多单
        if (order.side === OrderSide.BUY) {
          const price = new Big(currentCandle.close)
            .minus(new Big(avgAmplitude).times(multiple))
            .toFixed(currentSymbol?.precision);
          setActualValue(Number(price));
        }
        // 空单
        else {
          const price = new Big(currentCandle.close)
            .add(new Big(avgAmplitude).times(multiple))
            .toFixed(currentSymbol?.precision);
          setActualValue(Number(price));
        }
        // 当作为止盈的情况
      }
      // 当作为止盈的情况
      else if (prop === "limit_price") {
        // 多单
        if (order.side === OrderSide.BUY) {
          const price = new Big(currentCandle.close)
            .add(new Big(avgAmplitude).times(multiple))
            .toFixed(currentSymbol?.precision);
          setActualValue(Number(price));
        }
        // 空单
        else {
          const price = new Big(currentCandle.close)
            .minus(new Big(avgAmplitude).times(multiple))
            .toFixed(currentSymbol?.precision);
          setActualValue(Number(price));
        }
      }
    }
  }, [
    avgAmplitude,
    currentCandle,
    currentSymbol?.precision,
    dynamicPrice,
    order,
    prop,
  ]);

  // 根据actualValue改变displayValue
  useEffect(() => {
    let diff, ticks, usd, percentage;

    switch (valueType) {
      case MiddleSection.Price:
        setDisplayValue(String(actualValue));
        break;

      case MiddleSection.Ticks:
        diff =
          order?.side === OrderSide.BUY
            ? new Big(actualValue).minus(order.opening_price)
            : new Big(order?.opening_price!).minus(actualValue);

        ticks = diff.div(currentSymbol?.price_per_tick!).toFixed(2);
        setDisplayValue(ticks);
        break;

      case MiddleSection.USD:
        diff =
          order?.side === OrderSide.BUY
            ? new Big(actualValue).minus(order.opening_price)
            : new Big(order?.opening_price!).minus(actualValue);

        ticks = diff.div(currentSymbol?.price_per_tick!);
        usd = ticks.times(order?.quantity!).div(100).toFixed(2);
        setDisplayValue(usd);
        break;

      case MiddleSection.Percentage:
        diff =
          order?.side === OrderSide.BUY
            ? new Big(actualValue).minus(order.opening_price)
            : new Big(order?.opening_price!).minus(actualValue);

        ticks = diff.div(currentSymbol?.price_per_tick!);
        usd = ticks.times(order?.quantity!).div(100);
        const balance =
          operationMode === OperationMode.PRACTISE
            ? userProfile?.balance_p
            : userProfile?.balance_b;
        percentage = balance ? usd.div(balance).times(100).toFixed(2) : "0";
        setDisplayValue(percentage);
        break;

      default:
        break;
    }
  }, [
    actualValue,
    currentSymbol?.price_per_tick,
    operationMode,
    order,
    userProfile,
    valueType,
  ]);

  return (
    <div className="form-item">
      <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          id={id}
          className="border-secondary-foreground dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
          checked={active}
          onCheckedChange={onActiveChange}
        />
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <Input
          type="number"
          disabled={!active}
          value={displayValue}
          onInput={handleInput}
        />
        <Select
          disabled={!active}
          value={valueType}
          onValueChange={handleSelect}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {MiddleLabel.map(({ value, label }) => (
              <SelectItem value={value} key={label}>
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
