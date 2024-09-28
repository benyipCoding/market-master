import {
  CandlestickData,
  DeepPartial,
  ISeriesApi,
  LineStyleOptions,
  SeriesOptionsCommon,
  SeriesType,
  Time,
} from "lightweight-charts";
import { useEffect, useState } from "react";
import { CustomLineSeriesType } from "./interfaces";

interface AutomaticLineDrawingArgs {
  candlestickData: CandlestickData<Time>[];
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
  mainSeries: ISeriesApi<SeriesType, Time> | null;
}

export const useAutomaticLineDrawing = ({
  candlestickData,
  setDrawedLineList,
  mainSeries,
}: AutomaticLineDrawingArgs) => {
  // const [highPoint, setHighPoint] = useState({ index: 0, price: 0 });
  // const [lowPoint, setLowPoint] = useState({ index: 0, price: 9999999 });
  let highPoint = { price: 0, index: 0 };
  let lowPoint = { price: 999999, index: 999999 };

  const performDrawing = () => {
    // 1. 增加一个LineSeries组件到TChart里
    const lineId = `${mainSeries!.options().id}_line_${Date.now()}`;
    setDrawedLineList((prev) => [
      ...prev,
      {
        id: lineId,
        showLabel: false,
        customTitle: "",
        customType: CustomLineSeriesType.Drawed,
      },
    ]);
    // 2. 给这个LineSeries组件setData

    // for (let i = 0; i < candlestickData.length; i++) {
    //   const current = candlestickData[i];
    //   const max = Math.max(current.open, current.close);
    //   const min = Math.min(current.open, current.close);
    //   if (highPoint.price <= max) {
    //     highPoint = { price: max, index: i };
    //     // 高点在变动
    //     // 这根K线与最近的地点隔了多少根K
    //     const diff = i - lowPoint.index + 1;
    //     if (diff >= 5) {
    //       console.log("画线");
    //     }
    //     console.log();
    //   }
    //   if (lowPoint.price >= min) {
    //     lowPoint = { price: min, index: i };
    //     // 低点在变动
    //     const diff = i - highPoint.index + 1;
    //     if (diff >= 5) {
    //       console.log("画线");
    //     }
    //     console.log();
    //   }
    // }
  };

  return {
    performDrawing,
  };
};
