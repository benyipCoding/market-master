import { SidebarNavItemType } from "@/components/interfaces/TechnicalIndexForm";
import { LineChart, BarChartBig } from "lucide-react";

export const SidebarNavItems: SidebarNavItemType[] = [
  {
    title: "MA",
    subTitle: "Moving average",
    icon: LineChart,
  },
  {
    title: "EMA",
    subTitle: "Exponential Moving Average",
    icon: LineChart,
  },
  {
    title: "MACD",
    subTitle: "Moving Average Convergence/Divergence",
    icon: BarChartBig,
  },
];
