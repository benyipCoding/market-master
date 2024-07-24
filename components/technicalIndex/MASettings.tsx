import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import CommonHeader from "./CommonHeader";
import { DialogContext } from "@/app/page";
import ColorSelector from "../commonFormItem/ColorSelector";
import LinePattern from "../commonFormItem/LinePattern";
import NameItem from "../commonFormItem/NameItem";
import PeriodItem, { CalculatePriceType } from "../commonFormItem/PeriodItem";
import { EMAFormValue } from "../interfaces/TechnicalIndexForm";
import { SeriesColorType } from "@/constants/seriesOptions";

const MASettings = () => {
  const { setDialogVisible } = useContext(DialogContext);

  const [formValue, setFormValue] = useState<EMAFormValue>({
    name: "",
    lineWidth: "2",
    lineStyle: "solid",
    period: "20",
    calculatePrice: "close",
    seriesColor: "#ffff00",
    indicator: "MA",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formValue);
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
