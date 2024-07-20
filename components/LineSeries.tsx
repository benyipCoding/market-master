"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSeries } from "@/hooks/useSeries";
import { LineSeriesProps } from "./interfaces/LineSeries";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  DeepPartial,
  LineSeriesPartialOptions,
  LineWidth,
} from "lightweight-charts";
import {
  EmitterEventType,
  EmitteryContext,
  OnApply,
} from "@/providers/EmitteryProvider";

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const { selectedSeries, hoveringSeries } = useSelector(
    (state: RootState) => state.common
  );
  const { series } = useSeries("Line", seriesData, customSeriesOptions);
  const { emittery } = useContext(EmitteryContext);
  const [currentSeriesOptions, setCurrentSeriesOptions] =
    useState<LineSeriesPartialOptions>();

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

  const applyHandler = (
    payload: LineSeriesPartialOptions & EmitterEventType
  ) => {
    const curOptions = series?.options()!;
    if (curOptions.id !== payload.id) return;
    switch (payload.eventName) {
      case OnApply.Property:
        delete payload.eventName;
        const newCurrentSeriesOptions: LineSeriesPartialOptions = {
          ...curOptions,
          ...payload,
          pointMarkersVisible: false,
        };

        setCurrentSeriesOptions(newCurrentSeriesOptions);
        console.log({ newCurrentSeriesOptions });

        series?.applyOptions({
          ...newCurrentSeriesOptions,
          lineWidth: (newCurrentSeriesOptions?.lineWidth! +
            2) as DeepPartial<LineWidth>,
          pointMarkersVisible: true,
        });
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (!series) return;
    if (series === selectedSeries) {
      series?.applyOptions(selectedOptions);
    } else if (series === hoveringSeries) {
      series?.applyOptions(hoveringOptions);
    } else {
      series?.applyOptions(currentSeriesOptions!);
    }
  }, [selectedSeries, hoveringSeries]);

  useEffect(() => {
    if (!series) return;
    emittery?.on(OnApply.Property, applyHandler);

    setCurrentSeriesOptions(series.options());
  }, [series]);

  useEffect(() => {
    return () => {
      emittery?.off(OnApply.Property, applyHandler);
    };
  }, []);

  return null;
};

export default LineSeries;
