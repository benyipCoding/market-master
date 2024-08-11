import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import CommonHeader from "@/components/technicalIndex/CommonHeader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DialogContext } from "@/context/Dialog";
import NameItem from "../commonFormItem/NameItem";
import { analyzeCSVData, analyzeExcelData } from "@/utils/excel";
import {
  validateFileType,
  validateFileExtension,
  getFileExtension,
  downloadFile,
  calculateToFixedNum,
} from "@/utils/helpers";
import IntervalItem from "../commonFormItem/IntervalItem";
import { UploadFormValue } from "../interfaces/UploadForm";
import UploadItem from "../commonFormItem/UploadItem";
import { Download } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CandlestickData, Time } from "lightweight-charts";

const UploadForm = () => {
  const { setDialogVisible } = useContext(DialogContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formValue, setFormValue] = useState<UploadFormValue>({
    symbol: "",
    interval: "D1",
    customInterval: "",
    toFixedNum: 0,
    file: null,
  });

  const isCustomInterval = useMemo(
    () => formValue.interval === "custom",
    [formValue.interval]
  );

  const rules: Record<keyof UploadFormValue, (...args: any[]) => string> = {
    symbol: (name: string): string => {
      if (!name) return "Symbol name is required";
      if (
        !/^(?!^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$)[^\\/:*?"<>|]{1,255}$/.test(
          name
        )
      )
        return "Please input correct symbol name";
      return "";
    },
    customInterval: (value: string): string => {
      if (isCustomInterval && !formValue.customInterval)
        return "Custom interval is required";
      if (!/^[mHDWM]\d+$/.test(value) && isCustomInterval)
        return "Please input correct interval.";
      return "";
    },
    file: (file: File | null): string => {
      if (!file) return "File data is required";
      return "";
    },
  };

  const [errorMsg, setErrorMsg] = useState({
    symbol: "",
    customInterval: "",
    file: "",
  });

  const fileHandler = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setErrorMsg((prev) => ({ ...prev, file: "" }));

    try {
      const file = files[0];

      if (!validateFileType(file) || !validateFileExtension(file))
        throw new Error(
          "The uploaded file format must be an Excel or CSV file"
        );

      setFormValue({ ...formValue, file, toFixedNum: 0 });

      const extname = getFileExtension(file.name);

      const data =
        extname === "csv"
          ? ((await analyzeCSVData(file)) as CandlestickData<Time>[])
          : ((await analyzeExcelData(
              file
            )) as unknown as CandlestickData<Time>[]);

      console.log("@@@", data);

      // calculate toFixedNum
      const toFixedNum = calculateToFixedNum(data);
      setFormValue((prev) => ({ ...prev, toFixedNum }));
    } catch (error: any) {
      setErrorMsg((prev) => ({ ...prev, file: error.message }));
      clearFiles();
    }
  };
  const formValidate = (field?: keyof UploadFormValue) => {
    return new Promise((resolve, reject) => {
      let hasError = false;

      if (!field) {
        for (const key in rules) {
          const msg = rules[key](formValue[key]);
          if (msg) hasError = true;
          setErrorMsg((prev) => ({ ...prev, [key]: msg }));
        }
      } else {
        const msg = rules[field](formValue[field]);
        if (msg) hasError = true;
        setErrorMsg((prev) => ({ ...prev, [field]: msg }));
      }

      if (hasError) reject(false);
      else resolve(true);
    });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate
      await formValidate();
      console.log(formValue);
    } catch (error) {
      console.log({ error });
    }
  };

  const clearFiles = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    setFormValue({ ...formValue, file: null, toFixedNum: 0 });
  };

  // trigger validate by changing
  useEffect(() => {
    if (!isCustomInterval) return;
    try {
      formValidate("customInterval");
    } catch (error) {
      console.log(error);
    }
  }, [formValue.customInterval]);

  useEffect(() => {
    if (formValue.symbol === "") return;
    try {
      formValidate("symbol");
    } catch (error) {
      console.log(error);
    }
  }, [formValue.symbol]);

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
            <IntervalItem
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
            />
            <UploadItem
              accept=".xls, .xlsx, .csv"
              id="fileData"
              label="File"
              onFileChange={fileHandler}
              errorMessage={errorMsg.file}
              ref={fileInputRef}
              clearFiles={clearFiles}
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
          <Button>Upload</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UploadForm;
