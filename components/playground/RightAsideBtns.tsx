import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { AsideContent, RightAsideBtnsProps } from "../interfaces/Playground";
import { Button } from "@/components/ui/button";
import {
  CircleDollarSign,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
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
  toggleAsideOpen,
}) => {
  const [currentAside, setCurrentAside] = useState<AsideContent>(
    AsideContent.Trade
  );

  useEffect(() => {
    hotkeys("a", toggleAsideOpen);

    return () => {
      hotkeys.unbind("a");
    };
  }, []);

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
              className={cn("hover:bg-muted p-1")}
            >
              {asideOpen ? (
                <PanelRightClose
                  className="w-full h-full"
                  onClick={toggleAsideOpen}
                />
              ) : (
                <PanelRightOpen
                  className="w-full h-full"
                  onClick={toggleAsideOpen}
                />
              )}
              <span className="sr-only">Aside</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex" side="left">
            <p className="nav-item-divider">Aside</p>
            <span className="short-cut">A</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={"ghost"}
              className={cn(
                "hover:bg-muted p-1 opacity-0 transition-all translate-x-12",
                asideOpen && "opacity-100 translate-x-0",
                currentAside === AsideContent.Trade && "bg-secondary"
              )}
              onClick={() => setCurrentAside(AsideContent.Trade)}
            >
              <CircleDollarSign className="w-full h-full" />
              <span className="sr-only">Trade</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex" side="left">
            <p>Trade</p>
            {/* <span className="short-cut">A</span> */}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default RightAsideBtns;
