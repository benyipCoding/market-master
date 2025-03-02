import React, { useEffect, useMemo, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { OrderType } from "../interfaces/CandlestickSeries";
import {
  MiddleSection,
  LossAndProfitDataType,
  LossAndProfitProps,
} from "../interfaces/TradingAside";
import { MiddleLabel } from "@/constants/tradingAside";

const ControlItem: React.FC<{
  index: number;
  checked: boolean;
  onClickItem: () => void;
  currentSection?: MiddleSection;
  section: MiddleSection;
  data: string | number;
}> = ({ index, checked, onClickItem, currentSection, section, data }) => {
  const isFirst = index === 0;
  const isLast = index === MiddleLabel.length - 1;
  const [inputValue, setInputValue] = useState(data);

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
        value={inputValue}
        onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
      />
    </div>
  );
};

const BracketControl: React.FC<{
  title: string;
  sectionData: LossAndProfitDataType;
}> = ({ title, sectionData }) => {
  const [checked, setChecked] = useState(false);
  const [currentSection, setCurrentSection] = useState<MiddleSection>();

  const focusSection = (value: MiddleSection) => {
    setCurrentSection(value);
    setChecked(true);
  };

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
        {MiddleLabel.map((item, index) => (
          <ControlItem
            key={item.value}
            index={index}
            checked={checked}
            onClickItem={() => focusSection(item.value)}
            currentSection={currentSection}
            section={item.value}
            data={sectionData[item.value]}
          />
        ))}
      </div>
    </div>
  );
};

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

const LossAndProfit: React.FC<LossAndProfitProps> = ({
  currentSide,
  currentOrderType,
  preOrderPrice,
}) => {
  const { currentSymbol, currentCandle } = useSelector(
    (state: RootState) => state.fetchData
  );

  const orderPrice = useMemo(() => {
    if (currentOrderType === OrderType.MARKET) return currentCandle?.close;
    else return preOrderPrice;
  }, [currentCandle?.close, currentOrderType, preOrderPrice]);

  const [stopLossData, setStopLossData] = useState<LossAndProfitDataType>({
    [MiddleSection.Price]: "123",
    [MiddleSection.Ticks]: "123",
    [MiddleSection.USD]: "123",
    [MiddleSection.Percentage]: "123",
  });

  const [takeProfitData, setTakeProfitData] = useState<LossAndProfitDataType>({
    [MiddleSection.Price]: "321",
    [MiddleSection.Ticks]: "321",
    [MiddleSection.USD]: "321",
    [MiddleSection.Percentage]: "321",
  });

  useEffect(() => {
    if (!orderPrice) return;
    console.log(orderPrice);
  }, [orderPrice]);

  return (
    <div className="flex">
      {/* Stop Loss */}
      <BracketControl title="Stop Loss" sectionData={stopLossData} />

      {/* Middle */}
      <Middle />

      {/* Take Profit */}
      <BracketControl title="Take Profit" sectionData={takeProfitData} />
    </div>
  );
};

export default LossAndProfit;
