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
  borderUpColor: "red", // 阳线边框颜色为红色
  borderDownColor: "#00ffff", // 阴线边框颜色为#00ffff
  wickUpColor: "red", // 阳线线颜色为红色
  wickDownColor: "#00ffff", // 阴线线颜色为#00ffff
  priceLineVisible: false,
};

// default line series options
export const defaultLineOptions: LineSeriesPartialOptions = {
  color: "yellow",
  priceLineVisible: false,
  lineWidth: 2,
  pointMarkersVisible: false,
};

export const selectedLineOptions: LineSeriesPartialOptions = {
  lineWidth: 4,
  pointMarkersVisible: true,
};

export const hoveringLineOptions: LineSeriesPartialOptions = {
  lineWidth: 3,
  pointMarkersVisible: true,
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
    value: "#dc2626",
  },
  {
    label: "orange",
    value: "#ea580c",
  },
  {
    label: "yellow",
    value: "#facc15",
  },
  {
    label: "green",
    value: "#22c55e",
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
];

export const LineWidthOptions = [1, 2, 3, 4];

export const LineStyleOptions = ["solid", "dashed", "dotted"];
