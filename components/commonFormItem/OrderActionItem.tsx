import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
import {
  AddPriceLinePayload,
  OrderSide,
  PriceLineType,
} from "../interfaces/CandlestickSeries";
import { AuthContext } from "@/context/Auth";
import { EmitteryContext, OnPriceLine } from "@/providers/EmitteryProvider";
import { setOpenOrdersPriceLineId } from "@/store/fetchDataSlice";
import { generatePriceLineId } from "@/utils/helpers";

interface OrderActionItemProps {
  id: PriceLineType;
  label: string;
  order: Order | null;
  prop: keyof Order;
  dynamicPrice: number | undefined;
}

export interface OrderActionItemRef {
  active: CheckedState;
  value: number;
}

const OrderActionItem: React.ForwardRefRenderFunction<
  OrderActionItemRef,
  OrderActionItemProps
> = ({ id, label, order, prop, dynamicPrice }, ref) => {
  const {
    currentSymbol,
    avgAmplitude,
    currentCandle,
    operationMode,
    openingOrders,
  } = useSelector((state: RootState) => state.fetchData);
  const { currentOrderId } = useSelector((state: RootState) => state.dialog);

  const [active, setActive] = useState<CheckedState>(false);
  const [displayValue, setDisplayValue] = useState("");
  const [actualValue, setActualValue] = useState(0);
  const [valueType, setValueType] = useState<MiddleSection>(
    MiddleSection.Price
  );
  const { userProfile } = useContext(AuthContext);
  const { emittery } = useContext(EmitteryContext);
  // const dispatch = useDispatch<AppDispatch>();
  const tempPriceLineId = useRef<string>("");

  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setDisplayValue((e.target as HTMLInputElement).value);
  }, []);

  const handleSelect = (value: MiddleSection) => {
    setValueType(value);
  };

  // TODO:根据displayValue改变actualValue
  const displayValueToActualValue = (
    disVal: number,
    valueType: MiddleSection
  ): number | undefined => {
    switch (valueType) {
      case MiddleSection.Price:
        return disVal;
      case MiddleSection.Ticks:
        return disVal;
      case MiddleSection.Percentage:
        return disVal;
      case MiddleSection.USD:
        return disVal;
      default:
        return undefined;
    }
  };
  // TODO: Blur的时候格式化displayValue
  const formatDisValOnBlur = useCallback(
    (value: string, valueType: MiddleSection): string => {
      switch (valueType) {
        case MiddleSection.Price:
          return Number(value).toFixed(currentSymbol?.precision);
        case MiddleSection.Ticks:
          return value;
        case MiddleSection.Percentage:
          return value;
        case MiddleSection.USD:
          return value;
      }
    },
    [currentSymbol]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      if (!currentSymbol) return;
      const disVal = formatDisValOnBlur(e.target.value, valueType);
      setDisplayValue(disVal);
      const actVal = displayValueToActualValue(Number(disVal), valueType);
      if (!actVal) return;
      setActualValue(actVal);
    },
    [currentSymbol, formatDisValOnBlur, valueType]
  );

  const onActiveChange = useCallback(
    (checked: boolean) => {
      setActive(checked);
      const order = openingOrders.find((o) => o.id === currentOrderId);
      if (!order) return;
      const property: keyof Order | undefined =
        prop === "stop_price"
          ? "stop_price_line_id"
          : prop === "limit_price"
          ? "limit_price_line_id"
          : undefined;
      if (!property) return;

      if (checked) {
        // 激活时显示priceLine
        const type =
          prop === "stop_price"
            ? PriceLineType.OpenOrderStopLoss
            : PriceLineType.OpenOrderTakeProfit;

        if (!order[property]) {
          tempPriceLineId.current = generatePriceLineId(actualValue, type);
        }

        const payload: AddPriceLinePayload = {
          id: (order[property] as string) || tempPriceLineId.current,
          price: actualValue,
          type,
          orderId: order.id,
        };
        emittery?.emit(OnPriceLine.add, payload);
      } else {
        // 灭活时隐藏priceLine
        emittery?.emit(
          OnPriceLine.remove,
          order[property] || tempPriceLineId.current
        );
      }
    },
    [openingOrders, prop, currentOrderId, actualValue, emittery]
  );

  useEffect(() => {
    if (!order || !currentCandle || !avgAmplitude) return;

    if (order[prop] || dynamicPrice) {
      setActualValue(dynamicPrice || Number(order[prop]));
      setActive(true);
      return;
    }

    // 给默认值
    if (!order[prop]) {
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

  useImperativeHandle(ref, () => ({
    active,
    value: actualValue,
  }));

  return (
    <div className="form-item">
      <Label
        htmlFor={id}
        className="flex items-center gap-2 cursor-pointer w-fit"
      >
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
          onBlur={handleBlur}
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

export default forwardRef(OrderActionItem);
