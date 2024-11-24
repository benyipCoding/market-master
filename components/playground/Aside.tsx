"use client";
import { cn } from "@/lib/utils";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { AsideRef, AsideProps } from "../interfaces/Playground";
import { Button } from "../ui/button";
import { useAutomaticLineDrawing } from "@/hooks/useAutomaticLineDrawing";
import Loading from "../Loading";
import { toast } from "sonner";
import { LoginTest } from "@/app/auth/login/login";
import { getMe } from "@/app/auth/login/getMe";
import { Tokens } from "@/utils/cookieHelper";
import { getKLines, ListKLineDto } from "@/app/playground/actions/getKLines";
import { cleanData } from "@/app/playground/actions/cleanData";
import { CustomLineSeriesType, LineState, TrendType } from "@/hooks/interfaces";

const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, asideOpen, setDrawedLineList, tChartRef },
  ref
) => {
  const asideRef = useRef<HTMLDivElement>(null);

  const width = useMemo<string>(
    () => (asideOpen ? "19rem" : "0rem"),
    [asideOpen]
  );

  const {
    performDrawing,
    autoDrawing,
    deleteLines,
    drawSegment,
    setLineList,
    generateLineSegment,
  } = useAutomaticLineDrawing({
    setDrawedLineList,
    tChartRef,
  });

  const login = async () => {
    const payload = {
      email: "benyip5207@gmail.com",
      password: "5207logiNN",
    };

    const res = await LoginTest<Tokens>(payload);
    if (res?.status !== 200) return toast.error(res.msg);
    console.log(res.data);
  };

  const getMeAction = async () => {
    const res = await getMe();
    if (res.status !== 200) return toast.error(res.msg);
    console.log(res.data);
  };

  const getKLineDataAction = async () => {
    const params: ListKLineDto = {
      symbol: 1,
      period: 1,
    };

    const res = await getKLines(params);
    if (res.status !== 200) return toast.error(res.msg);
    console.log(res.data);
  };

  const cleanDataAction = async () => {
    const res = await cleanData();
    console.log(res);
  };

  const getSegmentList = () => {
    const dataset = tChartRef.current?.childSeries.map((series) =>
      series.data()
    );
    dataset?.shift();
    dataset?.sort((a, b) => (a[0].time as number) - (b[0].time as number));
    const segmentList = dataset?.map((data) => ({
      startPoint: { price: data[0].customValues?.price!, time: data[0].time },
      endPoint: { price: data[1].customValues?.price!, time: data[1].time },
      type: CustomLineSeriesType.SegmentDrawed,
      trend:
        data[1].customValues?.price! > data[0].customValues?.price!
          ? TrendType.Up
          : TrendType.Down,
    }));
    return segmentList;
  };

  const drawGreateSegment = () => {
    const segmentList = getSegmentList();
    const greateSegmentList = generateLineSegment(
      segmentList as LineState[],
      CustomLineSeriesType.GreatSegmentDrawed
    );

    setLineList(greateSegmentList);
  };

  useImperativeHandle(ref, () => ({
    container: asideRef.current,
    deleteLines,
  }));

  return (
    <div className={cn(className)} ref={asideRef} style={{ width }}>
      {asideOpen && (
        <div className="flex flex-col gap-4">
          <Button onClick={() => performDrawing()} disabled={autoDrawing}>
            {autoDrawing ? <Loading /> : "Automatic Line"}
          </Button>
          <Button onClick={drawSegment} disabled={autoDrawing}>
            {autoDrawing ? <Loading /> : "Auto draw segment"}
          </Button>
          <Button
            onClick={() => deleteLines(CustomLineSeriesType.AutomaticDrawed)}
            disabled={autoDrawing}
            variant={"destructive"}
          >
            Delete Base Line
          </Button>
          <Button variant={"outline"} onClick={login}>
            登录测试按钮
          </Button>
          {/* <Button variant={"outline"} onClick={getMeAction}>
            Get Me
          </Button> */}
          {/* <Button variant={"outline"} onClick={getKLineDataAction}>
            Get KLine Data
          </Button> */}
          {/* <Button variant={"destructive"} onClick={cleanDataAction}>
            Delete meaningless data
          </Button> */}
          <Button variant={"default"} onClick={getSegmentList}>
            获取当前线段数组
          </Button>
          <Button variant={"default"} onClick={drawGreateSegment}>
            Draw greate segment
          </Button>
        </div>
      )}
    </div>
  );
};

export default forwardRef(Aside);
