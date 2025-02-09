import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { RightAsideBtnsProps } from "../interfaces/Playground";
import { Button } from "@/components/ui/button";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
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
              variant={asideOpen ? "default" : "ghost"}
              className={cn(
                "hover:bg-muted p-1",
                asideOpen && "bg-primary hover:bg-primary"
              )}
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
      </div>
    </TooltipProvider>
  );
};

export default RightAsideBtns;
