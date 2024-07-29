import React, { useContext, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import CommonHeader from "./CommonHeader";
import ColorSelector from "../commonFormItem/ColorSelector";
import LinePattern from "../commonFormItem/LinePattern";
import NameItem from "../commonFormItem/NameItem";
import PeriodItem, {
  CalculatePriceType,
  PeriodItemRef,
} from "../commonFormItem/PeriodItem";
import { EMAFormValue } from "../interfaces/TechnicalIndexForm";
import { SeriesColorType } from "@/constants/seriesOptions";
import { DialogContext } from "@/context/Dialog";
import { TechnicalIndexFormContext } from "./TechnicalIndexForm";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { EmitteryContext } from "@/providers/EmitteryProvider";
import { CustomLineSeriesType } from "@/hooks/interfaces";
import { titleCase } from "@/utils/helpers";
import {
  LineSeriesPartialOptions,
  LineWidth,
  LineStyle,
  DeepPartial,
} from "lightweight-charts";

const MASettings = () => {
  const { setDialogVisible, tChartRef, setTechnicalIndicatorLines } =
    useContext(DialogContext);
  const { currentTab } = useContext(TechnicalIndexFormContext);
  const mainSeries = useMemo(
    () => tChartRef?.current?.childSeries[0],
    [tChartRef]
  );
  const { selectedIndicator } = useSelector((state: RootState) => state.common);

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
  const periodItemRef = useRef<PeriodItemRef>(null);

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO
    // console.log(formValue);
  };

  return (
    <>
      <CommonHeader
        title="Moving Average"
        description="A moving average is a technical indicator that investors and traders use to determine the trend direction of securities."
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

export default MASettings;
