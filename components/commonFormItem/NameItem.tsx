import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import { NameItemProps } from "../interfaces/CommonFormItem";

const NameItem: React.FC<NameItemProps> = ({
  inputValue,
  setInputValue,
  showExtraCheckbox = false,
  checked,
  onCheckedChange,
  placeholder,
  itemLabel,
  errorMessage,
}) => {
  return (
    <div className="form-item">
      <Label
        htmlFor="seriesLabel"
        className={cn(
          "py-1 flex justify-between",
          errorMessage && "text-destructive"
        )}
      >
        {itemLabel}
        {/* Extra checkbox */}
        {showExtraCheckbox && (
          <Label
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              !inputValue && "text-gray-500"
            )}
          >
            Show Label
            <Checkbox
              disabled={!inputValue}
              checked={checked}
              onCheckedChange={(checked) => onCheckedChange!(checked)}
            />
          </Label>
        )}
      </Label>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {errorMessage && (
        <p className="text-sm font-medium text-destructive select-none">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default NameItem;
