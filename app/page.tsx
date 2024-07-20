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
import SeriesSettings from "@/components/SeriesSettings";
import CustomDialogContent from "@/components/CustomDialogContent";
import { DialogContentType } from "@/store/dialogSlice";
import TechnicalIndexForm from "@/components/TechnicalIndexForm";
import { cn } from "@/lib/utils";

const Home = () => {
  // TChart component instance
  const tChartRef = useRef<TChartRef>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { dialogContent } = useSelector((state: RootState) => state.dialog);
  const hideOverlay = useMemo(
    () => dialogContent === DialogContentType.DrawedLineSettings,
    [dialogContent]
  );

  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);

  // The list of drawed line series
  const [drawedLineList, setDrawedLineList] = useState<
    LineSeriesPartialOptions[]
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

  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;

    const { chart } = tChartRef.current!;
    // Subscribe event when chart init
    chart.subscribeCrosshairMove(throttle(crosshairMoveHandler, 0));
    chart.subscribeClick(chartClickHandler);
    chart.subscribeDblClick(chartDblClickHandler);
  }, [tChartRef.current?.chart]);

  return (
    <>
      <div className="h-full flex bg-black">
        <Buttons
          tChartRef={tChartRef}
          setDrawedLineList={setDrawedLineList}
          setDialogVisible={setDialogVisible}
        />
        <TChart
          className="w-full h-full m-auto"
          setDrawedLineList={setDrawedLineList}
          drawedLineList={drawedLineList}
          ref={tChartRef}
          setDialogVisible={setDialogVisible}
        >
          <CandlestickSeries
            seriesData={candlestickData}
            customSeriesOptions={{ id: "XAU/USD", toFixedNum: 2 }}
          />
          {drawedLineList.map((lineOption) => (
            <LineSeries customSeriesOptions={lineOption} key={lineOption.id} />
          ))}
          <Tooltips productName="XAU/USD" tChartRef={tChartRef} />
        </TChart>
      </div>

      <Dialog onOpenChange={setDialogVisible} open={dialogVisible}>
        {dialogVisible && (
          <CustomDialogContent
            dragConstraints={tChartRef.current?.chartContainer!}
            overlayClass={cn(hideOverlay && "bg-transparent")}
          >
            {dialogContent === DialogContentType.DrawedLineSettings && (
              <SeriesSettings setDialogVisible={setDialogVisible} />
            )}
            {dialogContent === DialogContentType.TechnicalIndex && (
              <TechnicalIndexForm setDialogVisible={setDialogVisible} />
            )}
          </CustomDialogContent>
        )}
      </Dialog>
    </>
  );
};

export default Home;
