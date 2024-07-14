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

const SeriesDataForm = () => {
  const [date, setDate] = React.useState<Date>();

  const [formValue, setFormValue] = useState({
    startPointValue: "",
    startPointTime: "",
    endPointValue: "",
    endPointTime: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formValue);
  };

  return (
    <form onSubmit={onSubmit}>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5 gap-2">
            <Label htmlFor="seriesLabel" className="py-1 flex justify-between">
              Start Point
            </Label>
            {/* Start point value */}
            <div className="flex w-full items-center gap-3">
              <Button type="button" className="rounded-sm" size="sm">
                <FaMinus size={20} />
              </Button>
              <Input placeholder="Start point value" />
              <Button type="button" className="rounded-sm" size="sm">
                <FaPlus size={20} />
              </Button>
            </div>
            <div className="">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal active:scale-100",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "yyyy-MM-dd HH:mm:ss")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-2 flex flex-col items-center">
                  <div className="relative w-full">
                    <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Pick a date" className="pl-8" />
                  </div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
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
        </div>
      </CardContent>
      {/* Card footer */}
      <CommonFooter />
    </form>
  );
};

export default SeriesDataForm;
