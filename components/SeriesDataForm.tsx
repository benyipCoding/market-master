import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "./ui/card";
import { SeriesDataFormValueType } from "./interfaces/SeriesSettings";
import { format } from "date-fns";

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

const SeriesDataForm = () => {
  const [formValue, setFormValue] = useState<SeriesDataFormValueType>({
    startPointValue: "",
    startPointTime: undefined,
    endPointValue: "",
    endPointTime: undefined,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formValue);
  };

  useEffect(() => {
    console.log("sasasa");
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <CardContent>
        <div className="grid w-full items-center gap-2">
          {/* Start point & End point */}
          {FormItems.map((item) => (
            <div className="flex flex-col space-y-1.5 gap-1" key={item.label}>
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
                  variant="outline"
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
                  variant="outline"
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
                  disabled
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formValue[item.timeProp] ? (
                    format(formValue[item.timeProp], "yyyy-MM-dd HH:mm:ss")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </form>
  );
};

export default SeriesDataForm;
