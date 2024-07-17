"use client";
import React, { useEffect, useMemo } from "react";
import { useSeries } from "@/hooks/useSeries";
import { LineSeriesProps } from "./interfaces/LineSeries";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  DeepPartial,
  ISeriesApi,
  LineSeriesPartialOptions,
  LineWidth,
  Time,
} from "lightweight-charts";

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const { selectedSeries, hoveringSeries } = useSelector(
    (state: RootState) => state.common
  );
  const { series } = useSeries("Line", seriesData, customSeriesOptions);

  const currentSeriesOptions = useMemo<LineSeriesPartialOptions>(
    () => (series as ISeriesApi<"Line", Time>)?.options(),
    [series]
  );

  const hoveringOptions = useMemo(
    () => ({
      ...currentSeriesOptions,
      lineWidth: (currentSeriesOptions?.lineWidth! +
        1) as DeepPartial<LineWidth>,
      pointMarkersVisible: true,
    }),
    [currentSeriesOptions]
  );

  const selectedOptions = useMemo(
    () => ({
      ...currentSeriesOptions,
      lineWidth: (currentSeriesOptions?.lineWidth! +
        2) as DeepPartial<LineWidth>,
      pointMarkersVisible: true,
    }),
    [currentSeriesOptions]
  );

  useEffect(() => {
    if (series === selectedSeries) {
      series?.applyOptions(selectedOptions);
    } else if (series === hoveringSeries) {
      series?.applyOptions(hoveringOptions);
    } else {
      series?.applyOptions(currentSeriesOptions);
    }
  }, [selectedSeries, series, hoveringSeries]);

  return null;
};

export default LineSeries;
