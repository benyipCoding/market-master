"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import TChart from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import { CandlestickData, Time } from "lightweight-charts";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };

  useEffect(() => {
    getCandlestickData();
  }, []);

  return (
    <div className="h-full flex">
      <TChart className="w-full h-full">
        <CandlestickSeries seriesData={candlestickData} />
      </TChart>
    </div>
  );
};

export default Home;
