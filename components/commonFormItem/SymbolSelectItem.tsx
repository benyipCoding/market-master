import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";
import { SelectorItemProps } from "../interfaces/CommonFormItem";

const SymbolSelectItem: React.FC<SelectorItemProps> = ({
  itemLabel,
  selectValue,
  setSelectValue,
  options,
}) => {
  return (
    <div className="form-item">
      <Label className="py-1">{itemLabel}</Label>
      <Select
        value={selectValue}
        onValueChange={(value) => setSelectValue(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select symbol..." />
        </SelectTrigger>
        <SelectContent position="popper">
          {options.map((item) => (
            <SelectItem value={item.value} key={item.label}>
              <div className="flex items-center gap-2">{item.label}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SymbolSelectItem;
