import { CustomLineSeriesType } from "../hooks/interfaces";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  ISeriesApi,
  SeriesType,
  Time,
  IChartApi,
  LineData,
  CandlestickData,
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

export interface CalcCoordinateArgs {
  chart: IChartApi;
  time: Time;
  series: ISeriesApi<SeriesType, Time>;
  price: number;
}
export const calcCoordinate = ({
  chart,
  time,
  series,
  price,
}: CalcCoordinateArgs) => {
  const x = chart.timeScale().timeToCoordinate(time)!;
  const y = series.priceToCoordinate(price);
  const logic = chart.timeScale().coordinateToLogical(x);
  return { x, y, logic };
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

export const recordEquationHandler = function (
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
};

export const recordEquation = debonce(recordEquationHandler, 500);

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

export interface IFindHoveringIndicator {
  childSeries: ISeriesApi<SeriesType, Time>[];
  x: number;
  y: number;
  chart: IChartApi;
}

export const findHoveringIndicator = ({
  childSeries,
  x,
  y,
  chart,
}: IFindHoveringIndicator): ISeriesApi<SeriesType, Time> | null => {
  const hoveringPrice = childSeries[0].coordinateToPrice(y);
  const hoveringTime = chart.timeScale().coordinateToTime(x);
  const allIndicatorSeries = childSeries.filter(
    (series) => series.options().customType === CustomLineSeriesType.Indicator
  );
  const price_series = new Map<number, ISeriesApi<SeriesType, Time>>();
  const references = allIndicatorSeries.reduce<number[]>((numArr, current) => {
    const price = (
      current
        .data()
        .find((data) => data.time === hoveringTime) as LineData<Time>
    )?.value;
    if (price) {
      price_series.set(price, current);
      return [...numArr, price];
    }
    return numArr;
  }, []);
  const closestPrice = findClosestPrice(hoveringPrice as number, references);
  if (closestPrice) return price_series.get(closestPrice) || null;
  return null;
};

export const makeLineData = (
  point1: LineData<Time>,
  point2: LineData<Time>,
  lineId: string
): LineData<Time>[] => {
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

// Extension name
export const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) return "";
  return filename.slice(lastDotIndex + 1);
};

// Validate MIME
export const validateFileType = (file: File) => {
  const validMimeTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // "text/csv",
  ];

  return validMimeTypes.includes(file.type);
};

// Validate excel or csv file
export const validateFileExtension = (file: File) => {
  // const validExtensions = ["xls", "xlsx", "csv"];
  const validExtensions = ["xls", "xlsx"];
  const fileExtension = getFileExtension(file.name);

  return validExtensions.includes(fileExtension);
};

export function countDecimalPlaces(number: number) {
  const numberStr = number.toString();
  if (numberStr.includes(".")) {
    return numberStr.split(".")[1].length;
  } else {
    return 0;
  }
}

export function downloadFile(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function calculateToFixedNum(
  data: CandlestickData<Time>[],
  times: number = 20
): number {
  let toFixedNum = 0;
  for (let i = 0; i < times; i++) {
    const randomIndex = Math.floor(Math.random() * data.length);
    const num = countDecimalPlaces(data[randomIndex].close);
    if (num > toFixedNum) {
      toFixedNum = num;
    }
  }
  return toFixedNum;
}

function getMinutesBetweenTimestamps(
  timestamp1: number,
  timestamp2: number
): number {
  const diffInMilliseconds = Math.abs(timestamp2 - timestamp1); // 计算两个时间戳的差值
  const diffInMinutes = diffInMilliseconds / (1000 * 60); // 将毫秒转换为分钟
  return diffInMinutes;
}

function getKeyWithMaxValue(countMap: Map<number, number>): number | undefined {
  let maxKey: number | undefined = undefined;
  let maxValue: number = -Infinity;

  for (const [key, value] of countMap) {
    if (value > maxValue) {
      maxValue = value;
      maxKey = key;
    }
  }
  return maxKey;
}

function formatMinutes(minutes: number): string {
  const MINUTES_IN_HOUR = 60;
  const MINUTES_IN_DAY = 60 * 24;
  const MINUTES_IN_WEEK = 60 * 24 * 7;
  const MINUTES_IN_MONTH = 60 * 24 * 30; // 取30天为一个月的估计

  if (minutes < MINUTES_IN_HOUR) {
    return `m${minutes}`; // 小于60分钟，返回分钟
  } else if (minutes < MINUTES_IN_DAY) {
    const hours = Math.floor(minutes / MINUTES_IN_HOUR);
    return `H${hours}`; // 小于一天，返回小时
  } else if (minutes < MINUTES_IN_WEEK) {
    const days = Math.floor(minutes / MINUTES_IN_DAY);
    return `D${days}`; // 小于一周，返回天数
  } else if (minutes < MINUTES_IN_MONTH) {
    const weeks = Math.floor(minutes / MINUTES_IN_WEEK);
    return `W${weeks}`; // 小于一个月，返回周数
  } else {
    const months = Math.floor(minutes / MINUTES_IN_MONTH);
    return `M${months}`; // 超过或等于一个月，返回月数
  }
}

export function calculateInterval(
  data: CandlestickData<Time>[],
  count: number = 1000
): string {
  if (!data || !data.length) throw new Error("Parameter 1 is missing data");

  count = Math.min(data.length, count);
  const minutes_count = new Map<number, number>();

  for (let i = 0; i < count; i++) {
    const rand = Math.floor(Math.random() * (data.length + 1));
    const current = data[rand];
    const next = data[rand - 1];
    const timestamp1 = new Date(current.time as string).getTime();
    const timestamp2 = new Date(next.time as string).getTime();
    const diff = getMinutesBetweenTimestamps(timestamp1, timestamp2);

    if (minutes_count.has(diff)) {
      const count = minutes_count.get(diff)!;
      minutes_count.set(diff, count + 1);
    } else {
      minutes_count.set(diff, 1);
    }
  }
  const maxShowUpMinute = getKeyWithMaxValue(minutes_count);
  if (!maxShowUpMinute) throw new Error("No maxShowUpMinute");
  const result = formatMinutes(maxShowUpMinute);
  return result;
}

export function timestampToDateStr(timestamp: number) {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm");
}

dayjs.extend(customParseFormat);
const SPECIAL_DATE_STR = "D/M/YYYY HH:mm:ss";
const FORMAT_DATE_STR = "YYYY-MM-DD HH:mm:ss";
export function isValidTime(str: string): boolean {
  const value1 = dayjs(str).format(FORMAT_DATE_STR);
  const value2 = dayjs(str, SPECIAL_DATE_STR).format(FORMAT_DATE_STR);
  return dayjs(value1).isValid() || dayjs(value2).isValid();
}

export function transferToDateStr(date: Date) {
  if (!(date instanceof Date))
    throw new TypeError("The type of the parameter must be Date type");

  const utcDate = adjustTimeZoneOffset(date);

  return dayjs(utcDate).isValid()
    ? dayjs(utcDate).format(FORMAT_DATE_STR)
    : dayjs(utcDate, SPECIAL_DATE_STR).format(FORMAT_DATE_STR);
}

export function indexOfVol(arr: Array<any>): number {
  if (!arr || !arr.length) return -1;
  if (arr.length < 6) return -1;
  return arr.indexOf(Math.max(...arr));
}

export function adjustTimeZoneOffset(date: Date) {
  const offsetInHours = date.getTimezoneOffset();
  const eightHoursInMilliseconds = offsetInHours * 60 * 1000;
  const newDate = new Date(date.getTime() + eightHoursInMilliseconds);
  return newDate;
}

export const generateLinePoint = (
  time: Time,
  price: number,
  mainSeries: ISeriesApi<SeriesType, Time>,
  chart: IChartApi
) => {
  const { x, y, logic } = calcCoordinate({
    time,
    price,
    series: mainSeries!,
    chart,
  });

  return {
    value: price,
    time,
    customValues: { x, y, logic, price },
  };
};
