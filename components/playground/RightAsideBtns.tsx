import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useState } from "react";
import { AsideContent, RightAsideBtnsProps } from "../interfaces/Playground";
import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import hotkeys from "hotkeys-js";

const RightAsideBtns: React.FC<RightAsideBtnsProps> = ({
  className,
  asideOpen,
  setAsideOpen,
}) => {
  const [currentAside, setCurrentAside] = useState<AsideContent | "">(
    AsideContent.Trade
  );

  const switchToTradePanel = useCallback(() => {
    if (currentAside === AsideContent.Trade && asideOpen) {
      setAsideOpen(false);
      setCurrentAside("");
      return;
    }
    if (!asideOpen) setAsideOpen(true);

    setCurrentAside(AsideContent.Trade);
  }, [asideOpen, currentAside, setAsideOpen]);

  useEffect(() => {
    hotkeys("m", switchToTradePanel);

    return () => {
      hotkeys.unbind("m");
    };
  }, [switchToTradePanel]);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          className,
          "bg-background rounded-md flex-shrink-0 flex flex-col p-1 gap-3"
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={"ghost"}
              className={cn(
                "hover:bg-muted p-1",
                currentAside === AsideContent.Trade && "bg-secondary"
              )}
              onClick={switchToTradePanel}
            >
              <CircleDollarSign className="w-full h-full" />
              <span className="sr-only">Trade</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex" side="left">
            <p className="nav-item-divider">Trade</p>
            <span className="short-cut">M</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default RightAsideBtns;
