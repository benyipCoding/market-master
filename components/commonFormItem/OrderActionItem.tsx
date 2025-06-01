import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MiddleLabel } from "@/constants/tradingAside";
import { Order } from "../interfaces/Playground";
import { Checkbox } from "../ui/checkbox";

interface OrderActionItemProps {
  id: string;
  label: string;
  order: Order | null;
}

const OrderActionItem: React.FC<OrderActionItemProps> = ({
  id,
  label,
  order,
}) => {
  return (
    <div className="form-item">
      <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          id={id}
          className="border-secondary-foreground dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
        />
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <Input type="number" />
        <Select
          value={MiddleLabel[1].value}
          // onValueChange={(width) => setLineWidth(width)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {MiddleLabel.map(({ value, label }) => (
              <SelectItem value={`${value}`} key={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrderActionItem;
