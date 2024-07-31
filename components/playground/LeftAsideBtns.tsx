import { cn } from "@/lib/utils";
import React from "react";

interface LeftAsideBtnsProps {
  className?: string;
}

const LeftAsideBtns: React.FC<LeftAsideBtnsProps> = ({ className }) => {
  return <div className={cn(className)}>LeftAsideBtns</div>;
};

export default LeftAsideBtns;
