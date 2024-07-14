import { DialogTitle } from "@/components/ui/dialog";
import React, { useContext, useState } from "react";
import { DialogHeader } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "./ui/button";
import {
  LineStyleOptions,
  LineWidthOptions,
  SeriesColors,
} from "@/constants/seriesOptions";
import { titleCase } from "@/utils/helpers";
import { SeriesSettingsFormValueType } from "./interfaces/SeriesSettings";
import { CustomDialogContentContext } from "./CustomDialogContent";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleMousePressing } from "@/store/commonSlice";
import { cn } from "@/lib/utils";

const PropertySettingsForm = () => {
  const [formValue, setFormValue] = useState<SeriesSettingsFormValueType>({
    seriesLabel: "",
    showLabel: false,
    seriesColor: "",
    lineWidth: "",
    lineStyle: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formValue);
  };

  return (
    <form onSubmit={onSubmit}>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {/* Series label */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="seriesLabel" className="py-1 flex justify-between">
              Series Label
              {/* Extra checkbox */}
              <Label className="flex items-center gap-2 cursor-pointer">
                Show Label
                <Checkbox
                  checked={formValue.showLabel}
                  onCheckedChange={(checked) =>
                    setFormValue({
                      ...formValue,
                      showLabel: checked as boolean,
                    })
                  }
                />
              </Label>
            </Label>
            <Input
              placeholder="Name of the series"
              value={formValue.seriesLabel}
              onChange={(e) =>
                setFormValue({
                  ...formValue,
                  seriesLabel: e.target.value,
                })
              }
            />
          </div>
          {/* Color picker */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="seriesColor" className="py-1">
              Series Color
            </Label>
            <Select
              value={formValue.seriesColor}
              onValueChange={(value) =>
                setFormValue({ ...formValue, seriesColor: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select colors..." />
              </SelectTrigger>
              <SelectContent position="popper">
                {SeriesColors.map((color) => (
                  <SelectItem value={color.value} key={color.label}>
                    <div className="flex items-center gap-2">
                      <i
                        className="inline-block w-4 h-4 rounded-full"
                        style={{ backgroundColor: `${color.value}` }}
                      ></i>
                      {titleCase(color.label)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Line pattern */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="lineStyle" className="py-1">
              Line Pattern
            </Label>
            <div className="flex items-center gap-3">
              {/* Line width */}
              <Select
                value={formValue.lineWidth}
                onValueChange={(lineWidth) =>
                  setFormValue({ ...formValue, lineWidth })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Line width" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {LineWidthOptions.map((width) => (
                    <SelectItem value={`${width}`} key={width}>
                      <div
                        className="w-36 border-black dark:border-white my-2"
                        style={{ borderTopWidth: `${width}px` }}
                      ></div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Line style */}
              <Select
                value={formValue.lineStyle}
                onValueChange={(lineStyle) =>
                  setFormValue({ ...formValue, lineStyle })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Line style" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {LineStyleOptions.map((borderStyle) => (
                    <SelectItem value={`${borderStyle}`} key={borderStyle}>
                      <div
                        className="w-36 border-black dark:border-white my-2 border-t-2"
                        style={{ borderStyle }}
                      ></div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      {/* Card footer */}
      <CommonFooter />
    </form>
  );
};

const SeriesDataForm = () => {
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
          {/* Series label */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="seriesLabel" className="py-1 flex justify-between">
              Start Point
            </Label>

            <div className="flex w-full  items-center space-x-2">
              <Input placeholder="Email" />
              <Button type="button">Subscribe</Button>
            </div>
          </div>
          {/* Color picker */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="seriesColor" className="py-1">
              Series Color
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select colors..." />
              </SelectTrigger>
              <SelectContent position="popper">
                {SeriesColors.map((color) => (
                  <SelectItem value={color.value} key={color.label}>
                    <div className="flex items-center gap-2">
                      <i
                        className="inline-block w-4 h-4 rounded-full"
                        style={{ backgroundColor: `${color.value}` }}
                      ></i>
                      {titleCase(color.label)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Line pattern */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="lineStyle" className="py-1">
              Line Pattern
            </Label>
            <div className="flex items-center gap-3">
              {/* Line width */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Line width" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {LineWidthOptions.map((width) => (
                    <SelectItem value={`${width}`} key={width}>
                      <div
                        className="w-36 border-black dark:border-white my-2"
                        style={{ borderTopWidth: `${width}px` }}
                      ></div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Line style */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Line style" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {LineStyleOptions.map((borderStyle) => (
                    <SelectItem value={`${borderStyle}`} key={borderStyle}>
                      <div
                        className="w-36 border-black dark:border-white my-2 border-t-2"
                        style={{ borderStyle }}
                      ></div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      {/* Card footer */}
      <CommonFooter />
    </form>
  );
};

const CommonFooter = () => {
  return (
    <CardFooter className="flex justify-end gap-2 relative">
      <Button type="button" variant={"ghost"} className="absolute left-6">
        Reset
      </Button>

      <Button type="button" variant={"secondary"}>
        Apply
      </Button>
      <Button type="button" variant={"outline"}>
        Cancel
      </Button>
      <Button>Confirm</Button>
    </CardFooter>
  );
};

const SeriesSettings = () => {
  const { dragControls } = useContext(CustomDialogContentContext);
  const { mousePressing } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<AppDispatch>();
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragControls?.start(event);
    dispatch(toggleMousePressing(true));
  };
  const endDrag = () => dispatch(toggleMousePressing(false));

  return (
    <>
      <DialogHeader
        className={cn("py-6 cursor-grab", mousePressing && "cursor-grabbing")}
        onPointerDown={startDrag}
        onPointerUp={endDrag}
      >
        <DialogTitle className="select-none">Series Settings</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="property" className="cursor-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="seriesData">Series Data</TabsTrigger>
        </TabsList>
        <TabsContent value="property">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Property settings</CardTitle>
            </CardHeader>
            <PropertySettingsForm />
          </Card>
        </TabsContent>
        <TabsContent value="seriesData">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Data settings</CardTitle>
            </CardHeader>
            <SeriesDataForm />
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SeriesSettings;
