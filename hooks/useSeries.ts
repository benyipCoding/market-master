import { ChartContext } from "@/components/TChart";
import {
  defaultCandleStickOptions,
  defaultLineOptions,
} from "@/constants/seriesOptions";
import {
  CandlestickSeriesPartialOptions,
  ISeriesApi,
  LineSeriesPartialOptions,
  OhlcData,
  SeriesPartialOptions,
  SeriesType,
  SingleValueData,
  Time,
} from "lightweight-charts";
import { useContext, useEffect, useState } from "react";

type CombineSeriesDataType = OhlcData<Time>[] | SingleValueData<Time>[];

export const useSeries = <T>(
  type: SeriesType,
  seriesData?: CombineSeriesDataType,
  customOptions?: SeriesPartialOptions<T>
) => {
  const { chart } = useContext(ChartContext);
  const [series, setSeries] = useState<ISeriesApi<SeriesType, Time>>();

  // dispatch series
  useEffect(() => {
    if (!chart) return;
    switch (type) {
      case "Line":
        setSeries(
          chart.addLineSeries(
            (customOptions as LineSeriesPartialOptions) || defaultLineOptions
          )
        );
        break;

      case "Candlestick":
        setSeries(
          chart.addCandlestickSeries(
            (customOptions as CandlestickSeriesPartialOptions) ||
              defaultCandleStickOptions
          )
        );
        break;

      default:
        throw new Error("No series type matched");
    }
  }, [chart, customOptions, type]);

  // set data
  useEffect(() => {
    if (!series || !seriesData || !seriesData.length) return;

    series.setData(seriesData);
  }, [series, seriesData]);

  return {
    series,
  };
};
