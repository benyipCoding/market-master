import React, { useContext, useEffect, useMemo, useState } from "react";
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
} from "@/utils/helpers";
import IntervalItem from "../commonFormItem/IntervalItem";

export interface UploadFormValue extends Record<string, any> {
  symbol: string;
  interval: string;
  customInterval: string;
}

const UploadForm = () => {
  const { setDialogVisible } = useContext(DialogContext);

  const [formValue, setFormValue] = useState<UploadFormValue>({
    symbol: "",
    interval: "D1",
    customInterval: "",
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
  };

  const [errorMsg, setErrorMsg] = useState({
    symbol: "",
    customInterval: "",
  });

  const fileHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target?.files![0];

      if (!validateFileType(file) || !validateFileExtension(file))
        throw new Error(
          "The uploaded file format must be an Excel or CSV file"
        );

      const extname = getFileExtension(file.name);

      const data =
        extname === "csv"
          ? await analyzeCSVData(file)
          : await analyzeExcelData(file);

      console.log("@@@", data);
    } catch (error) {
      console.log(error);
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

  const uploadHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate
      await formValidate();
      console.log(formValue);
    } catch (error) {
      console.log({ error });
    }
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
      <CommonHeader title="Upload your personal chart data" />

      <form onSubmit={uploadHandler}>
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
