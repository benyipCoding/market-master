import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { NavbarProps } from "../interfaces/Playground";
import { setSelectedIndicator } from "@/store/commonSlice";
import { setDialogContent, DialogContentType } from "@/store/dialogSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import hotkeys from "hotkeys-js";

const Navbar: React.FC<NavbarProps> = ({ className, setDialogVisible }) => {
  const dispatch = useDispatch<AppDispatch>();

  const openTechnicalIndexDialog = () => {
    dispatch(setSelectedIndicator(null));
    dispatch(setDialogContent(DialogContentType.TechnicalIndex));
    Promise.resolve().then(() => setDialogVisible((prev) => !prev));
  };

  useEffect(() => {
    hotkeys("i", openTechnicalIndexDialog);

    return () => {
      hotkeys.unbind("i");
    };
  }, []);

  return <nav className={cn(className)}></nav>;
};

export default Navbar;
