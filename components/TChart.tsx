"use client";
import { defaultChartOptions } from "@/constants/chartOptions";
import clsx from "clsx";
import { createChart, IChartApi } from "lightweight-charts";
import React, {
  PropsWithChildren,
  useEffect,
  useRef,
  createContext,
} from "react";

interface TChartProps {
  className: string;
  chart: IChartApi | undefined;
  setChart: React.Dispatch<React.SetStateAction<IChartApi | undefined>>;
  onChartMouseDown: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    dom: HTMLDivElement | null
  ) => void;
}

export const ChartContext = createContext<{ chart?: IChartApi }>({});

const TChart: React.FC<PropsWithChildren<TChartProps>> = ({
  children,
  className,
  chart,
  setChart,
  onChartMouseDown,
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    setChart(createChart(container.current, defaultChartOptions));
  }, []);

  return (
    <div
      className={clsx("relative", className)}
      ref={container}
      onMouseDown={(e) => onChartMouseDown(e, container.current)}
    >
      <ChartContext.Provider value={{ chart }}>
        {children}
      </ChartContext.Provider>
    </div>
  );
};

export default TChart;
