"use client";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSeries } from "@/hooks/useSeries";
import { LineSeriesProps } from "./interfaces/LineSeries";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  DeepPartial,
  LineData,
  LineSeriesPartialOptions,
  LineWidth,
  SeriesMarker,
  Time,
} from "lightweight-charts";
import {
  EmitterEventType,
  EmitteryContext,
  OnApply,
  OnSeriesCreate,
} from "@/providers/EmitteryProvider";
import dayjs from "dayjs";
import { CustomLineSeriesType } from "@/hooks/interfaces";

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const {
    selectedSeries,
    hoveringSeries,
    hoveringIndicator,
    selectedIndicator,
  } = useSelector((state: RootState) => state.common);
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

  const hoveringIndicatorOptions = useMemo(
    () => ({
      ...currentSeriesOptions,
      lineWidth: (currentSeriesOptions?.lineWidth! +
        1) as DeepPartial<LineWidth>,
      pointMarkersVisible: false,
    }),
    [currentSeriesOptions]
  );

  const selectedIndicatorOptions = useMemo(
    () => ({
      ...currentSeriesOptions,
      lineWidth: (currentSeriesOptions?.lineWidth! +
        2) as DeepPartial<LineWidth>,
      pointMarkersVisible: false,
    }),
    [currentSeriesOptions]
  );

  const setLabel = (options: LineSeriesPartialOptions) => {
    series?.setMarkers([]);
    const date = dayjs(series?.data()[1].time as string);
    const markers: SeriesMarker<Time>[] = [
      {
        color: options.color!,
        id: `${options.id}_label`,
        position: "inBar",
        shape: "circle",
        time: {
          year: date.year(),
          month: date.month(),
          day: date.day(),
        },
        text: options.customTitle,
      },
    ];
    series?.setMarkers(markers);
  };

  const applyHandler = (
    payload: LineSeriesPartialOptions &
      EmitterEventType & { data: LineData<Time>[] }
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

        series?.applyOptions({
          ...newCurrentSeriesOptions,
          lineWidth: (newCurrentSeriesOptions?.lineWidth! +
            2) as DeepPartial<LineWidth>,
          pointMarkersVisible: true,
        });

        if (newCurrentSeriesOptions.showLabel)
          setLabel(newCurrentSeriesOptions);
        else series?.setMarkers([]);
        break;

      case OnApply.Data:
        series?.setData(payload.data);

      default:
        break;
    }
  };

  useEffect(() => {
    if (!series) return;
    if (series === selectedSeries) {
      series?.applyOptions(selectedOptions);
    } else if (series === selectedIndicator) {
      series?.applyOptions(selectedIndicatorOptions);
    } else if (series === hoveringSeries) {
      series?.applyOptions(hoveringOptions);
    } else if (series === hoveringIndicator) {
      series?.applyOptions(hoveringIndicatorOptions);
    } else {
      series?.applyOptions(currentSeriesOptions!);
    }
  }, [selectedSeries, hoveringSeries, hoveringIndicator, selectedIndicator]);

  useEffect(() => {
    if (!series) return;
    emittery?.on(OnApply.Property, applyHandler);
    emittery?.on(OnApply.Data, applyHandler);

    setCurrentSeriesOptions(series.options());

    if (
      series.options().customType === CustomLineSeriesType.AutomaticDrawed ||
      series.options().customType === CustomLineSeriesType.SegmentDrawed ||
      series.options().customType === CustomLineSeriesType.GreatSegmentDrawed
    ) {
      emittery?.emit(OnSeriesCreate.LineSeries, series);
    }

    return () => {
      emittery?.off(OnApply.Property, applyHandler);
      emittery?.off(OnApply.Data, applyHandler);
    };
  }, [series]);

  return null;
};

export default LineSeries;
