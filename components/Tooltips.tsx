import { RootState } from "@/store";
import clsx from "clsx";
import { produce } from "immer";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { CandlestickData, Time } from "lightweight-charts";
import { TooltipsProps } from "./interfaces/Tooltips";
import { titleCase } from "@/utils/helpers";
import dayjs from "dayjs";

const tooltipsOffset = {
  x: 5,
  y: 5,
};

const Tooltips: React.FC<TooltipsProps> = ({ productName, tChartRef }) => {
  const { mouseClickEventParam } = useSelector(
    (state: RootState) => state.common
  );

  const { isPreselect } = useSelector((state: RootState) => state.fetchData);

  const [position, setPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [currentCandlestick, setCurrentCandlestick] = useState<
    CandlestickData<Time> | undefined
  >(undefined);

  const [visible, setVisible] = useState(false);
  const tooltipsWrapper = useRef<HTMLDivElement>(null);
  const { selectedSeries, selectedIndicator } = useSelector(
    (state: RootState) => state.common
  );

  const closeByWheel = useCallback(() => {
    setVisible(false);

    setTimeout(() => {
      document.removeEventListener("wheel", closeByWheel);
    }, 50);
  }, []);

  const closeByClick = useCallback(() => {
    setVisible(false);

    setTimeout(() => {
      document.removeEventListener("mousedown", closeByClick);
    }, 50);
  }, []);

  useEffect(() => {
    if (!mouseClickEventParam?.point || !tChartRef.current) return;

    if (visible) return setVisible(false);

    // get candlestick data
    const { childSeries } = tChartRef.current;
    const data = mouseClickEventParam.seriesData.get(childSeries[0]) as
      | CandlestickData<Time>
      | undefined;

    if (!data) return;

    setCurrentCandlestick(data);
    if (!isPreselect) {
      setVisible(true);
    }
  }, [mouseClickEventParam]);

  useEffect(() => {
    setVisible(false);
  }, [selectedSeries, selectedIndicator]);

  useLayoutEffect(() => {
    if (!tooltipsWrapper.current || !mouseClickEventParam?.point) return;
    const { width, height } = tooltipsWrapper.current.getBoundingClientRect();
    if (!width || !height) return;

    setPosition(
      produce(position, (p) => {
        const posX = mouseClickEventParam.point?.x! + tooltipsOffset.x;
        const posY = mouseClickEventParam.point?.y! - height - tooltipsOffset.y;
        const totalX = posX + width;

        p.x =
          totalX < window.innerWidth
            ? posX
            : window.innerWidth - width - tooltipsOffset.x;
        p.y =
          mouseClickEventParam?.point?.y! >= height ? posY : tooltipsOffset.y;
      })
    );
  }, [currentCandlestick]);

  useEffect(() => {
    if (!visible) return;
    document.addEventListener("wheel", closeByWheel);
    setTimeout(() => {
      document.addEventListener("mousedown", closeByClick);
    });
  }, [visible]);

  return (
    <div
      className={clsx(
        "absolute w-fit z-10 p-[2px] rounded-sm overflow-hidden bg-conic-gradient"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        display: `${visible ? "block" : "none"}`,
      }}
      ref={tooltipsWrapper}
    >
      {currentCandlestick && (
        <div className="w-fit bg-white text-black dark:bg-black dark:text-white p-2 rounded-sm">
          <h1 className="mb-2 font-semibold">{productName}</h1>
          <p className="text-sm mb-1">
            {dayjs(currentCandlestick?.time as number).format(
              "YYYY-MM-DD HH:mm"
            )}
          </p>
          {["open", "high", "low", "close"].map((label) => (
            <p className="flex text-sm pointer-events-none" key={label}>
              <span className="w-14">{titleCase(label)}:</span>
              <span>{(currentCandlestick as any)[label]}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tooltips;
