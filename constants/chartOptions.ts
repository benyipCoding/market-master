import {
  ChartOptions,
  ColorType,
  CrosshairMode,
  DeepPartial,
  TickMarkType,
  Time,
} from "lightweight-charts";

// default chart options
export const defaultChartOptions: DeepPartial<ChartOptions> = {
  autoSize: true,
  layout: {
    background: { type: ColorType.Solid, color: "transparent" },
    textColor: "white", // 文本颜色
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
      color: "#515151",
    },
    horzLine: {
      labelVisible: true,
      color: "#515151",
      labelBackgroundColor: "#4338ca",
    },
  },
  // priceScale: {
  //   borderColor: "rgba(197, 203, 206, 0.8)", // 价格刻度边框颜色
  // },
  timeScale: {
    borderColor: "rgba(197, 203, 206, 0.8)", // 时间刻度边框颜色
    tickMarkFormatter: (
      time: Time,
      tickMarkType: TickMarkType,
      locale: string
    ) => {
      return time;
    },
  },
};

export const lightModeOptions: DeepPartial<ChartOptions> = {
  layout: {
    // background: { type: ColorType.Solid, color: "white" },
    textColor: "black", // 文本颜色
  },
};

export const darkModeOptions: DeepPartial<ChartOptions> = {
  layout: {
    // background: { type: ColorType.Solid, color: "black" },
    textColor: "white", // 文本颜色
  },
};
