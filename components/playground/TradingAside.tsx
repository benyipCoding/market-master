import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { OrderType } from "../interfaces/CandlestickSeries";
import { TitleCase } from "@/utils/helpers";

const TradingAside = () => {
  const { currentSymbol } = useSelector((state: RootState) => state.fetchData);

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
          Make changes to your account here.
        </TabsContent>
        <TabsContent value={OrderType.LIMIT}>
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingAside;
