import { ChartContext } from "@/components/TChart";
import { defaultCandleStickOptions } from "@/constants/seriesOptions";
import {
  getDefaultCandlestickOptions,
  getDefaultLineOptions,
} from "@/utils/storage";
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
            Object.assign({}, getDefaultLineOptions(), customOptions)
          )
        );
        break;

      case "Candlestick":
        setSeries(
          chart.addCandlestickSeries(
            // Object.assign({}, defaultCandleStickOptions, customOptions)
            Object.assign({}, getDefaultCandlestickOptions(), customOptions)
          )
        );
        break;

      default:
        throw new Error("No series type matched");
    }
  }, [chart, type]);

  // record series instance and set data
  useEffect(() => {
    if (!series) return;
    const id = series.options().id;
    if (!id) throw new Error("Newly added series must have an id");

    setChildSeries!((prev) => {
      const isExisted = prev.some((s) => s.options().id === id);
      if (isExisted) {
        return [...prev];
      }
      return [...prev, series];
    });

    if (!seriesData || !seriesData.length) return;

    series.setData(
      seriesData.map((item) => ({
        ...item,
        customValues: { id: `${id}_${type}` },
      }))
    );
  }, [series, seriesData, setChildSeries]);

  return {
    series,
  };
};
