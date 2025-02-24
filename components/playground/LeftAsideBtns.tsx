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
import { setCurrentOrderTab, setPanelContent } from "@/store/bottomPanelSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

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
  const { panelContent, currentOrderTab } = useSelector(
    (state: RootState) => state.bottomPanel
  );
  const dispatch = useDispatch<AppDispatch>();
  const [orderTabsOpen, setOrderTabsOpen] = useState(false);

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

  const toggleBottomPanelOpen = () => {
    setBottomPanelOpen((prev) => !prev);
  };

  const switchToOrders = () => {
    dispatch(setPanelContent(BottomPanelContent.Orders));
  };

  const switchToOscillators = () => {
    dispatch(setCurrentOrderTab(""));
    dispatch(setPanelContent(BottomPanelContent.Oscillators));
  };

  // L key
  useEffect(() => {
    hotkeys("l", toggleDrawingLineSegment);
    hotkeys("v", toggleAutoResize);
    hotkeys("m", toggleBottomPanelOpen);

    return () => {
      hotkeys.unbind("l");
      hotkeys.unbind("v");
      hotkeys.unbind("m");
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
    hotkeys("Esc", closeDialogByESC);
    // hotkeys("o", switchToOrders);
    hotkeys("c", switchToOscillators);
    document.addEventListener("contextmenu", contextmenuHandler);
    return () => {
      hotkeys.unbind("Esc");
      // hotkeys.unbind("o");
      hotkeys.unbind("c");
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant={"ghost"}
                className={cn(
                  "hover:bg-muted p-1 active:scale-100 opacity-0 transition duration-150 translate-y-28",
                  bottomPanelOpen && "opacity-100 translate-y-0",
                  panelContent === BottomPanelContent.Orders && "bg-secondary"
                )}
              >
                <RiListUnordered className="w-full h-full" />
                <span className="sr-only">Orders</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-fit" side="right">
              <ScrollArea
                className="rounded-md"
                thumbClass="dark:bg-primary-foreground"
              >
                <DropdownMenuRadioGroup
                  value={currentOrderTab}
                  onValueChange={(value) => {
                    switchToOrders();
                    dispatch(setCurrentOrderTab(value as OrderTabs));
                  }}
                >
                  <DropdownMenuRadioItem
                    value={OrderTabs.Opening}
                    className="cursor-pointer"
                  >
                    Opening Orders
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem
                    value={OrderTabs.Limit}
                    className="cursor-pointer"
                  >
                    Limit Orders
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem
                    value={OrderTabs.Closed}
                    className="cursor-pointer"
                  >
                    Closed Orders
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={"ghost"}
                className={cn(
                  "hover:bg-muted p-1 active:scale-100 opacity-0 transition duration-150 translate-y-10",
                  bottomPanelOpen && "opacity-100 translate-y-0",
                  panelContent === BottomPanelContent.Oscillators &&
                    "bg-secondary"
                )}
                onClick={switchToOscillators}
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
          <Tooltip>
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
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LeftAsideBtns;
