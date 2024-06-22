import { ChartContext } from "@/components/TChart";
import {
  defaultCandleStickOptions,
  defaultLineOptions,
} from "@/constants/seriesOptions";
import {
  ISeriesApi,
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
  const { chart, setChildSeries } = useContext(ChartContext);
  const [series, setSeries] = useState<ISeriesApi<SeriesType, Time>>();

  // dispatch series
  useEffect(() => {
    if (!chart) return;
    switch (type) {
      case "Line":
        setSeries(
          chart.addLineSeries(
            Object.assign({}, defaultLineOptions, customOptions)
            // (customOptions as LineSeriesPartialOptions) || defaultLineOptions
          )
        );
        break;

      case "Candlestick":
        setSeries(
          chart.addCandlestickSeries(
            Object.assign({}, defaultCandleStickOptions, customOptions)
            // (customOptions as CandlestickSeriesPartialOptions) ||
            //   defaultCandleStickOptions
          )
        );
        break;

      default:
        throw new Error("No series type matched");
    }
  }, [chart, type]);

  // set data
  useEffect(() => {
    if (!series) return;
    setChildSeries!((prev) => {
      const title = series.options().title;
      const isExisted = prev.some((s) => s.options().title === title);
      if (isExisted) {
        return [...prev];
      }
      return [...prev, series];
    });

    if (!seriesData || !seriesData.length) return;
    series.setData(seriesData);
  }, [series, seriesData, setChildSeries]);

  return {
    series,
  };
};
