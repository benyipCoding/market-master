import { RootState } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { OrderSide, OrderType } from "../interfaces/CandlestickSeries";
import { TitleCase } from "@/utils/helpers";
import OrderSideBtn from "./OrderSideBtn";
import { Input } from "../ui/input";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import MiniCalculator from "./MiniCalculator";
import LossAndProfit from "./LossAndProfit";
import Big from "big.js";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const TradingAside: React.FC = () => {
  const { currentSymbol } = useSelector((state: RootState) => state.fetchData);
  const [currentSide, setCurrentSide] = useState<OrderSide>(OrderSide.SELL);
  const [currentOrderType, setCurrentOrderType] = useState<OrderType>(
    OrderType.MARKET
  );
  const [showCalculator, setShowCalculator] = useState(false);
  const unintInputRef = useRef<HTMLInputElement>(null);
  const [unitValue, setUnitValue] = useState<string>("100");
  const [preOrderPrice, setPreOrderPrice] = useState<undefined | string>(); // 预选的开仓价
  const { currentCandle } = useSelector((state: RootState) => state.fetchData);
  const onClickCalculator = () => {
    unintInputRef.current?.focus();
    setShowCalculator((prev) => !prev);
  };

  const unitFilterInput = (e: React.FormEvent<HTMLInputElement>) => {
    const isNum = !isNaN(Number((e.nativeEvent as any).data));
    if (!isNum) return;
    const value = String(Number((e.target as HTMLInputElement).value));
    setUnitValue(value);
  };

  const priceFilterInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = (e.target as any).value;
    if (isNaN(value)) return;
    setPreOrderPrice(value);
  };

  const formatPriceValue = () => {
    setPreOrderPrice((prev) => Number(prev).toFixed(currentSymbol?.precision));
  };

  const changePreOrderPrice = (type: "increase" | "decrease") => {
    switch (type) {
      case "increase":
        setPreOrderPrice((prev) =>
          new Big(Number(prev!))
            .add(currentSymbol?.minMove!)
            .toFixed(currentSymbol?.precision)
        );
        break;

      case "decrease":
        setPreOrderPrice((prev) =>
          new Big(Number(prev!))
            .minus(currentSymbol?.minMove!)
            .toFixed(currentSymbol?.precision)
        );
        break;
    }
  };

  useEffect(() => {
    if (currentOrderType === OrderType.LIMIT && !preOrderPrice)
      setPreOrderPrice(String(currentCandle?.close));
  }, [currentOrderType]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="select-none">{currentSymbol?.label}, trading panel</h2>
      {/* Market or Limit */}
      <Tabs
        defaultValue={OrderType.MARKET}
        className="flex flex-col gap-4"
        onValueChange={(value) => setCurrentOrderType(value as OrderType)}
      >
        <TabsList className="w-full flex">
          <TabsTrigger value={OrderType.MARKET} className="flex-1 select-none">
            {TitleCase(OrderType.MARKET)}
          </TabsTrigger>
          <TabsTrigger value={OrderType.LIMIT} className="flex-1 select-none">
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
      />

      {/* Price when limit order */}
      {currentOrderType === OrderType.LIMIT && (
        <div className="relative">
          <p className="text-secondary-foreground mb-2 select-none">Price</p>
          <Input
            className="h-9 select-text"
            value={preOrderPrice}
            onInput={priceFilterInput}
            onBlur={formatPriceValue}
          />
          <div className="w-7 h-8 absolute bottom-[2px] right-1 z-20 flex flex-col gap-[2px]">
            <ChevronUp
              className="cursor-pointer flex-1 rounded-sm hover:bg-secondary transition-all duration-200 active:scale-90"
              onClick={() => changePreOrderPrice("increase")}
            />
            <ChevronDown
              className="cursor-pointer flex-1 rounded-sm hover:bg-secondary transition-all duration-200 active:scale-90"
              onClick={() => changePreOrderPrice("decrease")}
            />
          </div>
        </div>
      )}

      {/* Units */}
      <div className="relative">
        <p className="text-secondary-foreground mb-2 select-none">Units</p>
        <Input
          className="h-9 select-text"
          ref={unintInputRef}
          value={unitValue}
          onInput={unitFilterInput}
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
      <LossAndProfit
        currentSide={currentSide}
        currentOrderType={currentOrderType}
        preOrderPrice={preOrderPrice}
        unitValue={Number(unitValue)}
      />

      <div className="border-b-[1px] mt-2"></div>

      <Button
        className={cn(
          "flex flex-col h-fit py-1 active:scale-100",
          currentSide === OrderSide.BUY && "bg-primary hover:bg-primary",
          currentSide === OrderSide.SELL && "bg-red-600 hover:bg-red-600"
        )}
      >
        <p className="text-lg">{TitleCase(currentSide)}</p>
        <p className="text-xs">
          {unitValue} {currentSymbol?.label} @
          {currentOrderType === OrderType.LIMIT && preOrderPrice}{" "}
          {currentOrderType === OrderType.MARKET ? "MKT" : "LMT"}
        </p>
      </Button>
    </div>
  );
};

export default TradingAside;
