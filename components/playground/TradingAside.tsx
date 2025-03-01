import { RootState } from "@/store";
import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { OrderSide, OrderType } from "../interfaces/CandlestickSeries";
import { TitleCase } from "@/utils/helpers";
import OrderSideBtn from "./OrderSideBtn";
import { Input } from "../ui/input";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import MiniCalculator from "./MiniCalculator";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import LossAndProfit from "./LossAndProfit";

interface TradingAsideProps {
  currentPrice: number | undefined;
}

const TradingAside: React.FC<TradingAsideProps> = ({ currentPrice }) => {
  const { currentSymbol } = useSelector((state: RootState) => state.fetchData);
  const [currentSide, setCurrentSide] = useState<OrderSide>(OrderSide.SELL);
  const [currentOrderType, setCurrentOrderType] = useState<OrderType>(
    OrderType.MARKET
  );
  const [showCalculator, setShowCalculator] = useState(false);
  const unintInputRef = useRef<HTMLInputElement>(null);
  const [unitValue, setUnitValue] = useState<string>("");

  const onClickCalculator = () => {
    unintInputRef.current?.focus();
    setShowCalculator((prev) => !prev);
  };

  const filterInput = (e: React.FormEvent<HTMLInputElement>) => {
    const isNum = !isNaN(Number((e.nativeEvent as any).data));
    if (!isNum) return;
    const value = String(Number((e.target as HTMLInputElement).value));
    setUnitValue(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="">{currentSymbol?.label}, trading panel</h2>
      {/* Market or Limit */}
      <Tabs
        defaultValue={OrderType.MARKET}
        className="flex flex-col gap-4"
        onValueChange={(value) => setCurrentOrderType(value as OrderType)}
      >
        <TabsList className="w-full flex">
          <TabsTrigger value={OrderType.MARKET} className="flex-1">
            {TitleCase(OrderType.MARKET)}
          </TabsTrigger>
          <TabsTrigger value={OrderType.LIMIT} className="flex-1">
            {TitleCase(OrderType.LIMIT)}
          </TabsTrigger>
        </TabsList>

        <div className="border-b-[1px]"></div>
      </Tabs>

      {/* Order side button */}
      <OrderSideBtn
        className={
          "flex-1 bg-secondary px-3 py-1 hover:text-[#c9c9c8] text-lg text-gray-400 transition-all duration-300 cursor-pointer flex-col justify-between"
        }
        currentSide={currentSide}
        setCurrentSide={setCurrentSide}
        currentPrice={currentPrice}
      />

      {/* Units */}
      <div className="relative">
        <p className="text-secondary-foreground mb-2">Units</p>
        <Input
          className="h-9 select-text"
          ref={unintInputRef}
          value={unitValue}
          onInput={filterInput}
        />
        <Calculator
          className="w-7 h-7 absolute bottom-1 right-1 z-20 cursor-pointer bg-background"
          onClick={onClickCalculator}
        />
        <MiniCalculator
          showCalculator={showCalculator}
          setShowCalculator={setShowCalculator}
          element={unintInputRef.current}
          setUnitValue={setUnitValue}
        />
      </div>

      <div className="border-b-[1px] mt-2"></div>

      {/* Stop Loss & Take Profit */}
      <LossAndProfit />
    </div>
  );
};

export default TradingAside;
