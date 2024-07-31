import { cn } from "@/lib/utils";
import React from "react";
import { LeftAsideBtnsProps } from "../interfaces/Playground";
import { PiLineSegment } from "react-icons/pi";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const LeftAsideBtns: React.FC<LeftAsideBtnsProps> = ({ className }) => {
  const { isDrawing } = useSelector((state: RootState) => state.common);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "bg-background rounded-md flex-shrink-0 flex flex-col p-1",
          className
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={"ghost"}
              className={cn(
                "hover:bg-muted p-1",
                isDrawing && "bg-primary hover:bg-primary"
              )}
            >
              <PiLineSegment className="w-full h-full" />
              <span className="sr-only">Draw Line</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Draw Line (L)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default LeftAsideBtns;
