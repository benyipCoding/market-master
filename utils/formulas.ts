import * as math from "mathjs";

// Calculate EMA
export const calculateEMA = (prices: number[], period: number): number[] => {
  if (!prices.length || !period)
    throw new Error("The arguments of calculateEMA function are invalid.");

  const k = 2 / (period + 1); // 计算平滑常数
  const emaArray = [];
  let ema = math.mean(prices.slice(0, period)); // 使用前period个价格的均值作为初始EMA
  emaArray.push(ema);

  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
    emaArray.push(ema);
  }

  return emaArray;
};
