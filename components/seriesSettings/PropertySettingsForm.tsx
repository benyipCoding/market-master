import { textCase, titleCase } from "@/utils/helpers";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  PropertySettingsFormProps,
  PropertySettingsFormValueType,
} from "../interfaces/SeriesSettings";
import { CardContent, CardFooter } from "../ui/card";
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
import LinePattern from "../commonFormItem/LinePattern";
import ColorSelector from "../commonFormItem/ColorSelector";
import NameItem from "../commonFormItem/NameItem";

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

    if (!payload.customTitle && payload.showLabel) {
      payload.showLabel = false;
      setFormValue({
        ...formValue,
        showLabel: false,
      });
    }

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
          <NameItem
            itemLabel="Series Label"
            inputValue={formValue.seriesLabel}
            setInputValue={(seriesLabel) =>
              setFormValue({ ...formValue, seriesLabel })
            }
            checked={formValue.showLabel}
            onCheckedChange={(showLabel) =>
              setFormValue({ ...formValue, showLabel: showLabel as boolean })
            }
            showExtraCheckbox={true}
            placeholder="Name of the series"
          />
          {/* Color selector */}
          <ColorSelector
            seriesColor={formValue.seriesColor}
            setSeriesColor={(seriesColor) =>
              setFormValue({ ...formValue, seriesColor })
            }
          />
          {/* Line pattern */}
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
