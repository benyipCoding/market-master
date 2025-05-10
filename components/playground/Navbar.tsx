import { cn } from "@/lib/utils";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NavbarProps, OperationMode } from "../interfaces/Playground";
import { setSelectedIndicator, setSelectedSeries } from "@/store/commonSlice";
import { setDialogContent, DialogContentType } from "@/store/dialogSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import hotkeys from "hotkeys-js";
import { Badge } from "../ui/badge";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  CalendarSearch,
  Hourglass,
  Search,
  Upload,
} from "lucide-react";
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
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import {
  setBackTestRecordKey,
  setCandleDataSlice,
  setCurrentPeriod,
  setCurrentSymbol,
  setIsBackTestMode,
  setIsPreselect,
  setOperationMode,
} from "@/store/fetchDataSlice";
import { ITimeScaleApi, Time } from "lightweight-charts";
import { PiLineSegments } from "react-icons/pi";
import {
  defaultCandleStickOptions,
  SeriesColors,
} from "@/constants/seriesOptions";
import { useAutomaticLineDrawing } from "@/hooks/useAutomaticLineDrawing";
import {
  LineState,
  CustomLineSeriesType,
  TrendType,
  DifferDrawType,
} from "@/hooks/interfaces";
import { CiEraser } from "react-icons/ci";
import { IoPlayBackOutline } from "react-icons/io5";
import {
  normalCrossHair,
  preselectBackTestOptions,
} from "@/constants/chartOptions";
import Loading from "../Loading";
import {
  EmitteryContext,
  OnCandlestickData,
  OnContronPanel,
  OnLeftAside,
} from "@/providers/EmitteryProvider";
import { logout } from "@/app/(root)/auth/login/logout";
import { GrLogout } from "react-icons/gr";
import { AuthContext } from "@/context/Auth";
import { ColourfulText } from "../ui/colourful-text";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  checkBackTestRecord,
  createOrUpdateBackTestRecord,
  CreateRecordDto,
  deleteBackTestRecord,
} from "@/app/playground/actions/BackTestRecord";
import { toast } from "sonner";
import { Status } from "@/utils/apis/response";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IoIosWarning } from "react-icons/io";

const Navbar: React.FC<NavbarProps> = ({
  className,
  setDialogVisible,
  dialogVisible,
  tChartRef,
  setDrawedLineList,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { dialogContent } = useSelector((state: RootState) => state.dialog);
  const { emittery } = useContext(EmitteryContext);
  const { userInfo } = useContext(AuthContext);
  const {
    periods,
    currentPeriod,
    currentSymbol,
    sliceLeft,
    sliceRight,
    isBackTestMode,
    isPreselect,
    operationMode,
    currentCandle,
    backTestRecordKey,
    symbols,
    openingOrders,
  } = useSelector((state: RootState) => state.fetchData);

  const { mouseClickEventParam } = useSelector(
    (state: RootState) => state.common
  );

  const yellow = useMemo(
    () => SeriesColors.find((c) => c.label === "yellow")?.value,
    []
  );
  const green = useMemo(
    () => SeriesColors.find((c) => c.label === "green")?.value,
    []
  );
  const orange = useMemo(
    () => SeriesColors.find((c) => c.label === "orange")?.value,
    []
  );

  const [exitDoubleCheckOpen, setExitDoubleCheckOpen] = useState(false);

  const {
    autoDrawing,
    drawSegment,
    setLineList,
    generateLineSegment,
    drawLineInVisibleRange,
    deleteAutomaticLines,
    differDrawAction,
  } = useAutomaticLineDrawing({
    setDrawedLineList,
    tChartRef,
  });

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

  const getRange = (timeScale: ITimeScaleApi<Time>): number => {
    const { from, to } = timeScale?.getVisibleLogicalRange()!;
    return Math.floor(to - from);
  };

  const scrollToStart = () => {
    const timeScale = tChartRef.current?.chart.timeScale();
    if (!timeScale) return;
    const range = getRange(timeScale);
    timeScale?.setVisibleLogicalRange({ from: 0, to: range });
  };

  const scrollToEnd = () => {
    const timeScale = tChartRef.current?.chart.timeScale();
    if (!timeScale) return;
    const range = getRange(timeScale);
    const maxLogic = tChartRef.current?.childSeries[0].data().length! - 1;
    timeScale?.setVisibleLogicalRange({ from: maxLogic - range, to: maxLogic });
  };

  const drawGreateSegment = () => {
    if (autoDrawing) return;
    const { childSeries } = tChartRef.current!;
    const segmentList: LineState[] = childSeries
      .filter(
        (series) =>
          series.options().customType === CustomLineSeriesType.SegmentDrawed
      )
      .map((series) => {
        const data = (series.data() as any[]).sort((a, b) => a.time - b.time);
        const startPrice = data[0].customValues?.price! as number;
        const endPrice = data[1].customValues?.price! as number;
        return {
          startPoint: { price: startPrice, time: data[0].time },
          endPoint: { price: endPrice, time: data[1].time },
          trend: startPrice < endPrice ? TrendType.Up : TrendType.Down,
          type: CustomLineSeriesType.SegmentDrawed,
        };
      });

    const greateSegmentList = generateLineSegment(
      segmentList,
      CustomLineSeriesType.GreatSegmentDrawed
    );
    setLineList(greateSegmentList);
  };

  const onNextTick = useCallback(() => {
    if (!isBackTestMode) return;
    if (sliceLeft === 0) {
      emittery?.emit(OnContronPanel.stopPlaying);
      return;
    }
    dispatch(setCandleDataSlice([sliceLeft - 1]));
    Promise.resolve().then(() => {
      differDrawAction(DifferDrawType.Incremental);
    });
  }, [isBackTestMode, sliceLeft]);

  const onPrevTick = useCallback(() => {
    const length = tChartRef.current?.childSeries[0].data().length;
    if (!isBackTestMode || sliceLeft === length) return;
    dispatch(setCandleDataSlice([sliceLeft + 1]));
    Promise.resolve().then(() => {
      differDrawAction(DifferDrawType.Decremental);
    });
  }, [isBackTestMode, sliceLeft]);

  const preselectBackTest = useCallback(() => {
    if (!isPreselect && !isBackTestMode) dispatch(setIsPreselect(true));

    if (isBackTestMode) {
      exitBackTestMode();
    }
  }, [isBackTestMode, isPreselect]);

  const freezeRange = (callback: (...args: any[]) => void): Promise<void> => {
    return new Promise((resolve) => {
      const range = tChartRef
        .current!.chart.timeScale()
        .getVisibleLogicalRange();
      tChartRef.current?.chart.applyOptions({
        rightPriceScale: { autoScale: false },
      });
      callback();
      tChartRef.current!.chart.timeScale().setVisibleLogicalRange(range!);
      resolve();
    });
  };

  const enterBackTestMode = async (logical?: number) => {
    if (!tChartRef.current) return;
    // 清除所有线
    emittery?.emit(OnContronPanel.cleanLineSeries);

    const { childSeries } = tChartRef.current!;
    const length = childSeries[0].data().length;
    const log = logical || length - 1 - mouseClickEventParam?.logical!;

    freezeRange(() => {
      dispatch(setCandleDataSlice([log]));
      dispatch(setIsPreselect(false));
      dispatch(setIsBackTestMode(true));
    });
  };

  const exitBackTestMode = () => {
    if (!tChartRef.current) return;

    // 清除所有线
    emittery?.emit(OnContronPanel.cleanLineSeries);

    freezeRange(() => {
      dispatch(setIsBackTestMode(false));
    });
  };

  const autoDrawAction = (
    e: KeyboardEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: CustomLineSeriesType
  ) => {
    e.preventDefault();
    tChartRef.current?.chart.applyOptions({
      rightPriceScale: {
        autoScale: true,
      },
    });
    deleteAutomaticLines(type);

    switch (type) {
      case CustomLineSeriesType.AutomaticDrawed:
        drawLineInVisibleRange();
        break;
      case CustomLineSeriesType.SegmentDrawed:
        drawSegment();
        break;
      case CustomLineSeriesType.GreatSegmentDrawed:
        drawGreateSegment();
        break;

      default:
        break;
    }
  };

  const exitPreselect = () => {
    dispatch(setIsPreselect(false));
  };

  const logoutAction = async () => {
    await logout();
    window.location.reload();
  };

  const isBlindbox = useMemo(
    () => operationMode === OperationMode.BLINDBOX,
    [operationMode]
  );

  const operationModeChange = (checked: boolean) => {
    if (checked) dispatch(setOperationMode(OperationMode.BLINDBOX));
    else dispatch(setOperationMode(OperationMode.PRACTISE));
  };

  useEffect(() => {
    if (isPreselect && tChartRef.current) {
      enterBackTestMode();
    }
  }, [mouseClickEventParam]);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;
    if (isPreselect) {
      tChartRef.current.chart.applyOptions(preselectBackTestOptions);
      // 监听鼠标右键
      document.addEventListener("contextmenu", exitPreselect);
    } else {
      document.removeEventListener("contextmenu", exitPreselect);
      tChartRef.current.chart.applyOptions(normalCrossHair);
    }
  }, [isPreselect]);

  useEffect(() => {
    hotkeys("i", openTechnicalIndexDialog);
    hotkeys("s", openSymbolSearch);
    hotkeys("u", openUploadForm);
    hotkeys("f", (e) =>
      autoDrawAction(e, CustomLineSeriesType.AutomaticDrawed)
    );
    hotkeys("r", (e) => autoDrawAction(e, CustomLineSeriesType.SegmentDrawed));
    hotkeys("ctrl+r", (e) =>
      autoDrawAction(e, CustomLineSeriesType.GreatSegmentDrawed)
    );

    return () => {
      hotkeys.unbind("i");
      hotkeys.unbind("s");
      hotkeys.unbind("u");
      hotkeys.unbind("f");
      hotkeys.unbind("r");
      hotkeys.unbind("ctrl+r");
    };
  }, [openTechnicalIndexDialog]);

  useEffect(() => {
    hotkeys("t", preselectBackTest);

    return () => {
      hotkeys.unbind("t");
    };
  }, [preselectBackTest]);

  useEffect(() => {
    hotkeys("n", onNextTick);
    hotkeys("b", onPrevTick);
    emittery?.on(OnContronPanel.exit, exitBackTestMode);
    emittery?.on(OnContronPanel.nextTick, onNextTick);
    emittery?.on(OnContronPanel.prevTick, onPrevTick);

    return () => {
      hotkeys.unbind("n");
      hotkeys.unbind("b");
      emittery?.off(OnContronPanel.exit, exitBackTestMode);
      emittery?.off(OnContronPanel.nextTick, onNextTick);
      emittery?.off(OnContronPanel.prevTick, onPrevTick);
    };
  }, [emittery, onNextTick]);

  useEffect(() => {
    if (isBlindbox) dispatch(setOperationMode(OperationMode.BLINDBOX));
    else dispatch(setOperationMode(OperationMode.PRACTISE));
  }, [isBlindbox]);

  const enterBackTestSideEffect = useCallback(async () => {
    if (!currentCandle || !currentPeriod || !currentSymbol) return;
    const payload: CreateRecordDto = {
      latest_price: currentCandle.close,
      operation_mode: operationMode,
      period_id: currentPeriod.id,
      symbol_id: currentSymbol?.id,
      sliceLeft,
      sliceRight,
    };

    const res = await createOrUpdateBackTestRecord(payload);
    if (res.status !== Status.OK) return toast.error(res.msg);
    dispatch(setBackTestRecordKey(res.data));
  }, [
    currentCandle,
    currentPeriod,
    currentSymbol,
    dispatch,
    operationMode,
    sliceLeft,
    sliceRight,
  ]);

  const exitBackTestSideEffect = useCallback(() => {
    if (!backTestRecordKey) return;
    deleteBackTestRecord(backTestRecordKey);
    dispatch(setBackTestRecordKey(undefined));
  }, [backTestRecordKey, dispatch]);

  useEffect(() => {
    if (isBackTestMode) {
      enterBackTestSideEffect();
    } else {
      exitBackTestSideEffect();
    }
  }, [isBackTestMode, enterBackTestSideEffect, exitBackTestSideEffect]);

  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [resumeBackTestPayload, setResumeBackTestPayload] =
    useState<null | CreateRecordDto>(null);

  const enterBackTestModeWhenDataLoaded = () => {
    enterBackTestMode(resumeBackTestPayload?.sliceLeft!);
    emittery?.off(OnCandlestickData.Loaded, enterBackTestModeWhenDataLoaded);
    Promise.resolve().then(() => {
      emittery?.emit(OnLeftAside.AutoResize);
      scrollToEnd();
    });
  };

  const resumeConfirm = useCallback(() => {
    if (!resumeBackTestPayload) return;
    emittery?.on(OnCandlestickData.Loaded, enterBackTestModeWhenDataLoaded);
    dispatch(setCurrentSymbol(resumeBackTestPayload.symbol_id));
    dispatch(setCurrentPeriod(`${resumeBackTestPayload.period_id}`));
    setAlertDialogOpen(false);
  }, [dispatch, resumeBackTestPayload, emittery]);

  const resumeCancel = () => {
    if (!resumeBackTestPayload?.key) return;
    deleteBackTestRecord(resumeBackTestPayload.key);
    setResumeBackTestPayload(null);
    setAlertDialogOpen(false);
    setDefaultSymbol();
    setDefaultPeriod();
  };

  const setDefaultSymbol = useCallback(() => {
    if (!symbols) return;
    dispatch(setCurrentSymbol(symbols.find((s) => s.label === "XAUUSD")?.id!));
  }, [dispatch, symbols]);

  const setDefaultPeriod = useCallback(() => {
    if (!periods) return;
    dispatch(
      setCurrentPeriod(String(periods.find((p) => p.label === "D1")?.id)!)
    );
  }, [dispatch, periods]);

  useEffect(() => {
    if (!periods || !symbols) return;
    checkBackTestRecord().then((res) => {
      if (res.data) {
        setResumeBackTestPayload(res.data);
        setAlertDialogOpen(true);
        return;
      }
      // 如果没有未完成的回测，则默认显示
      setDefaultSymbol();
      setDefaultPeriod();
    });
  }, [symbols, periods, dispatch]);

  return (
    <>
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
                disabled={isBackTestMode}
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
                disabled={isBackTestMode}
              >
                <Hourglass size={20} />
                {currentPeriod?.label}
                <span className="sr-only">Select Period</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-fit">
              <ScrollArea
                className="h-72 rounded-md pr-3"
                thumbClass="dark:bg-primary-foreground"
              >
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
                  dialogContent === DialogContentType.TechnicalIndex &&
                    "bg-muted"
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

          {/* Scroll to start */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn("nav-item px-2 gap-2 active:scale-100")}
                variant={"ghost"}
                onClick={scrollToStart}
                disabled={autoDrawing}
              >
                <ArrowLeftToLine size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex">
              <p>Scroll to start</p>
              {/* <span className="short-cut"></span> */}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn("nav-item px-2 gap-2 active:scale-100 -ml-2")}
                variant={"ghost"}
                disabled={autoDrawing}
              >
                <CalendarSearch size={22} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex">
              <p>Go to</p>
            </TooltipContent>
          </Tooltip>

          {/* Scroll to end */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  "nav-item px-2 gap-2 active:scale-100 nav-item-divider -ml-2"
                )}
                variant={"ghost"}
                onClick={scrollToEnd}
                disabled={autoDrawing}
              >
                <ArrowRightToLine size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex">
              <p>Scroll to end</p>
              {/* <span className="short-cut"></span> */}
            </TooltipContent>
          </Tooltip>

          {/* 画笔 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn("nav-item px-2 gap-2 active:scale-100")}
                variant={"ghost"}
                onClick={drawLineInVisibleRange}
                disabled={autoDrawing}
              >
                <PiLineSegments size={24} color={yellow} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex">
              <p className="nav-item-divider">Pens</p>
              <span className="short-cut">F</span>
            </TooltipContent>
          </Tooltip>

          {/* 画线段 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn("nav-item px-2 gap-2 active:scale-100 -ml-2")}
                variant={"ghost"}
                onClick={drawSegment}
                disabled={autoDrawing}
              >
                <PiLineSegments size={24} color={green} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex">
              <p className="nav-item-divider">Segments</p>
              <span className="short-cut">R</span>
            </TooltipContent>
          </Tooltip>

          {/* 画大线段 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn("nav-item px-2 gap-2 active:scale-100 -ml-2")}
                variant={"ghost"}
                disabled={autoDrawing}
                onClick={drawGreateSegment}
              >
                <PiLineSegments size={24} color={orange} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex">
              <p className="nav-item-divider">Greate Segments</p>
              <span className="short-cut px-1">Ctrl + R</span>
            </TooltipContent>
          </Tooltip>

          {/* 删除按钮 */}
          <Tooltip>
            <DropdownMenu>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild disabled={autoDrawing}>
                  <Button
                    className="nav-item px-2 gap-2 active:scale-100 nav-item-divider -ml-2"
                    variant={"ghost"}
                  >
                    <CiEraser size={26} />
                    <span className="sr-only">Select Period</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>

              <DropdownMenuContent className="w-fit">
                <DropdownMenuItem
                  onClick={() =>
                    deleteAutomaticLines(CustomLineSeriesType.AutomaticDrawed)
                  }
                >
                  <PiLineSegments color={yellow} />
                  Pens
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    deleteAutomaticLines(CustomLineSeriesType.SegmentDrawed)
                  }
                >
                  <PiLineSegments color={green} />
                  Segments
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    deleteAutomaticLines(
                      CustomLineSeriesType.GreatSegmentDrawed
                    )
                  }
                >
                  <PiLineSegments color={orange} />
                  Greate Segments
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent className="flex">
              <p className="">Eraser</p>
            </TooltipContent>
          </Tooltip>

          {/* Back test */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  "nav-item px-2 gap-2 active:scale-100 nav-item-divider",
                  (isBackTestMode || isPreselect) &&
                    "bg-primary hover:bg-primary"
                )}
                variant={"ghost"}
                onClick={preselectBackTest}
              >
                {isBackTestMode ? <Loading /> : <IoPlayBackOutline size={24} />}
                {/* {isBackTestMode && <Loading />} */}
                {isBackTestMode ? (
                  "Back testing..."
                ) : (
                  <ColourfulText
                    text="BACK TEST"
                    isColorful={false}
                    intervalTime={3000}
                  />
                )}
                <span className="sr-only">Back test</span>
              </Button>
            </TooltipTrigger>

            <TooltipContent className="flex">
              <p className="nav-item-divider">Back test</p>
              <span className="short-cut">T</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="gap-3 flex items-center px-2 active:scale-100 nav-item-divider h-full">
                <Label
                  htmlFor="operation-mode"
                  className={cn(
                    "cursor-pointer text-input",
                    !isBlindbox && "text-white"
                  )}
                >
                  {OperationMode.PRACTISE}
                </Label>
                <Switch
                  id="operation-mode"
                  className="data-[state=checked]:bg-input"
                  onCheckedChange={operationModeChange}
                  disabled={isBackTestMode}
                />
                <Label
                  htmlFor="operation-mode"
                  className={cn(
                    "cursor-pointer text-input",
                    isBlindbox && "text-white"
                  )}
                >
                  {OperationMode.BLINDBOX}
                </Label>
              </div>
            </TooltipTrigger>

            <TooltipContent className="flex">
              <p className="">BackTest Mode</p>
              <span className="sr-only">BackTest Mode</span>
            </TooltipContent>
          </Tooltip>

          <div className="absolute right-14 h-full flex py-1 gap-4 items-center">
            {/* Upload data */}
            {userInfo?.is_staff && (
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
            )}

            {/* Logout button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  className={cn("nav-item px-2")}
                  onClick={logoutAction}
                >
                  <GrLogout size={20} />
                  <span className="sr-only">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </nav>
      </TooltipProvider>

      <AlertDialog open={alertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Continue BackTest ?</AlertDialogTitle>
            <AlertDialogDescription>
              Your last BackTest has not finished yet, do you need to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={resumeCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resumeConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={exitDoubleCheckOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <IoIosWarning size={28} color="yellow" /> Are you sure ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have open orders. If you exit backtesting mode these orders
              will be closed at the current price. Are you sure you want to
              exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={resumeCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resumeConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navbar;
