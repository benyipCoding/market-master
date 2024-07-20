import {
  SeriesColors,
  LineWidthOptions,
  LineStyleOptions,
} from "@/constants/seriesOptions";
import { textCase, titleCase } from "@/utils/helpers";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  PropertySettingsFormProps,
  PropertySettingsFormValueType,
} from "./interfaces/SeriesSettings";
import { CardContent, CardFooter } from "./ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  DeepPartial,
  LineSeriesPartialOptions,
  LineStyle,
  LineWidth,
} from "lightweight-charts";
import { CommonFooter } from "./SeriesSettings";
import {
  EmitterEventType,
  EmitteryContext,
  OnApply,
} from "@/providers/EmitteryProvider";
import { cn } from "@/lib/utils";

const PropertySettingsForm: React.FC<PropertySettingsFormProps> = ({
  setDialogVisible,
}) => {
  const { selectedSeries } = useSelector((state: RootState) => state.common);
  const [formValue, setFormValue] = useState<PropertySettingsFormValueType>({
    seriesLabel: "",
    showLabel: false,
    seriesColor: "",
    lineWidth: "",
    lineStyle: "",
  });
  const { emittery } = useContext(EmitteryContext);
  const [trigger, setTrigger] = useState(0);

  const options = useMemo<LineSeriesPartialOptions>(
    () => selectedSeries?.options()!,
    [selectedSeries?.options(), trigger]
  );

  const formValueHasChanged = useMemo<boolean>(() => {
    if (!selectedSeries) return false;

    return [
      formValue.showLabel !== options.showLabel,
      formValue.seriesLabel !== options.customTitle,
      formValue.lineWidth !== `${(options.lineWidth as number) - 2}`,
      formValue.seriesColor !== options.color,
      formValue.lineStyle !== textCase(LineStyle[options.lineStyle!]),
    ].some(Boolean);
  }, [formValue, selectedSeries?.options()]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onApply();
    setDialogVisible(false);
  };

  const onApply = () => {
    if (!formValueHasChanged) return;

    const payload: LineSeriesPartialOptions & EmitterEventType = {
      id: options.id,
      color: formValue.seriesColor,
      customTitle: formValue.seriesLabel,
      lineWidth: +formValue.lineWidth as LineWidth,
      lineStyle: LineStyle[
        titleCase(formValue.lineStyle) as any
      ] as unknown as DeepPartial<LineStyle>,
      showLabel: formValue.showLabel,
      eventName: OnApply.Property,
    };

    emittery?.emit(OnApply.Property, payload);

    Promise.resolve().then(() => {
      setTrigger((prev) => prev + 1);
    });
  };

  useEffect(() => {
    if (!selectedSeries) return;

    Promise.resolve().then(() =>
      setFormValue({
        seriesLabel: options.customTitle!,
        showLabel: options.showLabel!,
        seriesColor: options.color!,
        lineWidth: `${(options.lineWidth as number) - 2}`,
        lineStyle: textCase(LineStyle[options.lineStyle!]),
      })
    );
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {/* Series label */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="seriesLabel" className="py-1 flex justify-between">
              Series Label
              {/* Extra checkbox */}
              <Label
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  !formValue.seriesLabel && "text-gray-500"
                )}
              >
                Show Label
                <Checkbox
                  disabled={!formValue.seriesLabel}
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
      <CardFooter className="flex justify-end relative items-center gap-2">
        <CommonFooter
          formValueHasChanged={formValueHasChanged}
          onCancel={() => setDialogVisible(false)}
          onApply={onApply}
          onSetDefault={() => {}}
        />
      </CardFooter>
    </form>
  );
};

export default PropertySettingsForm;
