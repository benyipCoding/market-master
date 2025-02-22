import { RootState } from "@/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { OrderSide, OrderType } from "../interfaces/CandlestickSeries";
import { TitleCase } from "@/utils/helpers";
import OrderSideBtn from "./OrderSideBtn";
import { WhitespaceData, Time } from "lightweight-charts";

interface TradingAsideProps {
  currentPrice: number | undefined;
}

const TradingAside: React.FC<TradingAsideProps> = ({ currentPrice }) => {
  const { currentSymbol } = useSelector((state: RootState) => state.fetchData);
  const [currentSide, setCurrentSide] = useState<OrderSide>(OrderSide.SELL);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="">{currentSymbol?.label}, trading panel</h2>
      <Tabs defaultValue={OrderType.MARKET} className="flex flex-col gap-4">
        <TabsList className="w-full flex">
          <TabsTrigger value={OrderType.MARKET} className="flex-1">
            {TitleCase(OrderType.MARKET)}
          </TabsTrigger>
          <TabsTrigger value={OrderType.LIMIT} className="flex-1">
            {TitleCase(OrderType.LIMIT)}
          </TabsTrigger>
        </TabsList>

        <div className="border"></div>

        <TabsContent value={OrderType.MARKET}>
          <OrderSideBtn
            currentSide={currentSide}
            setCurrentSide={setCurrentSide}
            currentPrice={currentPrice}
          />
        </TabsContent>
        <TabsContent value={OrderType.LIMIT}>
          <OrderSideBtn
            currentSide={currentSide}
            setCurrentSide={setCurrentSide}
            currentPrice={currentPrice}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingAside;
