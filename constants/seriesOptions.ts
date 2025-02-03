import {
  CandlestickSeriesPartialOptions,
  LineSeriesPartialOptions,
  LineStyle,
} from "lightweight-charts";

// default candle stick series options
export const defaultCandleStickOptions: CandlestickSeriesPartialOptions = {
  upColor: "transparent", // 阳线颜色为红色
  downColor: "#00ffff", // 阴线颜色为#00ffff
  borderVisible: true, // 蜡烛图边框可见
  wickVisible: true, // 线可见
  borderUpColor: "#ff0000", // 阳线边框颜色为红色
  borderDownColor: "#00ffff", // 阴线边框颜色为#00ffff
  wickUpColor: "#ff0000", // 阳线线颜色为红色
  wickDownColor: "#00ffff", // 阴线线颜色为#00ffff
  priceLineVisible: false,
};

// default line series options
export const defaultLineOptions: LineSeriesPartialOptions = {
  color: "#ffff00",
  priceLineVisible: false,
  lineWidth: 2,
  pointMarkersVisible: false,
  lastValueVisible: false,
};

export const SeriesColors = [
  {
    label: "white",
    value: "#fff",
  },
  {
    label: "gray",
    value: "#c0c0c0",
  },

  {
    label: "red",
    value: "#ff0000",
  },
  {
    label: "orange",
    value: "#ffa500",
  },
  {
    label: "yellow",
    value: "#ffff00",
  },
  {
    label: "green",
    value: "#00ff00",
  },
  {
    label: "aqua",
    value: "#00ffff",
  },
  {
    label: "blue",
    value: "#3b82f6",
  },
  {
    label: "violet",
    value: "#6d28d9",
  },
  {
    label: "pink",
    value: "#ff00ff",
  },
  {
    label: "brown",
    value: "#993300",
  },
  {
    label: "black",
    value: "#000",
  },
] as const;

export type SeriesColorItem = (typeof SeriesColors)[number];
export type SeriesColorType = SeriesColorItem["value"];

export const LineWidthOptions = [1, 2, 3, 4] as const;

export const LineStyleOptions = ["solid", "dashed", "dotted"];
