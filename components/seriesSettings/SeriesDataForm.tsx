import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Minus, Plus } from "lucide-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  SeriesDataFormProps,
  SeriesDataFormValueType,
} from "../interfaces/SeriesSettings";
import { CommonFooter } from "./SeriesSettings";
import { LineData, Time } from "lightweight-charts";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { produce } from "immer";
import { DialogContext } from "@/context/Dialog";

const FormItems = [
  {
    label: "Start Point",
    valueProp: "startPointValue",
    valueInputPlaceholder: "Start point value",
    timeProp: "startPointTime",
    timeInputPlaceholder: "Start point date",
  },
  {
    label: "End Point",
    valueProp: "endPointValue",
    valueInputPlaceholder: "End point value",
    timeProp: "endPointTime",
    timeInputPlaceholder: "End point date",
  },
];

const SeriesDataForm: React.FC<SeriesDataFormProps> = () => {
  const { setDialogVisible } = useContext(DialogContext);
  const { selectedSeries } = useSelector((state: RootState) => state.common);

  const [formValue, setFormValue] = useState<SeriesDataFormValueType>({
    startPointValue: "",
    startPointTime: "",
    endPointValue: "",
    endPointTime: "",
  });

  const formValueHasChanged = useMemo<boolean>(() => {
    if (!selectedSeries) return false;

    const seriesData = selectedSeries.data() as LineData<Time>[];
    return [
      formValue.startPointValue !== `${seriesData[0].value.toFixed(2)}`,
      formValue.endPointValue !== `${seriesData[1].value.toFixed(2)}`,
    ].some(Boolean);
  }, [formValue, selectedSeries]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formValue);
  };

  useEffect(() => {
    if (!selectedSeries) return;
    const seriesData = selectedSeries.data() as LineData<Time>[];
    setFormValue(
      produce(formValue, (formValue) => {
        formValue.startPointTime = seriesData[0].time as string;
        formValue.endPointTime = seriesData[1].time as string;
        formValue.startPointValue = `${seriesData[0].value.toFixed(2)}`;
        formValue.endPointValue = `${seriesData[1].value.toFixed(2)}`;
      })
    );
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <CardContent>
        <div className="grid w-full items-center gap-2">
          {/* Start point & End point */}
          {FormItems.map((item) => (
            <div className="form-item gap-1" key={item.label}>
              {/* Label */}
              <Label
                htmlFor="seriesLabel"
                className="py-1 flex justify-between"
              >
                {item.label}
              </Label>
              {/* Value */}
              <div className="flex w-full items-center gap-3">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  type="button"
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <Input
                  placeholder={item.valueInputPlaceholder}
                  value={formValue[item.valueProp]}
                  onChange={(e) =>
                    setFormValue({
                      ...formValue,
                      [item.valueProp]: e.target.value,
                    })
                  }
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
              {/* DateTime */}
              <div className={cn("grid gap-2")}>
                <Button
                  variant={"outline"}
                  className="active:scale-100"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formValue[item.timeProp]}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end relative items-center gap-2">
        <CommonFooter
          formValueHasChanged={formValueHasChanged}
          onCancel={() => setDialogVisible(false)}
          onApply={() => {}}
          onReset={() => {}}
        />
      </CardFooter>
    </form>
  );
};

export default SeriesDataForm;
