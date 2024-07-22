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
  return (
    <CardHeader>
      <CardTitle className={cn("relative", titleClass)}>
        {title}
        <TooltipProvider disableHoverableContent={true}>
          <Tooltip defaultOpen={false} disableHoverableContent={true}>
            <TooltipTrigger asChild>
              <Info
                className="absolute top-0 right-0 text-gray-400 cursor-pointer"
                size={20}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-52">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardTitle>
    </CardHeader>
  );
};

export default CommonHeader;
