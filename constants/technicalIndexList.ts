import { LineChart, BarChartBig } from "lucide-react";

export const TechnicalIndexList = [
  // {
  //   title: "MA",
  //   subTitle: "Moving average",
  //   icon: LineChart,
  // },
  {
    title: "EMA",
    subTitle: "Exponential Moving Average",
    icon: LineChart,
  },
  // {
  //   title: "MACD",
  //   subTitle: "Moving Average Convergence/Divergence",
  //   icon: BarChartBig,
  // },
] as const;

export type TechnicalIndexItemType = (typeof TechnicalIndexList)[number];
export type TechnicalIndexItemTitleType = TechnicalIndexItemType["title"];
