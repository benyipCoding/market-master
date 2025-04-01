import { cn } from "@/lib/utils";
import React, { useCallback, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setCurrentAside } from "@/store/asideSlice";

const RightAsideBtns: React.FC<RightAsideBtnsProps> = ({
  className,
  asideOpen,
  setAsideOpen,
}) => {
  const { currentAside } = useSelector((state: RootState) => state.aside);
  const dispatch = useDispatch<AppDispatch>();

  const switchToTradePanel = useCallback(() => {
    if (currentAside === AsideContent.Trade && asideOpen) {
      setAsideOpen(false);
      dispatch(setCurrentAside(""));
      return;
    }
    if (!asideOpen) setAsideOpen(true);

    dispatch(setCurrentAside(AsideContent.Trade));
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
