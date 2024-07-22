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

interface CommonHeaderProps {
  title: string;
  titleClass?: string;
  description: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  titleClass,
  description,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <CardHeader>
      <CardTitle className={cn("relative", titleClass)}>
        {title}
        <TooltipProvider disableHoverableContent={true}>
          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
            <TooltipTrigger asChild>
              <span className="pointer-events-none absolute top-0 right-0"></span>
            </TooltipTrigger>
            <Info
              className="absolute top-0 right-0 text-gray-400 cursor-pointer"
              size={20}
              onClick={() => setTooltipOpen(true)}
            />
            <TooltipContent align="end">
              <p className="w-52">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardTitle>
    </CardHeader>
  );
};

export default CommonHeader;
