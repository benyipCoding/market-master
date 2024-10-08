import { cn } from "@/lib/utils";
import React, { useCallback, useEffect } from "react";
import { NavbarProps } from "../interfaces/Playground";
import { setSelectedIndicator, setSelectedSeries } from "@/store/commonSlice";
import { setDialogContent, DialogContentType } from "@/store/dialogSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import hotkeys from "hotkeys-js";
import { Badge } from "../ui/badge";
import { Hourglass, Search, Upload } from "lucide-react";
import { FcComboChart } from "react-icons/fc";
import { Button } from "../ui/button";
import { BiCandles } from "react-icons/bi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const Navbar: React.FC<NavbarProps> = ({
  className,
  setDialogVisible,
  dialogVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { dialogContent } = useSelector((state: RootState) => state.dialog);

  const openDialogHandler = (type: DialogContentType) => {
    if (dialogVisible && dialogContent !== type) return;
    dispatch(setSelectedIndicator(null));
    dispatch(setSelectedSeries(null));
    if (dialogVisible) dispatch(setDialogContent(undefined));
    else dispatch(setDialogContent(type));
    Promise.resolve().then(() => setDialogVisible((prev) => !prev));
  };

  const openTechnicalIndexDialog = useCallback(() => {
    openDialogHandler(DialogContentType.TechnicalIndex);
  }, [dialogVisible, dialogContent]);

  const openSymbolSearch = useCallback(() => {
    openDialogHandler(DialogContentType.SymbolSearch);
  }, [dialogVisible, dialogContent]);

  const openUploadForm = useCallback(() => {
    openDialogHandler(DialogContentType.UploadData);
  }, [dialogVisible, dialogContent]);

  useEffect(() => {
    hotkeys("i", openTechnicalIndexDialog);
    hotkeys("s", openSymbolSearch);
    hotkeys("u", openUploadForm);

    return () => {
      hotkeys.unbind("i");
      hotkeys.unbind("s");
      hotkeys.unbind("u");
    };
  }, [openTechnicalIndexDialog]);

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        className={cn(
          className,
          "flex items-center bg-background w-full rounded-md p-1 gap-4 relative"
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                "nav-item px-2 gap-2 active:scale-100 nav-item-divider",
                dialogContent === DialogContentType.SymbolSearch && "bg-muted"
              )}
              variant={"ghost"}
              onClick={openSymbolSearch}
            >
              <Search size={18} />
              XAUUSD
              <span className="sr-only">Symbol Search</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex">
            <p className="nav-item-divider">Symbol Search</p>
            <span className="short-cut">S</span>
          </TooltipContent>
        </Tooltip>

        {/* Period */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="nav-item px-2 gap-2 active:scale-100 nav-item-divider"
              variant={"ghost"}
            >
              <Hourglass size={20} />
              D1
              <span className="sr-only">Select Period</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>D1</TooltipContent>
        </Tooltip>

        {/* Candle shape */}
        <Button
          className="nav-item px-2 gap-2 active:scale-100 nav-item-divider"
          variant={"ghost"}
        >
          <BiCandles size={24} />
        </Button>

        {/* Indicators */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                "nav-item px-2 gap-2 active:scale-100 nav-item-divider",
                dialogContent === DialogContentType.TechnicalIndex && "bg-muted"
              )}
              variant={"ghost"}
              onClick={openTechnicalIndexDialog}
            >
              <FcComboChart size={24} />
              Indicators
              <span className="sr-only">Indicators, Metrics</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex">
            <p className="nav-item-divider">Indicators, Metrics</p>
            <span className="short-cut">I</span>
          </TooltipContent>
        </Tooltip>

        <div className="absolute right-14 h-full flex py-1 gap-4 items-center">
          {/* Upload data */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn("nav-item px-2")}
                onClick={openUploadForm}
              >
                <Upload size={20} />
                <span className="sr-only">Upload Data</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex">
              <p className="nav-item-divider">Upload Data</p>
              <span className="short-cut">U</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
};

export default Navbar;
