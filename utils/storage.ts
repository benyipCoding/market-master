import {
  CandlestickSeriesPartialOptions,
  LineSeriesPartialOptions,
} from "lightweight-charts";

const DEFAULT_LINE_OPTIONS = "default_line_options";

export function setDefaultLineOptions(options: LineSeriesPartialOptions) {
  return localStorage.setItem(DEFAULT_LINE_OPTIONS, JSON.stringify(options));
}

export function getDefaultLineOptions(): LineSeriesPartialOptions {
  const options = localStorage.getItem(DEFAULT_LINE_OPTIONS);
  if (!options)
    throw new Error("Missing default line options in localstorage!");
  return JSON.parse(options);
}

export function hasDefaultLineOptions(): boolean {
  return localStorage.getItem(DEFAULT_LINE_OPTIONS) !== null;
}

const DEFAULT_CANDLESTICK_OPTIONS = "default_candlestick_options";

export function setDefaultCandlestickOptions(
  options: CandlestickSeriesPartialOptions
) {
  return localStorage.setItem(
    DEFAULT_CANDLESTICK_OPTIONS,
    JSON.stringify(options)
  );
}

export function getDefaultCandlestickOptions(): CandlestickSeriesPartialOptions {
  const options = localStorage.getItem(DEFAULT_CANDLESTICK_OPTIONS);
  if (!options)
    throw new Error("Missing default line options in localstorage!");
  return JSON.parse(options);
}

export function hasDefaultCandlestickOptions(): boolean {
  return localStorage.getItem(DEFAULT_CANDLESTICK_OPTIONS) !== null;
}
