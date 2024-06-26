"use client";
import { LineData, LineSeriesPartialOptions, Time } from "lightweight-charts";
import React from "react";
import { useSeries } from "@/hooks/useSeries";

interface LineSeriesProps {
  seriesData?: LineData<Time>[];
  customSeriesOptions?: LineSeriesPartialOptions;
}

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  useSeries("Line", seriesData, customSeriesOptions);
  return null;
};

export default LineSeries;
