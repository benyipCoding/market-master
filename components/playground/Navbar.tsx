import { cn } from "@/lib/utils";
import React from "react";
import { NavbarProps } from "../interfaces/Playground";

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return <nav className={cn(className)}>Navbar</nav>;
};

export default Navbar;
