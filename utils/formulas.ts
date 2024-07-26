import { LineData, Time } from "lightweight-charts";
import * as math from "mathjs";

// Calculate EMA
export const calculateEMA = (
  prices: LineData<Time>[],
  period: number,
  toFixedNum: number
): LineData<Time>[] => {
  if (!prices.length || !period)
    throw new Error("The arguments of calculateEMA function are invalid.");

  const k = 2 / (period + 1); // 计算平滑常数
  const emaArray: LineData<Time>[] = [];
  let ema = math.mean(prices.map((price) => price.value).slice(0, period)); // 使用前period个价格的均值作为初始EMA
  emaArray.push({
    time: prices[period - 1].time,
    value: +ema.toFixed(toFixedNum),
  });

  for (let i = period; i < prices.length; i++) {
    ema = prices[i].value * k + ema * (1 - k);
    emaArray.push({ time: prices[i].time, value: +ema.toFixed(toFixedNum) });
  }

  return emaArray;
};
