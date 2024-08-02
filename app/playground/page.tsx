"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import {
  CandlestickData,
  LineSeriesPartialOptions,
  MouseEventParams,
  Time,
} from "lightweight-charts";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { throttle } from "@/utils/helpers";
import { TChartRef } from "@/components/interfaces/TChart";
import Buttons from "@/components/Buttons";
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
import { DialogContentType } from "@/store/dialogSlice";
import TechnicalIndexForm from "@/components/technicalIndex/TechnicalIndexForm";
import { cn } from "@/lib/utils";
import { DialogContext } from "@/context/Dialog";
import { TechnicalIndicatorLine } from "@/components/interfaces/TechnicalIndexForm";
import Navbar from "@/components/playground/Navbar";
import LeftAsideBtns from "@/components/playground/LeftAsideBtns";
import RightAsideBtns from "@/components/playground/RightAsideBtns";
import Aside from "@/components/playground/Aside";
import { AsideRef } from "@/components/interfaces/Playground";

const Playground = () => {
  // TChart component instance
  const tChartRef = useRef<TChartRef>(null);
  const mainWrapper = useRef<HTMLDivElement>(null);
  const asideRef = useRef<AsideRef>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [asideOpen, setAsideOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { dialogContent } = useSelector((state: RootState) => state.dialog);
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
    const res = await getDummyData();
    setCandlestickData(res.data);
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

  const toggleAsideOpen = () => {
    tChartRef.current?.setWidth("0px");
    setAsideOpen((prev) => !prev);
    Promise.resolve().then(() => calculateTChartWidth());
  };

  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;

    const { chart } = tChartRef.current!;
    // Subscribe event when chart init
    chart.subscribeCrosshairMove(throttle(crosshairMoveHandler, 100));
    chart.subscribeClick(chartClickHandler);
    chart.subscribeDblClick(chartDblClickHandler);
  }, [tChartRef.current?.chart]);

  return (
    <>
      <div className="h-full flex bg-slate-100 dark:bg-black flex-col gap-2">
        <Navbar
          className="h-10 flex items-center bg-background w-full rounded-md"
          setDialogVisible={setDialogVisible}
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
              <CandlestickSeries
                seriesData={candlestickData}
                customSeriesOptions={{ id: "XAU/USD", toFixedNum: 2 }}
              />
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
              <Tooltips productName="XAU/USD" tChartRef={tChartRef} />
            </TChart>
            <div
              className="w-2 bg-transparent cursor-col-resize"
              ref={dividerRef}
              onPointerDown={toggleAsideOpen}
            ></div>
            <Aside
              className="bg-background rounded-md overflow-auto"
              ref={asideRef}
              asideOpen={asideOpen}
            />
          </div>
          <RightAsideBtns
            className={cn(
              "bg-background w-12 rounded-md flex-shrink-0 ml-2",
              !asideOpen && "ml-0"
            )}
          />
        </main>
      </div>

      <Dialog
        onOpenChange={setDialogVisible}
        open={dialogVisible}
        modal={!isTechnicalIndex}
      >
        <DialogContext.Provider
          value={{ setDialogVisible, tChartRef, setTechnicalIndicatorLines }}
        >
          {dialogVisible && (
            <CustomDialogContent
              dragConstraints={mainWrapper}
              motionDivClass={cn(isTechnicalIndex && "max-w-none w-fit")}
            >
              {isDrawedLineSettings && <SeriesSettings />}
              {(isTechnicalIndex || isIndicatorSettings) && (
                <TechnicalIndexForm />
              )}
            </CustomDialogContent>
          )}
        </DialogContext.Provider>
      </Dialog>
    </>
  );
};

export default Playground;
