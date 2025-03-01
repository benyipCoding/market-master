import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { OrderSide } from "../interfaces/CandlestickSeries";

enum MiddleSection {
  Ticks = "ticks",
  Price = "price",
  USD = "usd",
  Percentage = "%",
}

const MiddleLabel = [
  {
    label: "Ticks",
    value: MiddleSection.Ticks,
  },
  {
    label: "Price",
    value: MiddleSection.Price,
  },
  {
    label: "USD",
    value: MiddleSection.USD,
  },
  {
    label: "%",
    value: MiddleSection.Percentage,
  },
];

const ControlItem: React.FC<{
  index: number;
  checked: boolean;
  onClickItem: () => void;
  currentSection?: MiddleSection;
  section: MiddleSection;
}> = ({ index, checked, onClickItem, currentSection, section }) => {
  const isFirst = index === 0;
  const isLast = index === MiddleLabel.length - 1;
  const [inputValue, setInputValue] = useState("123");

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

const BracketControl: React.FC<{ title: string }> = ({ title }) => {
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
      <div
        className={cn(
          "text-sm mt-3 border-pink-300 rounded-lg overflow-hidden"
        )}
      >
        {MiddleLabel.map((item, index) => (
          <ControlItem
            key={item.value}
            index={index}
            checked={checked}
            onClickItem={() => focusSection(item.value)}
            currentSection={currentSection}
            section={item.value}
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

interface LossAndProfitProps {
  currentSide: OrderSide;
}

const LossAndProfit: React.FC<LossAndProfitProps> = ({ currentSide }) => {
  const { currentSymbol, currentCandle } = useSelector(
    (state: RootState) => state.fetchData
  );

  useEffect(() => {
    if (!currentCandle?.close || !currentSymbol) return;
    if (currentSide === OrderSide.BUY) {
      // 做多时候
      console.log("市价:", currentCandle?.close);
      console.log(
        "止损价：",
        currentCandle.close - 10 * currentSymbol.price_per_tick!
      );
    }

    if (currentSide === OrderSide.SELL) {
      // 做空时候
    }
  }, [currentCandle?.close, currentSide, currentSymbol?.basic_point_place]);

  return (
    <div className="flex">
      {/* Stop Loss */}
      <BracketControl title="Stop Loss" />

      {/* Middle */}
      <Middle />

      {/* Take Profit */}
      <BracketControl title="Take Profit" />
    </div>
  );
};

export default LossAndProfit;
