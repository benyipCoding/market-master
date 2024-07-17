import { LineSeriesPartialOptions } from "lightweight-charts";

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
