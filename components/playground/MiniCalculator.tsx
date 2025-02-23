import { cn } from "@/lib/utils";
import { Minus, Plus, RotateCcw } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface MiniCalculatorProps {
  showCalculator: boolean;
  setShowCalculator: React.Dispatch<React.SetStateAction<boolean>>;
  element: HTMLInputElement | null;
  setUnitValue: React.Dispatch<React.SetStateAction<string>>;
}

enum OperationBtn {
  Plus = "+",
  Minus = "-",
  Clear = "clear",
  Reset = "reset",
}

const ButtonItems = [
  {
    id: OperationBtn.Minus,
    label: <Minus size={18} />,
  },
  {
    id: OperationBtn.Plus,
    label: <Plus size={18} />,
  },

  {
    id: "5",
    label: "5",
  },
  {
    id: "25",
    label: "25",
  },
  {
    id: "50",
    label: "50",
  },
  {
    id: "100",
    label: "100",
  },
  {
    id: "500",
    label: "500",
  },
  {
    id: "1000",
    label: "1000",
  },
  {
    id: OperationBtn.Clear,
    label: "C",
  },
  {
    id: OperationBtn.Reset,
    label: <RotateCcw size={16} />,
  },
];

const MiniCalculator: React.FC<MiniCalculatorProps> = ({
  showCalculator,
  setShowCalculator,
  element,
  setUnitValue,
}) => {
  const calculatorWrapper = useRef<HTMLDivElement>(null);

  const closeByClickOutside = (e: MouseEvent) => {
    const clickInside = calculatorWrapper.current?.contains(
      e.target as HTMLElement
    );
    if (!clickInside) {
      setShowCalculator(false);
      setTimeout(() => {
        document.removeEventListener("click", closeByClickOutside);
      }, 300);
    }
  };

  const btnEvent = (btnId: string) => {
    if (!element) return;
    element.focus();
    // 数字部分
    const isNum = !isNaN(Number(btnId));
    if (isNum)
      return setUnitValue((prev) => String(Number(prev) + Number(btnId)));

    // 非数字部分
    switch (btnId) {
      case OperationBtn.Plus:
        setUnitValue((prev) => String(Number(prev) + 1));
        break;

      case OperationBtn.Minus:
        setUnitValue((prev) => String(prev === "0" ? 0 : Number(prev) - 1));
        break;

      case OperationBtn.Clear:
        setUnitValue("0");
        break;

      case OperationBtn.Reset:
        setUnitValue("1");
        break;
    }
  };

  useEffect(() => {
    if (showCalculator) {
      document.addEventListener("click", closeByClickOutside);
    }
  }, [showCalculator]);

  return (
    <div
      className={cn(
        "absolute bg-secondary border rounded-lg right-2 top-[4.5rem] w-40 h-48 origin-top-right scale-0 transition-all duration-200 opacity-0 p-2 grid grid-cols-2 gap-2 z-10",
        showCalculator && "scale-100 opacity-100"
      )}
      ref={calculatorWrapper}
    >
      {ButtonItems.map((btn) => (
        <div
          key={btn.id}
          className={cn(
            "flex justify-center items-center border rounded-md border-gray-500 text-sm cursor-pointer bg-secondary hover:bg-slate-600 h-7 select-none",
            btn.id === "clear" && "text-base"
          )}
          onClick={() => btnEvent(btn.id)}
        >
          {btn.label}
        </div>
      ))}
    </div>
  );
};

export default MiniCalculator;
