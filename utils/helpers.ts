import {
  ISeriesApi,
  SeriesType,
  Time,
  IChartApi,
  LineData,
} from "lightweight-charts";

export const calcMouseCoordinate = (
  mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent,
  chartContainer: HTMLDivElement | null
) => {
  const x = mouseEvent.clientX - chartContainer!.getBoundingClientRect().left;
  const y = mouseEvent.clientY - chartContainer!.getBoundingClientRect().top;
  return [x, y];
};

export const calcValue = (
  mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent,
  chartContainer: HTMLDivElement | null,
  series: ISeriesApi<SeriesType, Time>,
  chart: IChartApi
) => {
  const [x, y] = calcMouseCoordinate(mouseEvent, chartContainer);
  const toFixedNum = series.options().toFixedNum;
  const valueY = +series.coordinateToPrice(y)!.toFixed(toFixedNum);
  const valueX = chart.timeScale().coordinateToTime(x);
  const logic = chart.timeScale().coordinateToLogical(x);

  return [valueX, valueY, x, y, logic];
};

export type AnyFunction = (...args: any[]) => any;

export function throttle<T extends AnyFunction>(func: T, wait: number): T {
  let flag = true;
  let lastArgs: any;

  return function (this: ThisParameterType<T>, ...args: any[]) {
    if (flag) {
      flag = false;
      func.apply(this, args);
      setTimeout(() => {
        flag = true;
      }, wait);
    } else {
      lastArgs = args;
      return;
    }
  } as T;
}

export function isWithinRange(
  reference: number,
  actual: number,
  sensitivity: number = 0.005
) {
  const amount = reference * sensitivity;
  return Math.abs(reference - actual) <= amount;
}

export function debonce<T extends AnyFunction>(func: T, wait: number): T {
  let timer: NodeJS.Timeout;

  return function (this: ThisParameterType<T>, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  } as T;
}

export type Point = { x: number; y: number; logic?: number; price?: number };
export type Equation = (x: number) => number;

export function generateLinearEquation(
  point1: Point,
  point2: Point,
  chart: IChartApi
): Equation {
  // Point slope rate
  const { logic: logic1, price: price1 } = point1;
  const { logic: logic2, price: price2 } = point2;

  const m = (price2! - price1!) / (logic2! - logic1!);

  return function (x: number) {
    const logic = chart.timeScale().coordinateToLogical(x);

    return m * (logic! - logic1!) + price1!;
  };
}

export const recordEquation = debonce(function (
  point1: Point,
  point2: Point,
  lineSeriesId: string,
  setLineId_equation: React.Dispatch<
    React.SetStateAction<Record<string, Equation>>
  >,
  chart: IChartApi
) {
  const equation = generateLinearEquation(point1, point2, chart);
  setLineId_equation((prev) => ({ ...prev, [lineSeriesId]: equation }));
},
500);

export interface IFindHoveringSeries {
  childSeries: ISeriesApi<SeriesType, Time>[];
  chart: IChartApi;
  lineId_equation: Record<string, Equation>;
  point: Point;
}

export const findHoveringSeries = ({
  childSeries,
  chart,
  lineId_equation,
  point,
}: IFindHoveringSeries) => {
  if (!point) return;

  return childSeries.find((series, index) => {
    if (index === 0) return;

    const id = series.options().id;
    const equation = lineId_equation[id];
    if (!equation) return;
    const time = new Date(
      chart.timeScale().coordinateToTime(point.x) as string
    ).getTime();
    const seriesTime = series
      .data()
      .map((d) => new Date(d.time as string).getTime())
      .sort((a, b) => a - b);

    const isInBoundary = time >= seriesTime[0] && time <= seriesTime[1];
    const price = equation(point.x);

    const isHoveringOverLine =
      isWithinRange(price, series.coordinateToPrice(point.y)!) && isInBoundary;

    return isHoveringOverLine;
  });
};

export const makeLineData = (
  point1: LineData<Time>,
  point2: LineData<Time>,
  lineId: string
) => {
  return [point1, point2]
    .sort(
      (a, b) =>
        new Date(a.time as string).getTime() -
        new Date(b.time as string).getTime()
    )
    .map((point, index) => ({
      ...point,
      customValues: {
        ...point.customValues,
        id: lineId,
        isStartPoint: index === 0,
      },
    }));
};

export const findClosestPrice = (
  targetPrice: number,
  references: number[],
  sensitivity: number = 0.0025
): number | undefined => {
  if (!references.length) return;

  const closestPrices = references.filter((price) =>
    isWithinRange(price, targetPrice, sensitivity)
  );

  if (!closestPrices.length) return;
  if (closestPrices.length === 1) return closestPrices[0];

  let closest = closestPrices[0];
  let minDiff = Math.abs(targetPrice - closest);

  for (let i = 1; i < closestPrices.length; i++) {
    let currentDiff = Math.abs(targetPrice - closestPrices[i]);
    if (currentDiff < minDiff) {
      minDiff = currentDiff;
      closest = closestPrices[i];
    }
  }

  return closest;
};

// First letter uppercase
export const titleCase = (str: string): string => {
  if (typeof str !== "string" || !str.length) return "";
  const result = str[0].toUpperCase() + str.slice(1);
  return result;
};

// Firsh letter lowercase
export const textCase = (str: string): string => {
  if (typeof str !== "string" || !str.length) return "";
  const result = str[0].toLowerCase() + str.slice(1);
  return result;
};
