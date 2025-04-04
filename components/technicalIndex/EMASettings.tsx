import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import CommonHeader from "./CommonHeader";
import LinePattern from "../commonFormItem/LinePattern";
import NameItem from "../commonFormItem/NameItem";
import PeriodItem, {
  CalculatePriceType,
  PeriodItemRef,
} from "../commonFormItem/PeriodItem";
import ColorSelector from "../commonFormItem/ColorSelector";
import { EMAFormValue } from "../interfaces/TechnicalIndexForm";
import { SeriesColorType } from "@/constants/seriesOptions";
import { DialogContext } from "@/context/Dialog";
import { TechnicalIndexFormContext } from "./TechnicalIndexForm";
import {
  CandlestickData,
  DeepPartial,
  LineData,
  LineSeriesPartialOptions,
  LineStyle,
  LineWidth,
  Time,
} from "lightweight-charts";
import { calculateEMA } from "@/utils/formulas";
import { textCase, titleCase } from "@/utils/helpers";
import { CustomLineSeriesType } from "@/hooks/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { EmitteryContext, OnApply } from "@/providers/EmitteryProvider";
import { setDialogContent, setRecentlyIndicator } from "@/store/dialogSlice";

const EMASettings = () => {
  const { setDialogVisible, tChartRef, setTechnicalIndicatorLines } =
    useContext(DialogContext);
  const { currentTab } = useContext(TechnicalIndexFormContext);
  const { selectedIndicator } = useSelector((state: RootState) => state.common);
  const mainSeries = useMemo(
    () => tChartRef?.current?.childSeries[0],
    [tChartRef]
  );
  const periodItemRef = useRef<PeriodItemRef>(null);

  const [formValue, setFormValue] = useState<EMAFormValue>({
    id: "",
    name: "",
    lineWidth: "1",
    lineStyle: "solid",
    period: "20",
    calculatePrice: "close",
    seriesColor: "#ffff00",
    indicator: currentTab,
  });
  const { emittery } = useContext(EmitteryContext);
  const dispatch = useDispatch<AppDispatch>();

  const generateOptions = (): LineSeriesPartialOptions => ({
    id: selectedIndicator
      ? selectedIndicator.options().id
      : `${formValue.indicator}_${mainSeries?.options().id}_${Date.now()}`,
    customTitle: formValue.name,
    lineWidth: +formValue.lineWidth as LineWidth,
    lineStyle: LineStyle[
      titleCase(formValue.lineStyle) as any
    ] as unknown as DeepPartial<LineStyle>,
    showLabel: false,
    color: formValue.seriesColor,
    crosshairMarkerVisible: false,
    customType: CustomLineSeriesType.Indicator,
    indicator: formValue.indicator,
    period: +formValue.period,
    calculatePrice: formValue.calculatePrice,
    pointMarkersVisible: false,
  });

  const addIndicator = () => {
    const prices: LineData<Time>[] = (
      mainSeries?.data() as CandlestickData<Time>[]
    ).map((item) => ({
      time: item.time,
      value: item[formValue.calculatePrice],
    }));

    const emaData = calculateEMA(
      prices,
      +formValue.period,
      mainSeries?.options().toFixedNum!
    );

    const options = generateOptions();
    setTechnicalIndicatorLines((prev) => [...prev, { options, data: emaData }]);
  };

  const editIndicator = () => {
    if (!selectedIndicator) return;
    let emaData: LineData<Time>[] =
      selectedIndicator.data() as LineData<Time>[];

    const options = generateOptions();
    emittery?.emit(OnApply.Property, {
      ...options,
      eventName: OnApply.Property,
    });

    if (
      selectedIndicator.options().period !== +formValue.period ||
      selectedIndicator.options().calculatePrice !== formValue.calculatePrice
    ) {
      const prices: LineData<Time>[] = (
        mainSeries?.data() as CandlestickData<Time>[]
      ).map((item) => ({
        time: item.time,
        value: item[formValue.calculatePrice],
      }));

      emaData = calculateEMA(
        prices,
        +formValue.period,
        mainSeries?.options().toFixedNum!
      );

      emittery?.emit(OnApply.Data, {
        id: selectedIndicator.options().id,
        data: emaData,
        eventName: OnApply.Data,
      });
    }

    setTechnicalIndicatorLines((prev) =>
      prev.map((item) =>
        item.options.id === options.id
          ? { options, data: emaData }
          : { ...item }
      )
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate period
    const valid = periodItemRef.current?.validate(formValue.period);
    if (!valid) return;

    if (!selectedIndicator) addIndicator();
    else editIndicator();

    dispatch(setRecentlyIndicator(currentTab));
    setDialogVisible(false);
  };

  useEffect(() => {
    if (!selectedIndicator) {
      setFormValue({
        ...formValue,
        name: `${formValue.indicator}_${mainSeries?.options().id}`,
      });
    } else {
      const options = selectedIndicator.options() as LineSeriesPartialOptions;

      Promise.resolve().then(() => {
        setFormValue({
          id: options.id!,
          name: options.customTitle!,
          lineWidth: `${(options.lineWidth as number) - 2}`,
          lineStyle: textCase(LineStyle[options.lineStyle!]),
          period: `${options.period!}`,
          calculatePrice: options.calculatePrice!,
          seriesColor: options.color! as SeriesColorType,
          indicator: options.indicator!,
        });
      });
    }
  }, [selectedIndicator]);

  return (
    <>
      <CommonHeader
        title="Exponential Moving Average"
        description="EMA is a type of moving average (MA) that places a greater weight and significance on the most recent data points."
      />
      <form onSubmit={onSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <NameItem
              itemLabel="Indicator Name"
              placeholder="Name of the indicator"
              inputValue={formValue.name}
              setInputValue={(name) => setFormValue({ ...formValue, name })}
            />

            <PeriodItem
              period={formValue.period}
              setPeriod={(period) => setFormValue({ ...formValue, period })}
              calculatePrice={formValue.calculatePrice}
              setCalculatePrice={(price) =>
                setFormValue({
                  ...formValue,
                  calculatePrice: price as CalculatePriceType,
                })
              }
              ref={periodItemRef}
            />

            <ColorSelector
              seriesColor={formValue.seriesColor}
              setSeriesColor={(color) =>
                setFormValue({
                  ...formValue,
                  seriesColor: color as SeriesColorType,
                })
              }
            />

            <LinePattern
              lineWidth={formValue.lineWidth}
              lineStyle={formValue.lineStyle}
              setLineWidth={(lineWidth) =>
                setFormValue({ ...formValue, lineWidth })
              }
              setLineStyle={(lineStyle) =>
                setFormValue({ ...formValue, lineStyle })
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => setDialogVisible(false)}
          >
            Cancel
          </Button>
          <Button>Confirm</Button>
        </CardFooter>
      </form>
    </>
  );
};

export default EMASettings;
