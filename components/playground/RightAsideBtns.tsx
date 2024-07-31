import { cn } from "@/lib/utils";
import React from "react";
import { RightAsideBtnsProps } from "../interfaces/Playground";

const RightAsideBtns: React.FC<RightAsideBtnsProps> = ({ className }) => {
  return <div className={cn(className)}></div>;
};

export default RightAsideBtns;
