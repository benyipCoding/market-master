import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { NavbarProps } from "../interfaces/Playground";
import { setSelectedIndicator } from "@/store/commonSlice";
import { setDialogContent, DialogContentType } from "@/store/dialogSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import hotkeys from "hotkeys-js";
import { Badge } from "../ui/badge";
import { Hourglass, Search } from "lucide-react";
import { FcComboChart } from "react-icons/fc";
import { Button } from "../ui/button";
import { BiCandles } from "react-icons/bi";

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

  return (
    <nav
      className={cn(
        className,
        "flex items-center bg-background w-full rounded-md p-1 gap-4"
      )}
    >
      {/* Google Avatar */}
      <div className="w-12 nav-item">
        <div className="w-7 h-7 bg-[#9f6360] rounded-full flex justify-center items-center relative">
          B
          <Badge
            variant={"destructive"}
            className="absolute -right-4 -top-2 text-xs flex justify-center items-center p-1 w-6 h-6 bg-red-600 text-white font-normal border-background border-2 pointer-events-none"
          >
            27
          </Badge>
        </div>
      </div>

      {/* Symbol */}
      <Button
        className="nav-item px-2 gap-2 active:scale-100 nav-item-divider"
        variant={"ghost"}
      >
        <Search size={18} />
        <span>XAU/USD</span>
      </Button>

      {/* Period */}
      <Button
        className="nav-item px-2 gap-2 active:scale-100 nav-item-divider"
        variant={"ghost"}
      >
        <Hourglass size={20} />
        <span>D1</span>
      </Button>

      {/* Candle shape */}
      <Button
        className="nav-item px-2 gap-2 active:scale-100 nav-item-divider"
        variant={"ghost"}
      >
        <BiCandles size={24} />
      </Button>

      {/* Indicators */}
      <Button
        className="nav-item px-2 gap-2 active:scale-100 nav-item-divider"
        variant={"ghost"}
      >
        <FcComboChart size={24} />
        <span className="">Indicators</span>
      </Button>
    </nav>
  );
};

export default Navbar;
