import React, { useMemo } from "react";
import { OrderSide } from "../interfaces/CandlestickSeries";
import { cn } from "@/lib/utils";

interface OrderSideBtnProps {
  currentSide: OrderSide;
  setCurrentSide: React.Dispatch<React.SetStateAction<OrderSide>>;
  currentPrice: number | undefined;
}

const OrderSideBtn: React.FC<OrderSideBtnProps> = ({
  currentSide,
  setCurrentSide,
  currentPrice,
}) => {
  return (
    <div className="h-16 px-2">
      <div className="h-full flex rounded-xl overflow-hidden">
        <div
          className={cn(
            "flex-1 bg-secondary px-3 py-1 text-lg text-gray-400 transition-all duration-300 cursor-pointer",
            currentSide === OrderSide.SELL && "text-white bg-red-600"
          )}
          onClick={() => setCurrentSide(OrderSide.SELL)}
        >
          <p className="text-base">Sell</p>
          <p>{currentPrice}</p>
        </div>
        <div
          className={cn(
            "flex-1 bg-secondary px-3 py-1 text-lg text-right text-gray-400 transition-all duration-300 cursor-pointer",
            currentSide === OrderSide.BUY && "text-white bg-primary"
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
