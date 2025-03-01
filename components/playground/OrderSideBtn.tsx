import React, { useMemo } from "react";
import { OrderSide } from "../interfaces/CandlestickSeries";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface OrderSideBtnProps {
  currentSide: OrderSide;
  setCurrentSide: React.Dispatch<React.SetStateAction<OrderSide>>;

  className: string;
}

const OrderSideBtn: React.FC<OrderSideBtnProps> = ({
  currentSide,
  setCurrentSide,

  className,
}) => {
  const { currentCandle } = useSelector((state: RootState) => state.fetchData);

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
          <p>{currentCandle?.close}</p>
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
          <p>{currentCandle?.close}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSideBtn;
