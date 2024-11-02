import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useMemo } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { setCurrentPeriod } from "@/store/fetchDataSlice";

const Navbar: React.FC<NavbarProps> = ({
  className,
  setDialogVisible,
  dialogVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { dialogContent } = useSelector((state: RootState) => state.dialog);

  const { periods, currentPeriod, currentSymbol } = useSelector(
    (state: RootState) => state.fetchData
  );

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
              {currentSymbol?.label}
              <span className="sr-only">Symbol Search</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex">
            <p className="nav-item-divider">Symbol Search</p>
            <span className="short-cut">S</span>
          </TooltipContent>
        </Tooltip>

        {/* Period */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="nav-item px-2 gap-2 active:scale-100 nav-item-divider w-20 text-md"
              variant={"ghost"}
            >
              <Hourglass size={20} />
              {currentPeriod?.label}
              <span className="sr-only">Select Period</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-fit">
            <ScrollArea className="h-72 rounded-md pr-3">
              <DropdownMenuRadioGroup
                value={`${currentPeriod?.id}`}
                onValueChange={(value) => dispatch(setCurrentPeriod(value))}
              >
                {periods?.map((p) => (
                  <DropdownMenuRadioItem
                    value={`${p.id}`}
                    key={p.id}
                    className="cursor-pointer"
                  >
                    {p.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

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
