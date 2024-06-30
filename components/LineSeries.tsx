"use client";
import {
  DeepPartial,
  LineStyleOptions,
  SeriesOptionsCommon,
} from "lightweight-charts";
import React, { useEffect, useState } from "react";
import { useSeries } from "@/hooks/useSeries";
import {
  defaultLineOptions,
  selectedLineOptions,
} from "@/constants/seriesOptions";
import { LineSeriesProps } from "./interfaces/LineSeries";

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const { series, selectedSeries } = useSeries(
    "Line",
    seriesData,
    customSeriesOptions
  );

  const [originalOptions, setOriginalOptions] =
    useState<DeepPartial<LineStyleOptions & SeriesOptionsCommon>>(
      defaultLineOptions
    );

  useEffect(() => {
    if (series === selectedSeries) {
      setOriginalOptions(series!.options());
      series?.applyOptions(selectedLineOptions);
    } else {
      series?.applyOptions(originalOptions);
    }
  }, [selectedSeries, series]);

  return null;
};

export default LineSeries;
