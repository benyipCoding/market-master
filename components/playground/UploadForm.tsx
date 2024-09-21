import React, { useContext, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import CommonHeader from "@/components/technicalIndex/CommonHeader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DialogContext } from "@/context/Dialog";
import NameItem from "../commonFormItem/NameItem";
import {
  analyzeExcelData,
  ColumnHeaders,
  verifyOpenAndClose,
} from "@/utils/excel";
import {
  validateFileType,
  validateFileExtension,
  downloadFile,
  calculateToFixedNum,
  calculateInterval,
} from "@/utils/helpers";
import { UploadFormValue } from "../interfaces/UploadForm";
import UploadItem from "../commonFormItem/UploadItem";
import { Download } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  CandlestickData,
  CandlestickStyleOptions,
  SeriesPartialOptions,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { EmitteryContext, OnApply } from "@/providers/EmitteryProvider";
import Loading from "../Loading";

const UploadForm = () => {
  const { setDialogVisible } = useContext(DialogContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { emittery } = useContext(EmitteryContext);
  const [loading, setLoading] = useState(false);

  const [formValue, setFormValue] = useState<UploadFormValue>({
    symbol: "",
    interval: "",
    // customInterval: "",
    toFixedNum: 0,
    file: null,
    data: [],
    hasVol: false,
    total: 0,
  });

  // const isCustomInterval = useMemo(
  //   () => formValue.interval === "custom",
  //   [formValue.interval]
  // );
  const hasFile = useMemo(() => !!formValue.data.length, [formValue.data]);
  // const hasFile = useMemo(() => true, []);

  // const rules: Record<keyof UploadFormValue, (...args: any[]) => string> = {
  //   symbol: (name: string): string => {
  //     if (!name) return "Symbol name is required";
  //     if (
  //       !/^(?!^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$)[^\\/:*?"<>|]{1,255}$/.test(
  //         name
  //       )
  //     )
  //       return "Please input correct symbol name";
  //     return "";
  //   },
  //   customInterval: (value: string): string => {
  //     if (isCustomInterval && !formValue.customInterval)
  //       return "Custom interval is required";
  //     if (!/^[mHDWM]\d+$/.test(value) && isCustomInterval)
  //       return "Please input correct interval.";
  //     return "";
  //   },
  //   file: (file: File | null): string => {
  //     if (!file) return "File data is required";
  //     return "";
  //   },
  // };

  const [errorMsg, setErrorMsg] = useState({
    symbol: "",
    // customInterval: "",
    file: "",
  });

  const fileHandler = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setErrorMsg((prev) => ({ ...prev, file: "" }));
    setLoading(true);
    try {
      const file = files[0];
      if (!validateFileType(file) || !validateFileExtension(file))
        throw new Error("The uploaded file format must be an Excel file");
      setFormValue({ ...formValue, file, toFixedNum: 0, data: [] });

      let data = (await analyzeExcelData(
        file
      )) as unknown as CandlestickData<Time>[];

      // calculate toFixedNum
      const toFixedNum = calculateToFixedNum(data);
      const result = verifyOpenAndClose(data);
      if (result < 0.9)
        data = data.map((item) => ({
          ...item,
          open: item.close,
          close: item.open,
        }));

      // calculate interval
      const interval = calculateInterval(data);
      const noVol = data.some((item) => !(ColumnHeaders.VOL in item));

      setFormValue((prev) => ({
        ...prev,
        toFixedNum,
        data,
        interval,
        hasVol: !noVol,
        total: data.length,
      }));
    } catch (error: any) {
      setErrorMsg((prev) => ({ ...prev, file: error.message }));
      clearFiles();
    } finally {
      setLoading(false);
    }
  };
  // const formValidate = (field?: keyof UploadFormValue) => {
  //   return new Promise((resolve, reject) => {
  //     let hasError = false;

  //     if (!field) {
  //       for (const key in rules) {
  //         const msg = rules[key](formValue[key]);
  //         if (msg) hasError = true;
  //         setErrorMsg((prev) => ({ ...prev, [key]: msg }));
  //       }
  //     } else {
  //       const msg = rules[field](formValue[field]);
  //       if (msg) hasError = true;
  //       setErrorMsg((prev) => ({ ...prev, [field]: msg }));
  //     }

  //     if (hasError) reject(false);
  //     else resolve(true);
  //   });
  // };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate
      // await formValidate();

      //  Package up the payload
      const id = `${formValue.symbol}_${formValue.interval}_${Date.now()}`;
      const customOptions: SeriesPartialOptions<CandlestickStyleOptions> = {
        id,
        toFixedNum: formValue.toFixedNum,
        priceFormat: {
          precision: formValue.toFixedNum,
          minMove: 1 / Math.pow(10, formValue.toFixedNum),
        },
      };
      const seriesData: CandlestickData<Time>[] = formValue.data
        .filter((item) => !!item.time)
        .map((item, index) => ({
          ...item,
          time: new Date(item.time as string).getTime() as UTCTimestamp,
          customValues: { customLogic: index + 1 },
        }));

      seriesData.sort((a, b) => (a.time as number) - (b.time as number));

      console.log({ seriesData, customOptions });

      // Emitter
      emittery?.emit(OnApply.ResetMainSeriesData, {
        customOptions,
        seriesData,
      });

      setDialogVisible(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const clearFiles = (e?: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!fileInputRef.current) return;
    if (e) e.preventDefault();
    fileInputRef.current.value = "";
    setFormValue({
      ...formValue,
      file: null,
      toFixedNum: 0,
      data: [],
      hasVol: false,
      interval: "",
      symbol: "",
    });
  };

  // trigger validate by changing
  // useEffect(() => {
  //   if (!isCustomInterval) return;
  //   try {
  //     formValidate("customInterval");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [formValue.customInterval]);

  // useEffect(() => {
  //   if (formValue.symbol === "") return;
  //   try {
  //     formValidate("symbol");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [formValue.symbol]);

  return (
    <Card className="w-full">
      <CommonHeader title="Upload your personal chart data">
        <TooltipProvider disableHoverableContent={true} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Download
                className="absolute top-1/2 -translate-y-1/2 right-0 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white cursor-pointer"
                size={20}
                onClick={() => downloadFile("/template.xlsx", "template.xlsx")}
              />
            </TooltipTrigger>
            <TooltipContent align="center">
              <p className="w-fit font-normal">Download template</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CommonHeader>

      <form onSubmit={submitHandler}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <NameItem
              itemLabel="Symbol Name"
              placeholder="Name of the symbol, example:XAUUSD"
              inputValue={formValue.symbol}
              setInputValue={(symbol) =>
                setFormValue({ ...formValue, symbol: symbol.toUpperCase() })
              }
              errorMessage={errorMsg.symbol}
            />
            {/* <IntervalItem
              interval={formValue.interval}
              changeInterval={(interval) => {
                setFormValue({ ...formValue, interval, customInterval: "" });
                setErrorMsg({ ...errorMsg, customInterval: "" });
              }}
              customInterval={formValue.customInterval}
              customInputChange={(customInterval) => {
                setFormValue({ ...formValue, customInterval });
              }}
              errorMessage={errorMsg.customInterval}
            /> */}
            <UploadItem
              accept=".xls, .xlsx"
              id="fileData"
              label="File"
              onFileChange={fileHandler}
              errorMessage={errorMsg.file}
              ref={fileInputRef}
              clearFiles={clearFiles}
              hasFile={hasFile}
              formValue={formValue}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => setDialogVisible(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={loading || !formValue.symbol || !formValue.data.length}
          >
            {loading ? <Loading /> : "Upload"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UploadForm;
