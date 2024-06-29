"use client";
import { LineData, LineSeriesPartialOptions, Time } from "lightweight-charts";
import React, { useContext, useEffect } from "react";
import { useSeries } from "@/hooks/useSeries";
import { ChartContext } from "./TChart";

interface LineSeriesProps {
  seriesData?: LineData<Time>[];
  customSeriesOptions?: LineSeriesPartialOptions;
}

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const { series } = useSeries("Line", seriesData, customSeriesOptions);

  return null;
};

export default LineSeries;
