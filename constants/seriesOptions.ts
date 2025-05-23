import {
  CandlestickSeriesPartialOptions,
  LineSeriesPartialOptions,
  LineStyle,
  LineWidth,
  PriceLineOptions,
} from "lightweight-charts";

// default candle stick series options
export const defaultCandleStickOptions: CandlestickSeriesPartialOptions = {
  upColor: "#ff0000", // 阳线颜色为红色
  downColor: "#00ffff", // 阴线颜色为#00ffff
  borderVisible: true, // 蜡烛图边框可见
  wickVisible: true, // 线可见
  borderUpColor: "#ff0000", // 阳线边框颜色为红色
  borderDownColor: "#00ffff", // 阴线边框颜色为#00ffff
  wickUpColor: "#ff0000", // 阳线线颜色为红色
  wickDownColor: "#00ffff", // 阴线线颜色为#00ffff
  priceLineVisible: false,
  // priceLineColor: "gray",
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

export const stopLossPriceLineOptions: Partial<PriceLineOptions> = {
  lineStyle: LineStyle.Dashed,
  color: "#ff6c37",
  lineWidth: 1 as LineWidth,
  axisLabelVisible: true,
  title: "Stop Loss",
  lineVisible: true,
  axisLabelTextColor: "white",
  axisLabelColor: "#ff6c37",
};

export const openOrderStopLoss: Partial<PriceLineOptions> = {
  ...stopLossPriceLineOptions,
  lineStyle: LineStyle.LargeDashed,
};

export const takeProfitPriceLineOptions: Partial<PriceLineOptions> = {
  lineStyle: LineStyle.Dashed,
  color: "#0ccf67",
  lineWidth: 1 as LineWidth,
  axisLabelVisible: true,
  title: "Take Profit",
  lineVisible: true,
  axisLabelTextColor: "white",
  axisLabelColor: "#0ccf67",
};

export const openOrderTakeProfit: Partial<PriceLineOptions> = {
  ...takeProfitPriceLineOptions,
  lineStyle: LineStyle.LargeDashed,
};

export const limitOrderPriceLineOptions: Partial<PriceLineOptions> = {
  lineStyle: LineStyle.Dashed,
  color: "#48a2de",
  lineWidth: 1 as LineWidth,
  axisLabelVisible: true,
  title: "Limit Order",
  lineVisible: true,
  axisLabelTextColor: "white",
  axisLabelColor: "#48a2de",
};

export const openingOrderPriceLineOptions: Partial<PriceLineOptions> = {
  lineStyle: LineStyle.LargeDashed,
  color: "#cad2d9",
  lineWidth: 1 as LineWidth,
  axisLabelVisible: true,
  title: "",
  lineVisible: true,
  axisLabelTextColor: "white",
  axisLabelColor: "#09090b",
};
