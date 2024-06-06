import {
  ChartOptions,
  ColorType,
  CrosshairMode,
  DeepPartial,
  Time,
} from "lightweight-charts";

// default chart options
export const defaultChartOptions: DeepPartial<ChartOptions> = {
  autoSize: true,
  layout: {
    background: { type: ColorType.Solid, color: "#1e1e1e" },
    textColor: "rgba(255, 255, 255, 0.9)", // 文本颜色
  },
  grid: {
    vertLines: {
      visible: true,
      color: "rgba(197, 203, 206, 0.2)", // 竖直网格线颜色
    },
    horzLines: {
      visible: true,
      color: "rgba(197, 203, 206, 0.2)", // 水平网格线颜色
    },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: {
      labelVisible: true,
    },
  },
  // priceScale: {
  //   borderColor: 'rgba(197, 203, 206, 0.8)', // 价格刻度边框颜色
  // },
  timeScale: {
    borderColor: "rgba(197, 203, 206, 0.8)", // 时间刻度边框颜色
    tickMarkFormatter: (
      time: Time
      // tickMarkType: TickMarkType,
      // locale: string
    ) => {
      return time;
    },
  },
};
