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
