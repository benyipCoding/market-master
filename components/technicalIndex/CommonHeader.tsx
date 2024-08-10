import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import React, { useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommonHeaderProps } from "../interfaces/TechnicalIndexForm";

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  titleClass,
  description,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <CardHeader>
      <CardTitle className={cn("relative pr-8 select-none", titleClass)}>
        {title}
        {description && (
          <TooltipProvider disableHoverableContent={true} delayDuration={0}>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger asChild>
                <span className="pointer-events-none absolute top-0 right-0"></span>
              </TooltipTrigger>
              <Info
                className="absolute top-0 right-0 text-gray-400 dark:text-gray-500 cursor-pointer"
                size={20}
                onClick={() => setTooltipOpen(true)}
              />
              <TooltipContent align="end">
                <p className="w-52 font-normal">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardTitle>
    </CardHeader>
  );
};

export default CommonHeader;
