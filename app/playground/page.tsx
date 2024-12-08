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
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { fetchPeriods, fetchSymbols } from "@/store/fetchDataSlice";
import { getKLines } from "./actions/getKLines";
import { CustomLineSeriesType } from "@/hooks/interfaces";

const Playground = () => {
  // TChart component instance
  const tChartRef = useRef<TChartRef>(null);
  const mainWrapper = useRef<HTMLDivElement>(null);
  const asideRef = useRef<AsideRef>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [asideOpen, setAsideOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { dialogContent } = useSelector((state: RootState) => state.dialog);
  const { currentPeriod, currentSymbol } = useSelector(
    (state: RootState) => state.fetchData
  );
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

  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);

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

  const getCandlestickData = async () => {
    const res = await getKLines({
      symbol: currentSymbol?.id!,
      period: currentPeriod?.id!,
    });

    setCandlestickData(
      res.data.map((item: any) => ({
        ...item,
        time: item.timestamp,
      }))
    );
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

  const calculateTChartWidth = () => {
    const width =
      mainWrapper.current?.offsetWidth! -
      asideRef.current?.container?.offsetWidth! -
      dividerRef.current?.offsetWidth!;

    tChartRef.current?.setWidth(`${width}px`);
  };

  const resizeHandler = () => {
    tChartRef.current?.setWidth("0px");
    Promise.resolve().then(() => calculateTChartWidth());
  };

  const toggleAsideOpen = () => {
    resizeHandler();
    setAsideOpen((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener("resize", throttle(resizeHandler, 100));
    dispatch(fetchPeriods());
    dispatch(fetchSymbols());
    // dispatch(fetchProfile());
    return () => {
      window.removeEventListener("resize", throttle(resizeHandler, 100));
    };
  }, []);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;

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

    getCandlestickData();
  }, [currentPeriod, currentSymbol]);

  return (
    <>
      <div className="h-full flex bg-slate-100 dark:bg-black flex-col gap-2">
        <Navbar
          className="h-11"
          setDialogVisible={setDialogVisible}
          dialogVisible={dialogVisible}
        />
        <main className="flex-1 flex overflow-hidden">
          <LeftAsideBtns
            className="w-12 mr-2"
            tChartRef={tChartRef}
            setDrawedLineList={setDrawedLineList}
            setDialogVisible={setDialogVisible}
            setTechnicalIndicatorLines={setTechnicalIndicatorLines}
          />
          <div
            className="flex-1 flex bg-slate-100 dark:bg-black rounded-md overflow-hidden"
            ref={mainWrapper}
          >
            <TChart
              className="bg-background rounded-md z-10"
              setDrawedLineList={setDrawedLineList}
              drawedLineList={drawedLineList}
              ref={tChartRef}
              setDialogVisible={setDialogVisible}
              dialogVisible={dialogVisible}
            >
              {currentSymbol && (
                <CandlestickSeries seriesData={candlestickData} />
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
              <Tooltips productName="XAUUSD" tChartRef={tChartRef} />
            </TChart>

            <div
              className="w-2 bg-transparent cursor-col-resize"
              ref={dividerRef}
              onPointerDown={toggleAsideOpen}
            ></div>
            <Aside
              className={cn(
                "bg-background rounded-md overflow-auto max-md:hidden p-2",
                !asideOpen && "p-0"
              )}
              ref={asideRef}
              asideOpen={asideOpen}
              setDrawedLineList={setDrawedLineList}
              tChartRef={tChartRef}
            />
          </div>
          <RightAsideBtns
            className={cn("w-12 ml-2 max-md:ml-0", !asideOpen && "ml-0")}
            asideOpen={asideOpen}
            toggleAsideOpen={toggleAsideOpen}
          />
        </main>
      </div>

      <Dialog
        onOpenChange={setDialogVisible}
        open={dialogVisible}
        modal={!isTechnicalIndex && !SymbolSearch}
      >
        <DialogContext.Provider
          value={{ setDialogVisible, tChartRef, setTechnicalIndicatorLines }}
        >
          {dialogVisible && (
            <CustomDialogContent
              dragConstraints={mainWrapper}
              motionDivClass={cn(
                (isTechnicalIndex || isSymbolSearch) && "max-w-none w-fit"
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
            </CustomDialogContent>
          )}
        </DialogContext.Provider>
      </Dialog>
    </>
  );
};

export default Playground;
