"use client";
import { defaultChartOptions } from "@/constants/chartOptions";
import { createChart, IChartApi } from "lightweight-charts";
import React, {
  PropsWithChildren,
  useEffect,
  useRef,
  createContext,
  useState,
} from "react";

interface TChartProps {
  className: string;
}

export const ChartContext = createContext<{ chart?: IChartApi }>({});

const TChart: React.FC<PropsWithChildren<TChartProps>> = ({
  children,
  className,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi>();

  useEffect(() => {
    if (!container.current) return;
    setChart(createChart(container.current, defaultChartOptions));
  }, []);

  return (
    <div className={className} ref={container}>
      <ChartContext.Provider value={{ chart }}>
        {children}
      </ChartContext.Provider>
    </div>
  );
};

export default TChart;
