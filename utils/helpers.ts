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

export function isWithinRange(
  reference: number,
  actual: number,
  rate: number = 0.03
) {
  const amount = reference * rate;
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

export type Point = { x: number; y: number };
export type Equation = (x: number) => number;

export function generateLinearEquation(point1: Point, point2: Point): Equation {
  // Point slope rate
  const m = (point2.y - point1.y) / (point2.x - point1.x);

  return function (x: number) {
    return m * (x - point1.x) + point1.y;
  };
}

export const recordEquation = debonce(function (
  point1: Point,
  point2: Point,
  lineSeriesId: string,
  setLineId_equation: React.Dispatch<
    React.SetStateAction<Record<string, Equation>>
  >
) {
  const equation = generateLinearEquation(point1, point2);
  setLineId_equation((prev) => ({ ...prev, [lineSeriesId]: equation }));
},
500);
