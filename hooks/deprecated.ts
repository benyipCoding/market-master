import {
  LineState,
  TrendType,
  AutomaticLinePoint,
  CustomLineSeriesType,
} from "./interfaces";

// 辅助函数，当前笔的方向在未来是否有可能成为线段
const canDrawSegment = (
  line: LineState,
  index: number,
  arr: LineState[],
  segmentTrend: TrendType | null,
  segmentStartIndex: number,
  segmentEndIndex: number
): [boolean, number] => {
  const currentTrend = line.trend;
  const currentStartPrice = line.startPoint.price;
  const currentEndPrice = line.endPoint.price;
  const prevLine = arr[index - 1];

  for (let i = index + 2; i < arr.length; i += 2) {
    const nextSameTrendLine = arr[i];
    const nextStartPrice = nextSameTrendLine.startPoint.price;
    const nextEndPrice = nextSameTrendLine.endPoint.price;

    // 1. 趋势不可能持续的情况
    const canNotGrow =
      currentTrend === TrendType.Up
        ? nextStartPrice < currentStartPrice && nextEndPrice < currentEndPrice
        : nextStartPrice > currentStartPrice && nextEndPrice > currentEndPrice;
    const canNotGrow2 =
      segmentTrend === TrendType.Up
        ? currentTrend !== segmentTrend && nextStartPrice > currentStartPrice
        : currentTrend !== segmentTrend && nextStartPrice < currentStartPrice;
    const canNotGrow3 = index - segmentStartIndex === 1 && segmentTrend;
    const canNotGrow4 = index < segmentEndIndex;

    if (canNotGrow || canNotGrow2 || canNotGrow3 || canNotGrow4)
      return [false, -1];

    // 2. 可持续情况一
    const canGrow1 =
      currentTrend === TrendType.Up
        ? nextStartPrice > currentStartPrice && nextEndPrice > currentEndPrice
        : nextStartPrice < currentStartPrice && nextEndPrice < currentEndPrice;
    if (canGrow1) return [true, i];

    // 3. 可持续情况二
    if (!prevLine || segmentTrend === line.trend) continue;
    const prevStartPrice = prevLine.startPoint.price;
    const canGrow2 =
      currentTrend === TrendType.Up
        ? currentEndPrice > prevStartPrice && nextEndPrice > prevStartPrice
        : currentEndPrice < prevStartPrice && nextEndPrice < prevStartPrice;
    if (canGrow2) return [true, i];
  }
  return [false, -1];
};

const generateLineSegment = (lineList: LineState[]): LineState[] => {
  let segmentTrend: TrendType | null = null;
  let segmentStart: AutomaticLinePoint | null = null;
  let segmentStartIndex: number = 0;
  let segmentEndIndex: number = 0;
  const segmentList: LineState[] = [];

  lineList.forEach((line, index, arr) => {
    const [canDraw, endIndex] = canDrawSegment(
      line,
      index,
      arr,
      segmentTrend,
      segmentStartIndex,
      segmentEndIndex
    );

    if (canDraw && !segmentTrend) {
      segmentStart = line.startPoint;
      segmentStartIndex = index;
      segmentTrend = line.trend;
      return;
    }

    if (canDraw && segmentTrend !== line.trend) {
      segmentList.push({
        startPoint: segmentStart!,
        endPoint: line.startPoint,
        trend: segmentTrend!,
        type: CustomLineSeriesType.SegmentDrawed,
      });
      segmentStart = line.startPoint;
      segmentStartIndex = index;
      segmentTrend = line.trend;
      segmentEndIndex = endIndex;
      return;
    }
  });

  return segmentList;
};
