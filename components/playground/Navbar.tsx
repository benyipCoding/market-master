import { cn } from "@/lib/utils";
import React from "react";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return <nav className={cn(className)}>Navbar</nav>;
};

export default Navbar;
