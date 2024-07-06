"use client";
import React, { useEffect } from "react";
import { useSeries } from "@/hooks/useSeries";
import {
  defaultLineOptions,
  hoveringLineOptions,
  selectedLineOptions,
} from "@/constants/seriesOptions";
import { LineSeriesProps } from "./interfaces/LineSeries";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const { selectedSeries, hoveringSeries } = useSelector(
    (state: RootState) => state.common
  );
  const { series } = useSeries("Line", seriesData, customSeriesOptions);

  useEffect(() => {
    if (series === selectedSeries) {
      series?.applyOptions(selectedLineOptions);
    } else if (series === hoveringSeries) {
      series?.applyOptions(hoveringLineOptions);
    } else {
      series?.applyOptions(defaultLineOptions);
    }
  }, [selectedSeries, series, hoveringSeries]);

  return null;
};

export default LineSeries;
