import { cn } from "@/lib/utils";
import React from "react";

interface RightAsideBtnsProps {
  className?: string;
}

const RightAsideBtns: React.FC<RightAsideBtnsProps> = ({ className }) => {
  return <div className={cn(className)}>RightAsideBtns</div>;
};

export default RightAsideBtns;
