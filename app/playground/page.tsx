"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart from "@/components/TChart";
import {
  CandlestickData,
  LineSeriesPartialOptions,
  MouseEventParams,
  Time,
} from "lightweight-charts";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { removeIndicator, removeSeries, throttle } from "@/utils/helpers";
import { TChartRef } from "@/components/interfaces/TChart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  setMouseClickEventParam,
  setMouseDblClickEventParam,
  setMouseMovingEventParam,
} from "@/store/commonSlice";
import Tooltips from "@/components/Tooltips";
import { Dialog } from "@/components/ui/dialog";
import SeriesSettings from "@/components/seriesSettings/SeriesSettings";
import CustomDialogContent from "@/components/CustomDialogContent";
import { DialogContentType, setDialogContent } from "@/store/dialogSlice";
import TechnicalIndexForm from "@/components/technicalIndex/TechnicalIndexForm";
import { cn } from "@/lib/utils";
import { DialogContext } from "@/context/Dialog";
import { TechnicalIndicatorLine } from "@/components/interfaces/TechnicalIndexForm";
import Navbar from "@/components/playground/Navbar";
import LeftAsideBtns from "@/components/playground/LeftAsideBtns";
import RightAsideBtns from "@/components/playground/RightAsideBtns";
import Aside from "@/components/playground/Aside";
import { AsideRef } from "@/components/interfaces/Playground";
import SymbolSearch from "@/components/SymbolSearch";
import UploadForm from "@/components/playground/UploadForm";
import {
  fetchPeriods,
  fetchSymbols,
  setCandleDataSlice,
  setCurrentCandle,
  setHasVol,
  setIsBackTestMode,
} from "@/store/fetchDataSlice";
import { getKLines } from "./actions/getKLines";
import { CustomLineSeriesType } from "@/hooks/interfaces";
import { toast } from "sonner";
import {
  EmitteryContext,
  OnCandlestickData,
  OnContronPanel,
  OnOrderMarker,
  OnPriceLine,
  OnStopLossAndTakeProfit,
} from "@/providers/EmitteryProvider";
import { getProfile } from "./actions/getProfile";
import { AuthContext } from "@/context/Auth";
import OrderActions from "@/components/playground/OrderActions";

const Playground = () => {
  // TChart component instance
  const tChartRef = useRef<TChartRef>(null);
  const mainWrapper = useRef<HTMLDivElement>(null);
  const asideRef = useRef<AsideRef>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [asideOpen, setAsideOpen] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { dialogContent } = useSelector((state: RootState) => state.dialog);
  // 监听清除LineSeries的信号
  const { emittery } = useContext(EmitteryContext);
  const {
    currentPeriod,
    currentSymbol,
    isBackTestMode,
    sliceLeft,
    sliceRight,
  } = useSelector((state: RootState) => state.fetchData);
  const isDrawedLineSettings = useMemo(
    () => dialogContent === DialogContentType.DrawedLineSettings,
    [dialogContent]
  );
  const isTechnicalIndex = useMemo(
    () => dialogContent === DialogContentType.TechnicalIndex,
    [dialogContent]
  );
  const isIndicatorSettings = useMemo(
    () => dialogContent === DialogContentType.IndicatorSettings,
    [dialogContent]
  );
  const isSymbolSearch = useMemo(
    () => dialogContent === DialogContentType.SymbolSearch,
    [dialogContent]
  );
  const isUploadData = useMemo(
    () => dialogContent === DialogContentType.UploadData,
    [dialogContent]
  );
  const isOrderActions = useMemo(
    () => dialogContent === DialogContentType.OrderActions,
    [dialogContent]
  );

  const { setUserProfile } = useContext(AuthContext);

  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);

  const displayCandlestickData = useMemo(
    () =>
      isBackTestMode
        ? candlestickData.slice(sliceLeft, sliceRight)
        : candlestickData,
    [candlestickData, isBackTestMode, sliceLeft, sliceRight]
  );

  useEffect(() => {
    dispatch(setCurrentCandle(displayCandlestickData[0]));
  }, [dispatch, displayCandlestickData]);

  // The list of drawed line series
  const [drawedLineList, setDrawedLineList] = useState<
    LineSeriesPartialOptions[]
  >([]);

  // The list of technical indicator lines
  const [technicalIndicatorLines, setTechnicalIndicatorLines] = useState<
    TechnicalIndicatorLine[]
  >([]);

  // dialog trigger
  const [dialogVisible, setDialogVisible] = useState(false);

  const getCandlestickData: () => Promise<any[]> = async () => {
    setCandlestickData(() => []);
    const res = await getKLines({
      symbol: currentSymbol?.id!,
      period: currentPeriod?.id!,
    });

    if (res?.status !== 200) {
      return toast.error(res.msg);
    }

    const data = res.data.map((item: any) => ({
      ...item,
      time: item.timestamp,
    }));
    setCandlestickData(() => data);

    return data;
  };

  const crosshairMoveHandler = (param: MouseEventParams<Time>) => {
    dispatch(setMouseMovingEventParam(param));
  };

  const chartClickHandler = (param: MouseEventParams<Time>) => {
    dispatch(setMouseClickEventParam(param));
  };

  const chartDblClickHandler = (param: MouseEventParams<Time>) => {
    dispatch(setMouseDblClickEventParam(param));
  };

  const cleanLineSeries = () => {
    const { chart, setLineId_equation, setChildSeries, childSeries } =
      tChartRef.current!;
    childSeries.forEach((series) => {
      if (!series.options().customType) return;

      if (series.options().customType === CustomLineSeriesType.Indicator) {
        return removeIndicator({
          chart,
          selectedIndicator: series,
          setTechnicalIndicatorLines,
        });
      }

      return removeSeries({
        chart,
        selectedSeries: series,
        setChildSeries,
        setDrawedLineList,
        setLineId_equation,
      });
    });
  };

  const [isResizing, setIsResizing] = useState(false);

  const dividerDragStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const [maxChartWidth, setMaxChartWidth] = useState<number>();
  const [tChartWidth, setTChartWidth] = useState<number>(0);

  const resizingAside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!mainWrapper.current || !dividerRef.current) return;

    if (isResizing && asideOpen) {
      const chartWidth = e.clientX - mainWrapper.current?.offsetLeft!;
      const realWidth =
        chartWidth > maxChartWidth! ? maxChartWidth! : chartWidth;
      setTChartWidth(realWidth);
    }

    if (tChartRef.current?.isResizing && bottomPanelOpen) {
      const chartHeight = e.clientY - tChartRef.current.wrapper?.offsetTop!;
      const realHeight =
        chartHeight > tChartRef.current.maxChartHeight
          ? tChartRef.current.maxChartHeight
          : chartHeight;
      tChartRef.current.setChartHeight(realHeight);
    }
  };

  const calculateMaxChartWidth = useCallback(() => {
    if (!mainWrapper?.current || !dividerRef?.current) return;
    const maxWidth =
      mainWrapper.current.offsetWidth - 288 - dividerRef.current.offsetWidth;
    setMaxChartWidth(maxWidth);
    setTChartWidth(maxWidth);
  }, []);

  const cancelResizing = () => {
    setIsResizing(false);
    tChartRef.current?.setIsResizing(false);
  };

  useEffect(() => {
    dispatch(fetchPeriods());
    dispatch(fetchSymbols());
    window.addEventListener("mouseup", cancelResizing);
    getProfile().then((res) => setUserProfile(res.data));
    return () => {
      window.removeEventListener("mouseup", cancelResizing);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("resize", calculateMaxChartWidth);

    return () => {
      window.removeEventListener("resize", calculateMaxChartWidth);
    };
  }, [calculateMaxChartWidth]);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;
    calculateMaxChartWidth();

    const { chart } = tChartRef.current!;
    // Subscribe event when chart init
    chart.subscribeCrosshairMove(throttle(crosshairMoveHandler, 100));
    chart.subscribeClick(chartClickHandler);
    chart.subscribeDblClick(chartDblClickHandler);

    return () => {
      chart.unsubscribeCrosshairMove(throttle(crosshairMoveHandler, 100));
      chart.unsubscribeClick(chartClickHandler);
      chart.unsubscribeDblClick(chartDblClickHandler);
    };
  }, [tChartRef.current?.chart]);

  // Clear dialog content when dialog close
  useEffect(() => {
    if (!dialogVisible) dispatch(setDialogContent(undefined));
  }, [dialogVisible]);

  // Monitor changes in the current period and symbol values
  useEffect(() => {
    if (!currentPeriod?.id || !currentSymbol?.id) return;
    isBackTestMode && dispatch(setIsBackTestMode(false));
    // 清除线
    cleanLineSeries();
    // 清除标记
    emittery?.emit(OnOrderMarker.removeAll);
    // 止损止盈的激活状态设置为false
    emittery?.emit(OnStopLossAndTakeProfit.reset);

    getCandlestickData().then((data: any[]) => {
      dispatch(setCandleDataSlice([0, data.length]));
      if (!data.length) return;
      dispatch(setHasVol(data.some((d) => !!d.volume)));
      emittery?.emit(OnCandlestickData.Loaded);
    });
  }, [currentPeriod, currentSymbol, emittery]);

  useEffect(() => {
    emittery?.on(OnContronPanel.cleanLineSeries, cleanLineSeries);
    return () => {
      emittery?.off(OnContronPanel.cleanLineSeries, cleanLineSeries);
    };
  }, [emittery]);

  return (
    <>
      <div
        className="h-full flex bg-slate-100 dark:bg-black flex-col gap-2"
        onMouseMove={resizingAside}
      >
        <Navbar
          className="h-11"
          setDialogVisible={setDialogVisible}
          dialogVisible={dialogVisible}
          tChartRef={tChartRef}
          setDrawedLineList={setDrawedLineList}
        />
        <main className="flex-1 flex overflow-hidden">
          {/* 左侧边栏 */}
          <LeftAsideBtns
            className="w-12 mr-2"
            tChartRef={tChartRef}
            setDrawedLineList={setDrawedLineList}
            setDialogVisible={setDialogVisible}
            setTechnicalIndicatorLines={setTechnicalIndicatorLines}
            setBottomPanelOpen={setBottomPanelOpen}
            bottomPanelOpen={bottomPanelOpen}
          />

          <div
            className="flex-1 flex bg-slate-100 dark:bg-black rounded-md overflow-hidden"
            ref={mainWrapper}
          >
            {/* Chart */}
            <TChart
              setDrawedLineList={setDrawedLineList}
              drawedLineList={drawedLineList}
              ref={tChartRef}
              setDialogVisible={setDialogVisible}
              dialogVisible={dialogVisible}
              width={tChartWidth}
              asideOpen={asideOpen}
              bottomPanelOpen={bottomPanelOpen}
            >
              {currentSymbol && (
                <CandlestickSeries seriesData={displayCandlestickData} />
              )}
              {drawedLineList.map((lineOption) => (
                <LineSeries
                  customSeriesOptions={lineOption}
                  key={lineOption.id}
                />
              ))}
              {technicalIndicatorLines.map((line) => (
                <LineSeries
                  customSeriesOptions={line.options}
                  key={line.options.id}
                  seriesData={line.data}
                />
              ))}
              <Tooltips
                productName={currentSymbol?.label!}
                tChartRef={tChartRef}
              />
            </TChart>
            {/* 滑块 */}
            <div
              className="w-2 bg-transparent cursor-e-resize flex-shrink-0"
              ref={dividerRef}
              onMouseDown={dividerDragStart}
            ></div>
            {/* 可伸缩侧边栏 */}
            {asideOpen && !!tChartWidth && (
              <Aside
                className={cn(
                  "bg-background rounded-md overflow-auto max-md:hidden p-2 flex-1 min-w-72"
                )}
                ref={asideRef}
                // setDrawedLineList={setDrawedLineList}
                tChartRef={tChartRef}
              />
            )}
          </div>
          {/* 右侧边栏 */}
          <RightAsideBtns
            className={cn("w-12 ml-2 max-md:ml-0", !asideOpen && "ml-0")}
            asideOpen={asideOpen}
            setAsideOpen={setAsideOpen}
          />
        </main>
      </div>

      <Dialog
        onOpenChange={setDialogVisible}
        open={dialogVisible}
        modal={!isTechnicalIndex && !isSymbolSearch && !isOrderActions}
      >
        <DialogContext.Provider
          value={{ setDialogVisible, tChartRef, setTechnicalIndicatorLines }}
        >
          {dialogVisible && (
            <CustomDialogContent
              dragConstraints={mainWrapper}
              motionDivClass={cn(
                (isTechnicalIndex || isSymbolSearch || isOrderActions) &&
                  "max-w-none w-fit"
              )}
              overlayClass={cn(
                (isSymbolSearch || isUploadData) && "bg-black/80"
              )}
            >
              {isDrawedLineSettings && <SeriesSettings />}
              {(isTechnicalIndex || isIndicatorSettings) && (
                <TechnicalIndexForm />
              )}
              {isSymbolSearch && <SymbolSearch />}
              {isUploadData && <UploadForm />}
              {isOrderActions && <OrderActions />}
            </CustomDialogContent>
          )}
        </DialogContext.Provider>
      </Dialog>
    </>
  );
};

export default Playground;
