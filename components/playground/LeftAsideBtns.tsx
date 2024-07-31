import { cn } from "@/lib/utils";
import React from "react";
import { LeftAsideBtnsProps } from "../interfaces/Playground";

const LeftAsideBtns: React.FC<LeftAsideBtnsProps> = ({ className }) => {
  return <div className={cn(className)}></div>;
};

export default LeftAsideBtns;
