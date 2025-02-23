import React, { useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

const MiddleLabel = ["Ticks", "Price", "USD", "%"];

const ControlItem: React.FC<{ index: number; checked: boolean }> = ({
  index,
  checked,
}) => {
  const isFirst = index === 0;
  const isLast = index === MiddleLabel.length - 1;

  const [inputValue, setInputValue] = useState("123");

  return (
    <div
      className={cn(
        "h-8 border-l-[1px] border-r-[1px] border-t-[1px] flex items-center",
        isFirst && "rounded-tl-lg rounded-tr-lg",
        isLast && "rounded-bl-lg rounded-br-lg border-b-[1px]"
      )}
    >
      <Input
        className={cn(
          "text-gray-400 border-none max-h-full w-full",
          checked && "text-white"
        )}
        value={inputValue}
        onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
      />
    </div>
  );
};

const BracketControl: React.FC<{ title: string }> = ({ title }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex-1">
      {/* Title */}
      <Label
        htmlFor={title}
        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
      >
        <Checkbox
          id={title}
          className="border-secondary-foreground dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
          onCheckedChange={(state) => setChecked(state as boolean)}
          checked={checked}
        />
        <span className="text-sm">{title}</span>
        <span className="sr-only">{title}</span>
      </Label>

      {/* Controller */}
      <div className={cn("text-sm mt-3")}>
        {MiddleLabel.map((label, index) => (
          <ControlItem key={label} index={index} checked={checked} />
        ))}
      </div>
    </div>
  );
};

const Middle = () => {
  return (
    <div className="w-[20%] relative">
      <div className="absolute bottom-0 w-full flex flex-col">
        {MiddleLabel.map((label) => (
          <div
            key={label}
            className="h-8 flex items-center justify-center text-xs text-gray-400"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const LossAndProfit = () => {
  return (
    <div className="flex">
      {/* Stop Loss */}
      <BracketControl title="Stop Loss" />

      {/* Middle */}
      <Middle />

      {/* Take Profit */}
      <BracketControl title="Take Profit" />
    </div>
  );
};

export default LossAndProfit;
