import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  AddPriceLinePayload,
  OrderSide,
  OrderType,
  PriceLineType,
} from "../interfaces/CandlestickSeries";
import {
  MiddleSection,
  LossAndProfitDataType,
  LossAndProfitProps,
} from "../interfaces/TradingAside";
import { MiddleLabel } from "@/constants/tradingAside";
import Big from "big.js";
import { AuthContext } from "@/context/Auth";
import { EmitteryContext, OnPriceLine } from "@/providers/EmitteryProvider";

const ControlItem: React.FC<{
  index: number;
  checked: boolean;
  onClickItem: () => void;
  currentSection?: MiddleSection;
  section: MiddleSection;
  data: string;
  setData: React.Dispatch<React.SetStateAction<Partial<LossAndProfitDataType>>>;
  orderPrice: string | undefined;
  currentSide: OrderSide;
  unitValue: number;
}> = ({
  index,
  checked,
  onClickItem,
  currentSection,
  section,
  data,
  setData,
  orderPrice,
  currentSide,
  unitValue,
}) => {
  const isFirst = index === 0;
  const isLast = index === MiddleLabel.length - 1;
  const [modifying, setModifying] = useState(false);
  const [modifyingValue, setModifyingValue] = useState<string>();
  const { currentSymbol } = useSelector((state: RootState) => state.fetchData);
  const { userProfile } = useContext(AuthContext);

  const calDiffTicks = (diffUsd: any) => {
    return new Big(diffUsd).times(100).div(unitValue);
  };

  const calDiffPrice = (diffTicks: any) => {
    return new Big(diffTicks).times(currentSymbol?.price_per_tick!);
  };

  const calDiffUsd = (percentage: any) => {
    if (!userProfile) return;
    return new Big(percentage).div(100).times(userProfile?.balance_p);
  };

  const calModifiedPrice = (orderPrice: number | string, diffPrice: any) => {
    const price =
      currentSide === OrderSide.BUY
        ? new Big(orderPrice).add(diffPrice).toString()
        : new Big(orderPrice).minus(diffPrice).toString();

    setData({
      [MiddleSection.Price]: price,
      isModify: true,
    });
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!orderPrice) throw new Error("OrderPrice is undefined");

    const value = (e.target as HTMLInputElement).value;
    setModifyingValue(value);
    if (!value) return;
    const numVal = Number(value);
    let diffPrice: any = 0;
    let differTicks: any = 0;
    let differUsd: any = 0;

    switch (section) {
      case MiddleSection.Price:
        setData({
          [MiddleSection.Price]: numVal.toFixed(currentSymbol?.precision),
          isModify: true,
        });
        break;

      case MiddleSection.Ticks:
        diffPrice = calDiffPrice(value);
        calModifiedPrice(orderPrice, diffPrice);
        break;

      case MiddleSection.USD:
        differTicks = calDiffTicks(value);
        diffPrice = calDiffPrice(differTicks);
        calModifiedPrice(orderPrice, diffPrice);
        break;

      case MiddleSection.Percentage:
        differUsd = calDiffUsd(value);
        differTicks = calDiffTicks(differUsd);
        diffPrice = calDiffPrice(differTicks);
        calModifiedPrice(orderPrice, diffPrice);
        break;

      default:
        break;
    }
  };

  const handleFocus = () => {
    setModifying(true);
    setModifyingValue(data);
  };

  const handleBlur = () => {
    switch (section) {
      case MiddleSection.Price:
        setModifyingValue((prev) =>
          Number(prev).toFixed(currentSymbol?.precision)
        );
        break;
      default:
        break;
    }
    setModifying(false);
  };

  return (
    <div
      className={cn(
        "h-8 border-l-2 border-r-2 border-t-2 flex items-center",
        isFirst && "rounded-tl-lg rounded-tr-lg",
        isLast && "rounded-bl-lg rounded-br-lg border-b-2",
        checked &&
          currentSection === section &&
          "dark:border-white border-black",
        checked && currentSection === section && !isLast && "border-b-2"
      )}
      onClick={onClickItem}
    >
      <Input
        className={cn(
          "text-gray-400 border-none max-h-full w-full",
          checked && "text-white"
        )}
        type="number"
        value={modifying ? modifyingValue : data}
        onInput={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

const BracketControl: React.FC<{
  title: string;
  sectionPrice: string;
  orderPrice: string | undefined;
  currentSide: OrderSide;
  unitValue: number;
  setSectionPrice: React.Dispatch<
    React.SetStateAction<Partial<LossAndProfitDataType>>
  >;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  title,
  sectionPrice,
  orderPrice,
  currentSide,
  unitValue,
  setSectionPrice,
  checked,
  setChecked,
}) => {
  const [currentSection, setCurrentSection] = useState<MiddleSection>();
  const { currentSymbol } = useSelector((state: RootState) => state.fetchData);
  const { userProfile } = useContext(AuthContext);

  const displaySectionData = useMemo<LossAndProfitDataType | null>(() => {
    if (!currentSymbol || !sectionPrice || !orderPrice) return null;

    const relativeProfitTicks = new Big(Number(sectionPrice))
      .minus(orderPrice)
      .div(currentSymbol.price_per_tick!)
      .toFixed(2);

    const ticks =
      currentSide === OrderSide.BUY
        ? relativeProfitTicks
        : (Number(relativeProfitTicks) * -1).toFixed(2);

    const usd = new Big(Number(ticks)).times(unitValue).div(100).toFixed(2);
    const percentage = userProfile?.balance_p
      ? new Big(usd).div(userProfile?.balance_p).times(100).toFixed(2)
      : 0;

    return {
      [MiddleSection.Price]: Number(sectionPrice).toFixed(
        currentSymbol.precision
      ),
      [MiddleSection.Ticks]: ticks,
      [MiddleSection.USD]: usd,
      [MiddleSection.Percentage]: percentage,
    };
  }, [
    currentSymbol,
    sectionPrice,
    orderPrice,
    currentSide,
    unitValue,
    userProfile?.balance_p,
  ]);

  const focusSection = (value: MiddleSection) => {
    setCurrentSection(value);
    setChecked(true);
  };

  useEffect(() => {
    if (!checked) {
      setSectionPrice((prev) => ({
        ...prev,
        isModify: false,
      }));
    }
  }, [checked, setSectionPrice]);

  return (
    <div className="flex-1">
      {/* Title */}
      <Label
        htmlFor={title}
        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
      >
        <Checkbox
          id={title}
          className="border-secondary-foreground dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
          onCheckedChange={(state) => setChecked(state as boolean)}
          checked={checked}
        />
        <span className="text-sm">{title}</span>
        <span className="sr-only">{title}</span>
      </Label>

      {/* Controller */}
      <div className={cn("text-sm mt-3 rounded-lg overflow-hidden")}>
        {MiddleLabel.map((item, index) => {
          const data = displaySectionData
            ? String(displaySectionData[item.value])
            : "";

          return (
            <ControlItem
              key={item.value}
              index={index}
              checked={checked}
              onClickItem={() => focusSection(item.value)}
              currentSection={currentSection}
              section={item.value}
              data={data}
              setData={setSectionPrice}
              orderPrice={orderPrice}
              currentSide={currentSide}
              unitValue={unitValue}
            />
          );
        })}
      </div>
    </div>
  );
};

const ticks = 1000;

const Middle = () => {
  return (
    <div className="w-[20%] relative">
      <div className="absolute bottom-0 w-full flex flex-col">
        {MiddleLabel.map((item) => (
          <div
            key={item.value}
            className="h-8 flex items-center justify-center text-xs text-gray-400"
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export interface LossAndProfitRef {
  stopPrice: number;
  limitPrice: number;
  activeStop: boolean;
  activeProfit: boolean;
}

const LossAndProfit: React.ForwardRefRenderFunction<
  LossAndProfitRef,
  LossAndProfitProps
> = ({ currentSide, currentOrderType, preOrderPrice, unitValue }, ref) => {
  const { currentSymbol, currentCandle } = useSelector(
    (state: RootState) => state.fetchData
  );
  const { emittery } = useContext(EmitteryContext);

  const orderPrice = useMemo(() => {
    if (currentOrderType === OrderType.MARKET) return currentCandle?.close;
    else return preOrderPrice;
  }, [currentCandle?.close, currentOrderType, preOrderPrice]);

  const [stopLossData, setStopLossData] = useState<
    Partial<LossAndProfitDataType>
  >({
    [MiddleSection.Price]: "",
    isModify: false,
  });

  const [takeProfitData, setTakeProfitData] = useState<
    Partial<LossAndProfitDataType>
  >({
    [MiddleSection.Price]: "",
    isModify: false,
  });

  const [activeStop, setActiveStop] = useState(false);
  const [activeProfit, setactiveProfit] = useState(false);

  const generatePriceLineId = (price: number, type: PriceLineType) => {
    return `${type}_${price}_${Date.now()}`;
  };

  useEffect(() => {
    if (!orderPrice || !currentSymbol) return;
    const price = new Big(orderPrice);

    if (currentSide === OrderSide.BUY) {
      // 做多
      // 设置止损信息
      !stopLossData.isModify &&
        setStopLossData((prev) => ({
          ...prev,
          [MiddleSection.Price]: price
            .minus(ticks * currentSymbol.price_per_tick!)
            .toFixed(currentSymbol.precision),
        }));

      // 设置止盈信息
      !takeProfitData.isModify &&
        setTakeProfitData((prev) => ({
          ...prev,
          [MiddleSection.Price]: price
            .add(ticks * currentSymbol.price_per_tick!)
            .toFixed(currentSymbol.precision),
        }));
    } else {
      // 做空
      // 设置止损信息
      !stopLossData.isModify &&
        setStopLossData((prev) => ({
          ...prev,
          [MiddleSection.Price]: price
            .add(ticks * currentSymbol.price_per_tick!)
            .toFixed(currentSymbol.precision),
        }));

      // 设置止盈信息
      !takeProfitData.isModify &&
        setTakeProfitData((prev) => ({
          ...prev,
          [MiddleSection.Price]: price
            .minus(ticks * currentSymbol.price_per_tick!)
            .toFixed(currentSymbol.precision),
        }));
    }
  }, [
    orderPrice,
    currentSide,
    currentSymbol,
    stopLossData.isModify,
    takeProfitData.isModify,
  ]);

  // 监听止损的激活情况设置priceLine
  useEffect(() => {
    const price = Number(stopLossData[MiddleSection.Price]);
    const id = generatePriceLineId(price, PriceLineType.StopLoss);

    if (activeStop)
      emittery?.emit(OnPriceLine.add, {
        id,
        price,
        type: PriceLineType.StopLoss,
      } as AddPriceLinePayload);

    return () => {
      if (activeStop) emittery?.emit(OnPriceLine.remove, id);
    };
  }, [activeStop]);

  useEffect(() => {
    const price = Number(takeProfitData[MiddleSection.Price]);
    const id = generatePriceLineId(price, PriceLineType.TakeProfit);
    if (activeProfit)
      emittery?.emit(OnPriceLine.add, {
        id,
        price,
        type: PriceLineType.TakeProfit,
      } as AddPriceLinePayload);

    return () => {
      if (activeProfit) emittery?.emit(OnPriceLine.remove, id);
    };
  }, [activeProfit]);

  useImperativeHandle(ref, () => ({
    stopPrice: Number(stopLossData[MiddleSection.Price]),
    limitPrice: Number(takeProfitData[MiddleSection.Price]),
    activeStop,
    activeProfit,
  }));

  return (
    <div className="flex">
      {/* Stop Loss */}
      <BracketControl
        title="Stop Loss"
        sectionPrice={String(stopLossData[MiddleSection.Price])}
        orderPrice={orderPrice ? String(orderPrice) : undefined}
        currentSide={currentSide}
        unitValue={unitValue}
        setSectionPrice={setStopLossData}
        checked={activeStop}
        setChecked={setActiveStop}
      />

      {/* Middle */}
      <Middle />

      {/* Take Profit */}
      <BracketControl
        title="Take Profit"
        sectionPrice={String(takeProfitData[MiddleSection.Price])}
        orderPrice={orderPrice ? String(orderPrice) : undefined}
        currentSide={currentSide}
        unitValue={unitValue}
        setSectionPrice={setTakeProfitData}
        checked={activeProfit}
        setChecked={setactiveProfit}
      />
    </div>
  );
};

export default forwardRef(LossAndProfit);
