import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BottomPanelContent,
  LeftAsideBtnsProps,
  OrderTabs,
} from "../interfaces/Playground";
import { PiLineSegment } from "react-icons/pi";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  setSelectedSeries,
  setHoveringSeries,
  toggleDrawing,
  setSelectedIndicator,
  GraphType,
  setGraphType,
} from "@/store/commonSlice";
import hotkeys from "hotkeys-js";
import { removeIndicator, removeSeries } from "@/utils/helpers";
import { BsArrowsVertical } from "react-icons/bs";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { RiListUnordered } from "react-icons/ri";
import { MdBarChart } from "react-icons/md";
import { setPanelContent } from "@/store/bottomPanelSlice";

const LeftAsideBtns: React.FC<LeftAsideBtnsProps> = ({
  className,
  tChartRef,
  setDialogVisible,
  setDrawedLineList,
  setTechnicalIndicatorLines,
  bottomPanelOpen,
  setBottomPanelOpen,
}) => {
  const { isDrawing, selectedSeries, selectedIndicator, graphType } =
    useSelector((state: RootState) => state.common);
  const { panelContent } = useSelector((state: RootState) => state.bottomPanel);
  const dispatch = useDispatch<AppDispatch>();
  // const [orderTabsOpen, setOrderTabsOpen] = useState(false);

  const isAutoResize = useMemo<boolean>(
    () =>
      !!tChartRef.current
        ? tChartRef.current?.chart.options().rightPriceScale.autoScale
        : false,
    [tChartRef.current?.chart.options().rightPriceScale.autoScale]
  );

  const toggleDrawingLineSegment = useCallback(() => {
    if (!tChartRef.current) return;
    const { dialogVisible } = tChartRef.current;
    if (dialogVisible) return;
    dispatch(setSelectedSeries(null));
    dispatch(setHoveringSeries(null));
    dispatch(toggleDrawing(!isDrawing));
    if (!isDrawing) dispatch(setGraphType(GraphType.LineSegment));
    else dispatch(setGraphType(""));
  }, [isDrawing]);

  const contextmenuHandler = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (!tChartRef.current) return;
    const { dialogVisible } = tChartRef.current;
    if (dialogVisible) return;
    dispatch(setSelectedSeries(null));
    dispatch(toggleDrawing(false));
    dispatch(setGraphType(""));
  }, []);

  const closeDialogByESC = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setDialogVisible(false);
  }, []);

  const onDeleteSeries = useCallback(() => {
    if (!tChartRef.current) return;
    const { chart, dialogVisible, setLineId_equation, setChildSeries } =
      tChartRef.current;
    if (dialogVisible) return;
    if (selectedSeries) {
      removeSeries({
        chart,
        selectedSeries,
        setChildSeries,
        setDrawedLineList,
        setLineId_equation,
      });

      dispatch(setSelectedSeries(null));
    }

    if (selectedIndicator) {
      removeIndicator({ chart, selectedIndicator, setTechnicalIndicatorLines });
      dispatch(setSelectedIndicator(null));
    }
  }, [selectedSeries, selectedIndicator]);

  const toggleAutoResize = useCallback(() => {
    if (isAutoResize) {
      tChartRef.current?.chart.applyOptions({
        rightPriceScale: {
          autoScale: false,
        },
      });
    } else {
      tChartRef.current?.chart.applyOptions({
        rightPriceScale: {
          autoScale: true,
        },
      });
    }
  }, [isAutoResize]);

  // const toggleBottomPanelOpen = () => {
  //   setBottomPanelOpen((prev) => !prev);
  // };

  const switchPanel = useCallback(
    (content: BottomPanelContent) => {
      if (panelContent === content) {
        setBottomPanelOpen(false);
        dispatch(setPanelContent(BottomPanelContent.Hide));
        return;
      }
      if (!bottomPanelOpen) setBottomPanelOpen(true);
      dispatch(setPanelContent(content));
    },
    [bottomPanelOpen, dispatch, panelContent, setBottomPanelOpen]
  );

  // const switchToOscillators = useCallback(() => {
  //   if (panelContent === BottomPanelContent.Oscillators) {
  //     setBottomPanelOpen(false);
  //     dispatch(setPanelContent(BottomPanelContent.Hide));
  //     return;
  //   }

  //   if (!bottomPanelOpen) {
  //     setBottomPanelOpen(true);
  //   }

  //   dispatch(setPanelContent(BottomPanelContent.Oscillators));
  // }, [bottomPanelOpen, dispatch, panelContent, setBottomPanelOpen]);

  // L key
  useEffect(() => {
    hotkeys("l", toggleDrawingLineSegment);
    hotkeys("v", toggleAutoResize);
    // hotkeys("m", toggleBottomPanelOpen);

    return () => {
      hotkeys.unbind("l");
      hotkeys.unbind("v");
      // hotkeys.unbind("m");
    };
  }, [toggleDrawingLineSegment, toggleAutoResize]);

  // Delete key
  useEffect(() => {
    hotkeys("Delete", onDeleteSeries);
    return () => {
      hotkeys.unbind("Delete");
    };
  }, [onDeleteSeries]);

  useEffect(() => {
    hotkeys("o", () => switchPanel(BottomPanelContent.Orders));
    hotkeys("c", () => switchPanel(BottomPanelContent.Oscillators));

    return () => {
      hotkeys.unbind("o");
      hotkeys.unbind("c");
    };
  }, [switchPanel]);

  useEffect(() => {
    hotkeys("Esc", closeDialogByESC);
    document.addEventListener("contextmenu", contextmenuHandler);
    return () => {
      hotkeys.unbind("Esc");
      document.removeEventListener("contextmenu", contextmenuHandler);
    };
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "bg-background rounded-md flex-shrink-0 flex flex-col p-1 gap-3 relative",
          className
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={"ghost"}
              className={cn(
                "hover:bg-muted p-1",
                isAutoResize && "bg-secondary"
              )}
              onClick={toggleAutoResize}
            >
              <BsArrowsVertical className="w-full h-full" />
              <span className="sr-only">Auto Resize</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex">
            <p className="nav-item-divider">Auto Resize</p>
            <span className="short-cut">V</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={"ghost"}
              className={cn(
                "hover:bg-muted p-1",
                graphType === GraphType.LineSegment && "bg-secondary"
              )}
              onClick={toggleDrawingLineSegment}
            >
              <PiLineSegment className="w-full h-full" />
              <span className="sr-only">Draw Line</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex">
            <p className="nav-item-divider">Draw Line</p>
            <span className="short-cut">L</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={"ghost"}
              className={cn(
                "hover:bg-muted p-1",
                graphType === GraphType.Horizontal &&
                  "bg-primary hover:bg-primary"
              )}
            >
              <PiLineSegment className="w-full h-full rotate-45" />
              <span className="sr-only">Horizontal Line</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex">
            <p className="nav-item-divider">Horizontal Line</p>
            <span className="short-cut">H</span>
          </TooltipContent>
        </Tooltip>

        <div className="absolute bottom-4 flex flex-col gap-4">
          {/* Orders */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={"ghost"}
                className={cn(
                  "hover:bg-muted p-1 active:scale-100",
                  panelContent === BottomPanelContent.Orders && "bg-secondary"
                )}
                onClick={() => switchPanel(BottomPanelContent.Orders)}
              >
                <RiListUnordered className="w-full h-full" />
                <span className="sr-only">Orders</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex">
              <p className="nav-item-divider">Orders</p>
              <span className="short-cut">O</span>
            </TooltipContent>
          </Tooltip>

          {/* Oscillators */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={"ghost"}
                className={cn(
                  "hover:bg-muted p-1 active:scale-100",
                  panelContent === BottomPanelContent.Oscillators &&
                    "bg-secondary"
                )}
                onClick={() => switchPanel(BottomPanelContent.Oscillators)}
              >
                <MdBarChart className="w-full h-full" />
                <span className="sr-only">Oscillators</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex">
              <p className="nav-item-divider">Oscillators</p>
              <span className="short-cut">C</span>
            </TooltipContent>
          </Tooltip>

          {/* 切换按钮 */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={"ghost"}
                className={cn("hover:bg-muted p-1 active:scale-100")}
                onClick={toggleBottomPanelOpen}
              >
                {bottomPanelOpen ? (
                  <PanelRightClose className="w-full h-full rotate-90" />
                ) : (
                  <PanelRightOpen className="w-full h-full rotate-90" />
                )}
                <span className="sr-only">Bottom Panel</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex">
              <p className="nav-item-divider">Bottom Panel</p>
              <span className="short-cut">M</span>
            </TooltipContent>
          </Tooltip> */}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LeftAsideBtns;
