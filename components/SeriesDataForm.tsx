import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { CommonFooter } from "./SeriesSettings";
import { CardContent } from "./ui/card";
import { format } from "date-fns";
import { SeriesDataFormValueType } from "./interfaces/SeriesSettings";

const ICON_SIZE = 20;

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
                <Button type="button" className="rounded-sm" size="sm">
                  <FaMinus size={ICON_SIZE} />
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
                <Button type="button" className="rounded-sm" size="sm">
                  <FaPlus size={ICON_SIZE} />
                </Button>
              </div>
              {/* DateTime */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal active:scale-100",
                        !formValue[item.timeProp] && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formValue[item.timeProp] ? (
                        format(formValue[item.timeProp], "yyyy-MM-dd HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-80 p-2 flex flex-col items-center">
                    <div className="relative w-full">
                      <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={item.timeInputPlaceholder}
                        className="pl-8"
                      />
                    </div>
                    <Calendar
                      mode="single"
                      selected={formValue[item.timeProp]}
                      onSelect={(date) =>
                        setFormValue({ ...formValue, [item.timeProp]: date })
                      }
                      initialFocus
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      className="flex-1 flex justify-center"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {/* Card footer */}
      <CommonFooter />
    </form>
  );
};

export default SeriesDataForm;
