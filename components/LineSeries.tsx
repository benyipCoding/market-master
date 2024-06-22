"use client";
import { ISeriesApi, LineData, Time } from "lightweight-charts";
import React, { useEffect } from "react";
import { useSeries } from "@/hooks/useSeries";

interface LineSeriesProps {
  seriesData?: LineData<Time>[];
  setSeries?: React.Dispatch<
    React.SetStateAction<ISeriesApi<"Line", Time> | undefined>
  >;
}

const LineSeries: React.FC<LineSeriesProps> = ({ seriesData, setSeries }) => {
  const { series } = useSeries("Line", seriesData);

  useEffect(() => {
    setSeries!(series as ISeriesApi<"Line", Time>);
  }, [series, setSeries]);

  return null;
};

export default LineSeries;
