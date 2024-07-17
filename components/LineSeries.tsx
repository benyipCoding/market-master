"use client";
import React, { useEffect } from "react";
import { useSeries } from "@/hooks/useSeries";
import { LineSeriesProps } from "./interfaces/LineSeries";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getDefaultLineOptions } from "@/utils/storage";
import { DeepPartial, LineWidth } from "lightweight-charts";

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const { selectedSeries, hoveringSeries } = useSelector(
    (state: RootState) => state.common
  );
  const { series } = useSeries("Line", seriesData, customSeriesOptions);

  const defaultLineOptions = getDefaultLineOptions();
  const hoveringOptions = {
    ...defaultLineOptions,
    lineWidth: (defaultLineOptions.lineWidth! + 1) as DeepPartial<LineWidth>,
    pointMarkersVisible: true,
  };
  const selectedOptions = {
    ...defaultLineOptions,
    lineWidth: (defaultLineOptions.lineWidth! + 2) as DeepPartial<LineWidth>,
    pointMarkersVisible: true,
  };

  useEffect(() => {
    if (series === selectedSeries) {
      series?.applyOptions(selectedOptions);
    } else if (series === hoveringSeries) {
      series?.applyOptions(hoveringOptions);
    } else {
      series?.applyOptions(defaultLineOptions!);
    }
  }, [selectedSeries, series, hoveringSeries]);

  return null;
};

export default LineSeries;
