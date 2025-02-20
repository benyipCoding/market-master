import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import CommonHeader from "@/components/technicalIndex/CommonHeader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DialogContext } from "@/context/Dialog";
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
import {
  PayloadForCreateKlines,
  UploadFormValue,
} from "../interfaces/UploadForm";
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
import { uploadKLine } from "@/app/playground/actions/uploadKLine";
import SymbolSelectItem from "../commonFormItem/SymbolSelectItem";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";

const UploadForm = () => {
  const { setDialogVisible } = useContext(DialogContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { emittery } = useContext(EmitteryContext);
  const [loading, setLoading] = useState(false);
  const symbolOptions = useSelector((state: RootState) =>
    state.fetchData.symbols?.map((s) => ({ label: s.label, value: `${s.id}` }))
  );
  const { periods } = useSelector((state: RootState) => state.fetchData);

  const [formValue, setFormValue] = useState<UploadFormValue>({
    symbol: "",
    interval: "",
    toFixedNum: 0,
    file: null,
    data: [],
    hasVol: false,
    total: 0,
  });

  const hasFile = useMemo(() => !!formValue.data.length, [formValue.data]);

  const [errorMsg, setErrorMsg] = useState({
    symbol: "",
    file: "",
  });
  // Functions that handle Excel parsing
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

      const toFixedNum = calculateToFixedNum(data);
      // const result = verifyOpenAndClose(data);
      // if (result < 0.9)
      //   data = data.map((item) => ({
      //     ...item,
      //     open: item.close,
      //     close: item.open,
      //   }));

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
  // Asynchronously upload data after clicking the Upload button
  const bulkUpload = async () => {
    console.time("upload");
    const data = formValue.data.map((item) => ({
      open: item.open,
      close: item.close,
      high: item.high,
      low: item.low,
      volume: (item as any).volume || 0,
      timestamp: new Date(item.time as string).getTime(),
    }));

    const payload: PayloadForCreateKlines = {
      data,
      symbol: +formValue.symbol,
      period: periods?.find((p) => p.label === formValue.interval)?.id,
      precision: formValue.toFixedNum,
    };

    const count = 500;
    const tasks: Array<Promise<any>> = [];
    for (let i = 0; i < payload.data.length; i += count) {
      const newPayload: PayloadForCreateKlines = {
        ...payload,
        data: payload.data.slice(i, i + count),
      };
      const task = uploadKLine(newPayload);
      tasks.push(task);
    }
    const results = await Promise.all(tasks);
    results.forEach((res: any) => {
      if (!`${res.statue}`.startsWith("2")) toast.error(res.msg);
      toast.success(res.data);
    });
    console.timeEnd("upload");
    return;
  };
  // Switch chart triggered after clicking the Upload button
  const switchKLineChart = async () => {
    try {
      //  Package up the payload
      const id = `${formValue.symbol}_${formValue.period}_${Date.now()}`;

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
      console.log({ seriesData });

      // Emitter
      emittery?.emit(OnApply.ResetMainSeriesData, {
        customOptions,
        seriesData,
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setDialogVisible(false);
    }
  };
  // Upload handler
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Asynchronously upload data
    bulkUpload();
    // Switch the current K-line chart
    switchKLineChart();
  };

  const clearFiles = (e?: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!fileInputRef.current) return;
    if (e) e.preventDefault();
    fileInputRef.current.value = "";
    setFormValue({
      file: null,
      toFixedNum: 0,
      data: [],
      hasVol: false,
      interval: "",
      symbol: "",
      total: 0,
    });
  };

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
            <SymbolSelectItem
              itemLabel="Symbol"
              selectValue={formValue.symbol}
              setSelectValue={(symbol) =>
                setFormValue({ ...formValue, symbol: symbol.toUpperCase() })
              }
              options={symbolOptions || []}
            />

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
