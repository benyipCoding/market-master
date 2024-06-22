import { ISeriesApi, SeriesType, Time, IChartApi } from "lightweight-charts";

export const calcMouseCoordinate = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent,
  dom: HTMLDivElement | null
) => {
  const x = e.clientX - dom!.getBoundingClientRect().left;
  const y = e.clientY - dom!.getBoundingClientRect().top;
  return [x, y];
};

export const calcValue = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent,
  dom: HTMLDivElement | null,
  series: ISeriesApi<SeriesType, Time>,
  chart: IChartApi
) => {
  const [x, y] = calcMouseCoordinate(e, dom);
  const valueY = series.coordinateToPrice(y);
  const valueX = chart.timeScale().coordinateToTime(x);
  return [valueX, valueY];
};
