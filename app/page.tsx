import CandlestickSeries from "@/components/CandlestickSeries";
import TChart from "@/components/TChart";

import React from "react";

const Home = () => {
  return (
    <div className="h-full flex">
      <TChart className="w-[800px] h-[600px] m-auto">
        <CandlestickSeries />
      </TChart>
    </div>
  );
};

export default Home;
