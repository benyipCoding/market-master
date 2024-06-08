import { LineData, Time } from "lightweight-charts";
import React from "react";
import { useSeries } from "@/hooks/useSeries";

interface LineSeriesProps {
  seriesData: LineData<Time>[];
}

const LineSeries: React.FC<LineSeriesProps> = ({ seriesData }) => {
  const { series } = useSeries("Line", seriesData);

  return null;
};

export default LineSeries;
