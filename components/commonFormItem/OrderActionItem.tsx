import React, { useEffect, useState } from "react";
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
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { CheckedState } from "@radix-ui/react-checkbox";

interface OrderActionItemProps {
  id: string;
  label: string;
  order: Order | null;
  prop: keyof Order;
}

const OrderActionItem: React.FC<OrderActionItemProps> = ({
  id,
  label,
  order,
  prop,
}) => {
  const { currentSymbol, avgAmplitude } = useSelector(
    (state: RootState) => state.fetchData
  );
  const [active, setActive] = useState<CheckedState>(false);
  const [inputValue, setInputValue] = useState("");

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setInputValue((e.target as HTMLInputElement).value);
  };

  useEffect(() => {
    if (!order) return;
    if (order[prop]) {
      setActive(true);
      setInputValue(`${order[prop]}`);
    } else {
      setActive(false);
    }
  }, [order, prop]);

  return (
    <div className="form-item">
      <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          id={id}
          className="border-secondary-foreground dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
          checked={active}
          onCheckedChange={(checked) => setActive(checked)}
        />
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <Input
          type="number"
          disabled={!active}
          value={inputValue}
          onInput={handleInput}
        />
        <Select
          disabled={!active}
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
