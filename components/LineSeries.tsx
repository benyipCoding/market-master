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
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const { selectedSeries } = useSelector((state: RootState) => state.common);
  const { series } = useSeries("Line", seriesData, customSeriesOptions);

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
