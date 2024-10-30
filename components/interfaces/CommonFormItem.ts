import { CheckedState } from "@radix-ui/react-checkbox";

export interface LinePatternProps {
  lineWidth: string;
  setLineWidth: (width: string) => void;
  lineStyle: string;
  setLineStyle: (style: string) => void;
}

export interface ColorSelectorProps {
  seriesColor: string;
  setSeriesColor: (color: string) => void;
}

export interface NameItemProps {
  itemLabel: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  showExtraCheckbox?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: CheckedState) => void;
  placeholder?: string;
  errorMessage?: string;
}

export interface SelectorItemProps {
  itemLabel: string;
  selectValue: string;
  setSelectValue: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}
