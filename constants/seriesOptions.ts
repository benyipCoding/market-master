import { CandlestickSeriesPartialOptions } from "lightweight-charts";

// default candle stick options
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
