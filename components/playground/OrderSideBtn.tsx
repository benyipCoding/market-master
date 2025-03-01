import React, { useMemo } from "react";
import { OrderSide } from "../interfaces/CandlestickSeries";
import { cn } from "@/lib/utils";

interface OrderSideBtnProps {
  currentSide: OrderSide;
  setCurrentSide: React.Dispatch<React.SetStateAction<OrderSide>>;
  currentPrice: number | undefined;
  className: string;
}

const OrderSideBtn: React.FC<OrderSideBtnProps> = ({
  currentSide,
  setCurrentSide,
  currentPrice,
  className,
}) => {
  return (
    <div className="h-16 px-2">
      <div className="h-full flex rounded-xl overflow-hidden">
        <div
          className={cn(
            className,
            currentSide === OrderSide.SELL &&
              "text-white bg-red-600 hover:text-white"
          )}
          onClick={() => setCurrentSide(OrderSide.SELL)}
        >
          <p className="text-base">Sell</p>
          <p>{currentPrice}</p>
        </div>
        <div
          className={cn(
            className,
            currentSide === OrderSide.BUY &&
              "text-white bg-primary hover:text-white"
          )}
          onClick={() => setCurrentSide(OrderSide.BUY)}
        >
          <p className="text-base">Buy</p>
          <p>{currentPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSideBtn;
