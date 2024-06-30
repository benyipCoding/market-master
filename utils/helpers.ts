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
  rate: number = 0.003
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

export function generateLinearEquation(
  point1: Point,
  point2: Point,
  chart: IChartApi,
  series: ISeriesApi<SeriesType, Time>
): Equation {
  // Point slope rate
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;
  const t1 = new Date(
    chart.timeScale().coordinateToTime(x1) as string
  ).getTime();
  const t2 = new Date(
    chart.timeScale().coordinateToTime(x2) as string
  ).getTime();
  const p1 = series.coordinateToPrice(y1) as number;
  const p2 = series.coordinateToPrice(y2) as number;

  const m = (p2 - p1) / (t2 - t1);

  return function (x: number) {
    const t = new Date(
      chart.timeScale().coordinateToTime(x) as string
    ).getTime();

    return m * (t - t1) + p1;
  };
}

export const recordEquation = debonce(function (
  point1: Point,
  point2: Point,
  lineSeriesId: string,
  setLineId_equation: React.Dispatch<
    React.SetStateAction<Record<string, Equation>>
  >,
  chart: IChartApi,
  series: ISeriesApi<SeriesType, Time>
) {
  const equation = generateLinearEquation(point1, point2, chart, series);
  setLineId_equation((prev) => ({ ...prev, [lineSeriesId]: equation }));
},
500);

export const findHoveringSeries = (
  childSeries: ISeriesApi<SeriesType, Time>[],
  chart: IChartApi,
  lineId_equation: Record<string, Equation>,
  point: Point
) => {
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
