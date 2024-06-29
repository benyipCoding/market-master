import { ISeriesApi, SeriesType, Time, IChartApi } from "lightweight-charts";

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
  const valueY = series.coordinateToPrice(y);
  const valueX = chart.timeScale().coordinateToTime(x);
  return [valueX, valueY, x, y];
};

type AnyFunction = (...args: any[]) => any;

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

export function isWithinRange(num1: number, num2: number, num3?: number) {
  const amount = num3 || num1 * 0.002;
  return Math.abs(num1 - num2) <= amount;
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

export type Point = { x: number; y: number };

export function generateLinearEquation(point1: Point, point2: Point) {
  // Point slope rate
  const m = (point2.y - point1.y) / (point2.x - point2.x);

  return function (x: number) {
    return m * (x - point1.x) + point1.y;
  };
}
