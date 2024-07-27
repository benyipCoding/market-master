"use client";
import {
  darkModeOptions,
  defaultChartOptions,
  lightModeOptions,
} from "@/constants/chartOptions";
import { useEnableDrawingLine } from "@/hooks/useEnableDrawingLine";
import { AppDispatch, RootState } from "@/store";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  SeriesType,
  Time,
} from "lightweight-charts";
import React, {
  PropsWithChildren,
  useRef,
  createContext,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TChartRef, TChartProps, IChartContext } from "./interfaces/TChart";
import {
  Equation,
  findHoveringIndicator,
  findHoveringSeries,
} from "@/utils/helpers";
import {
  setHoveringIndicator,
  setHoveringSeries,
  setSelectedIndicator,
  setSelectedSeries,
} from "@/store/commonSlice";
import { useDragLineSeries } from "@/hooks/useDragLineSeries";
import { useTheme } from "next-themes";
import { ContextMenu, ContextMenuTrigger } from "./ui/context-menu";
import TChartContextMenu from "./TChartContextMenu";
import { TChartContextMenuRef } from "./interfaces/TChartContextMenu";
import { DialogContentType, setDialogContent } from "@/store/dialogSlice";
import { cn } from "@/lib/utils";

export const ChartContext = createContext<IChartContext>({});

const TChart: React.ForwardRefRenderFunction<
  TChartRef,
  PropsWithChildren<TChartProps>
> = (
  {
    children,
    className,
    setDrawedLineList,
    drawedLineList,
    setDialogVisible,
    dialogVisible,
  },
  ref
) => {
  const container = useRef<HTMLDivElement>(null);
  const {
    isDrawing,
    mouseMovingEventParam,
    mouseClickEventParam,
    mouseDblClickEventParam,
    mousePressing,
    selectedSeries,
    hoveringSeries,
    hoveringIndicator,
  } = useSelector((state: RootState) => state.common);
  const [chart, setChart] = useState<IChartApi>();
  const [lineId_equation, setLineId_equation] = useState<
    Record<string, Equation>
  >({});
  // Collection of series instances for all children components
  const [childSeries, setChildSeries] = useState<
    ISeriesApi<SeriesType, Time>[]
  >([]);

  const [hoveringPoint, setHoveringPoint] = useState<LineData<Time> | null>(
    null
  );
  const isCanGrab = useMemo<boolean>(() => !!hoveringPoint, [hoveringPoint]);
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const contextMenuTriggerDisable = useMemo(() => isDrawing, [isDrawing]);
  const contextMenuRef = useRef<TChartContextMenuRef>(null);

  // Activate the function of drawing straight lines
  const { drawStart, cleanUp: cleanUp1 } = useEnableDrawingLine({
    chart: chart!,
    childSeries,
    drawedLineList,
    setDrawedLineList,
    setLineId_equation,
  });
  //  Activate the function of draging lines
  const { changeSelectedSeries, cleanUp: cleanUp2 } = useDragLineSeries({
    dom: container.current!,
    baseSeries: childSeries[0],
    chart: chart!,
    hoveringPoint: hoveringPoint!,
    setLineId_equation,
  });
  // Mounted
  useEffect(() => {
    if (!container.current) return;
    setChart(createChart(container.current, defaultChartOptions));

    return () => {
      cleanUp1();
      cleanUp2();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Freeze screen when isDrawing is true
  useEffect(() => {
    if (!chart) return;
    chart.applyOptions({
      handleScale: !isDrawing,
      handleScroll: !isDrawing,
      rightPriceScale: { autoScale: !isDrawing },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]);

  // Mouse movement event (exclusive to light weight chart)
  useEffect(() => {
    if (!chart) return;
    // Logic of selectedSeries existed
    if (selectedSeries) {
      const point = mouseMovingEventParam?.seriesData.get(
        selectedSeries
      ) as LineData<Time> | null;

      if (point) setHoveringPoint(point);
      else setHoveringPoint(null);
    }

    // Logic of hoveringSeries
    const hoveringSeries = findHoveringSeries({
      childSeries,
      chart,
      lineId_equation,
      point: mouseMovingEventParam?.point!,
    });

    if (hoveringSeries) {
      dispatch(setHoveringSeries(hoveringSeries));
    } else {
      dispatch(setHoveringSeries(null));
    }

    // Logic of hoveringIndicator
    const hoveringIndicator = findHoveringIndicator({
      childSeries,
      chart,
      x: mouseMovingEventParam?.point?.x!,
      y: mouseMovingEventParam?.point?.y!,
    });
    if (hoveringIndicator) {
      dispatch(setHoveringIndicator(hoveringIndicator));
    } else {
      dispatch(setHoveringIndicator(null));
    }
  }, [mouseMovingEventParam, selectedSeries]);

  // Mouse click events (exclusive to light weight chart)
  useEffect(() => {
    if (!mouseClickEventParam?.point || !chart) return;
    // Find out if the series was hit by a mouse click
    const hoveringSeries = findHoveringSeries({
      childSeries,
      chart,
      lineId_equation,
      point: mouseClickEventParam.point!,
    });

    if (hoveringSeries) {
      dispatch(setSelectedSeries(hoveringSeries));
    } else {
      dispatch(setSelectedSeries(null));
    }

    if (hoveringIndicator) {
      dispatch(setSelectedIndicator(hoveringIndicator));
    } else {
      dispatch(setSelectedIndicator(null));
    }
  }, [mouseClickEventParam]);

  // Mouse double click events (exclusive to light weight chart)
  useEffect(() => {
    if (!selectedSeries) return;
    dispatch(setDialogContent(DialogContentType.DrawedLineSettings)); // Confirm dialog content type
    Promise.resolve().then(() => setDialogVisible(true));
  }, [mouseDblClickEventParam]);

  // Toggle light or dark mode
  useEffect(() => {
    if (!chart) return;
    if (theme === "light") {
      chart.applyOptions(lightModeOptions);
    } else {
      chart.applyOptions(darkModeOptions);
    }
  }, [chart, theme]);

  // When ContextMenu visible
  useEffect(() => {
    if (!contextMenuVisible) return;
    if (hoveringSeries) {
      contextMenuRef.current?.setSeriesSettingsDisable(false);
      setTimeout(() => dispatch(setSelectedSeries(hoveringSeries)));
    } else contextMenuRef.current?.setSeriesSettingsDisable(true);
  }, [contextMenuVisible]);

  useImperativeHandle(ref, () => ({
    chart: chart!,
    childSeries: childSeries,
    chartContainer: container,
    dialogVisible,
  }));

  return (
    <ContextMenu onOpenChange={setContextMenuVisible} modal={true}>
      <ContextMenuTrigger
        disabled={contextMenuTriggerDisable}
        className={cn(
          "relative block",
          className,
          isCanGrab && "cursor-grab",
          mousePressing && "cursor-grabbing",
          isDrawing && !mousePressing && "cursor-crosshair"
        )}
        ref={container}
        // Only unselected series can trigger the line drawing function
        onMouseDown={(e) =>
          hoveringPoint && !isDrawing
            ? changeSelectedSeries(
                e as MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>
              )
            : drawStart(e as any, container.current)
        }
      >
        <ChartContext.Provider
          value={{
            chart,
            setChildSeries,
          }}
        >
          {children}
        </ChartContext.Provider>
      </ContextMenuTrigger>

      <TChartContextMenu
        ref={contextMenuRef}
        setDialogVisible={setDialogVisible}
        dialogVisible={dialogVisible}
      />
    </ContextMenu>
  );
};

export default forwardRef(TChart);
