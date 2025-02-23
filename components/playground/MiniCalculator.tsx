import { cn } from "@/lib/utils";
import { Minus, Plus, RotateCcw } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface MiniCalculatorProps {
  showCalculator: boolean;
  setShowCalculator: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonItems = [
  {
    id: "-",
    label: <Minus size={18} />,
  },
  {
    id: "+",
    label: <Plus size={18} />,
  },
  {
    id: "1",
    label: "1",
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
    id: "clear",
    label: "C",
  },
  {
    id: "reset",
    label: <RotateCcw size={16} />,
  },
];

const MiniCalculator: React.FC<MiniCalculatorProps> = ({
  showCalculator,
  setShowCalculator,
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

  useEffect(() => {
    if (showCalculator) {
      document.addEventListener("click", closeByClickOutside);
    }
  }, [showCalculator]);

  return (
    <div
      className={cn(
        "absolute bg-secondary border rounded-lg right-2 top-[4.5rem] w-40 h-48 origin-top-right scale-0 transition-all duration-200 opacity-0 p-2 grid grid-cols-2 gap-2",
        showCalculator && "scale-100 opacity-100"
      )}
      ref={calculatorWrapper}
    >
      {ButtonItems.map((btn) => (
        <div
          key={btn.id}
          className={cn(
            "flex justify-center items-center border rounded-md border-gray-500 text-sm cursor-pointer bg-slate-500 hover:bg-slate-600 h-7",
            btn.id === "clear" && "text-base"
          )}
        >
          {btn.label}
        </div>
      ))}
    </div>
  );
};

export default MiniCalculator;
