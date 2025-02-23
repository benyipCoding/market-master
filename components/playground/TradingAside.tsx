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

  const onClickCalculator = () => {
    unintInputRef.current?.focus();
    setShowCalculator((prev) => !prev);
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

        <div className="border"></div>
      </Tabs>

      {/* Order side button */}
      <OrderSideBtn
        currentSide={currentSide}
        setCurrentSide={setCurrentSide}
        currentPrice={currentPrice}
      />

      {/* Units */}
      <div className="relative">
        <p className="text-secondary-foreground mb-2">Units</p>
        <Input
          type={"number"}
          className="h-9 select-text"
          ref={unintInputRef}
        />
        <Calculator
          className="w-7 h-7 absolute bottom-1 right-1 z-20 cursor-pointer bg-background"
          onClick={onClickCalculator}
        />
        <MiniCalculator
          showCalculator={showCalculator}
          setShowCalculator={setShowCalculator}
        />
      </div>
    </div>
  );
};

export default TradingAside;
