import { cn } from "@/lib/utils";
import React from "react";
import { RightAsideBtnsProps } from "../interfaces/Playground";
import { Button } from "@/components/ui/button";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

const RightAsideBtns: React.FC<RightAsideBtnsProps> = ({
  className,
  asideOpen,
  toggleAsideOpen,
}) => {
  return (
    <div
      className={cn(
        className,
        "bg-background rounded-md flex-shrink-0 flex flex-col p-1 gap-3"
      )}
    >
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
          <PanelRightOpen className="w-full h-full" onClick={toggleAsideOpen} />
        )}
        <span className="sr-only">Open Aside</span>
      </Button>
    </div>
  );
};

export default RightAsideBtns;
