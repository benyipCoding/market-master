import { cn } from "@/lib/utils";
import React, { useCallback, useEffect } from "react";
import { LeftAsideBtnsProps } from "../interfaces/Playground";
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

const LeftAsideBtns: React.FC<LeftAsideBtnsProps> = ({
  className,
  tChartRef,
  setDialogVisible,
  setDrawedLineList,
  setTechnicalIndicatorLines,
}) => {
  const { isDrawing, selectedSeries, selectedIndicator, graphType } =
    useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<AppDispatch>();

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
      chart.removeSeries(selectedSeries);
      const { id } = selectedSeries.options();

      setChildSeries((prev) => prev.filter((s) => s.options().id !== id));

      setDrawedLineList((prev) =>
        prev.filter((lineOptions) => lineOptions.id !== id)
      );
      dispatch(setSelectedSeries(null));

      setLineId_equation((prev) => {
        const newObj = { ...prev };
        delete newObj[id];
        return newObj;
      });
    }

    if (selectedIndicator) {
      chart.removeSeries(selectedIndicator);
      const { id } = selectedIndicator.options();
      setTechnicalIndicatorLines((prev) =>
        prev.filter((item) => item.options.id !== id)
      );
      dispatch(setSelectedIndicator(null));
    }
  }, [selectedSeries, selectedIndicator]);

  // L key
  useEffect(() => {
    hotkeys("l", toggleDrawingLineSegment);
    return () => {
      hotkeys.unbind("l");
    };
  }, [toggleDrawingLineSegment]);

  // Delete key
  useEffect(() => {
    hotkeys("Delete", onDeleteSeries);
    return () => {
      hotkeys.unbind("Delete");
    };
  }, [onDeleteSeries]);

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
          "bg-background rounded-md flex-shrink-0 flex flex-col p-1 gap-3",
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
                graphType === GraphType.LineSegment &&
                  "bg-primary hover:bg-primary"
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
      </div>
    </TooltipProvider>
  );
};

export default LeftAsideBtns;
