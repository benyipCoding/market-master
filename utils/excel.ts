import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { indexOfVol, isValidTime, transferToDateStr } from "./helpers";
import { CandlestickData, Time } from "lightweight-charts";

export enum ColumnHeaders {
  OPEN = "open",
  HIGH = "high",
  LOW = "low",
  CLOSE = "close",
  VOL = "volume",
  TIME = "time",
}

export function analyzeExcelData(
  file: File
): Promise<Array<ExcelJS.CellValue[] | { [key: string]: ExcelJS.CellValue }>> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        // Read the first worksheet
        const worksheet = workbook.worksheets[0];

        const data: Array<
          ExcelJS.CellValue[] | { [key: string]: ExcelJS.CellValue }
        > = [];

        const headerMap = new Map<number, string>();

        // Iterate each row
        worksheet.eachRow((row, rowNumber) => {
          // Remove undefined item

          const rowData = (row.values as ExcelJS.CellValue[]).filter(
            (item) => item
          );

          // if it is table header jump to next cycle
          const hasNumber = rowData.some(
            (cell) => !isNaN(parseInt(cell as string))
          );
          if (!hasNumber) return;

          // Verify if the number of columns are gt 6
          if (rowData.length > 6) throw new Error("Too much columns");

          // Verify whether the four price ranges of open, high, low, and close are complete
          if (rowData.length < 5) throw new Error("Missing necessary columns.");

          // Verify if there is a missing time column
          const hasTimeColumn = rowData.some((cell) => {
            return isValidTime(cell as string);
          });
          if (!hasTimeColumn)
            throw new Error(
              `The ${rowNumber} row of the table is missing a time item`
            );

          // dispatch columns
          if (!headerMap.size) {
            // Time
            const timeIndex = rowData.findIndex((cell) =>
              isValidTime(cell as string)
            );
            headerMap.set(timeIndex, ColumnHeaders.TIME);

            // Volume
            const volIndex = indexOfVol(rowData);
            headerMap.set(volIndex, ColumnHeaders.VOL);

            const numArr = rowData
              .filter((_, index) =>
                volIndex === -1
                  ? ![timeIndex].includes(index)
                  : ![timeIndex, volIndex].includes(index)
              )
              .map((cell) => Number(cell));

            // High
            // const highIndex = rowData.indexOf(Math.max(...numArr));
            const highIndex = rowData.findLastIndex(
              (d) => d === Math.max(...numArr)
            );
            headerMap.set(highIndex, ColumnHeaders.HIGH);

            // Low
            const lowIndex = rowData.indexOf(Math.min(...numArr));
            headerMap.set(lowIndex, ColumnHeaders.LOW);

            // open
            const openIndex = rowData.findIndex(
              (_, index) =>
                ![timeIndex, highIndex, lowIndex, volIndex].includes(index)
            );
            headerMap.set(openIndex, ColumnHeaders.OPEN);

            // close
            const closeIndex = rowData.findIndex(
              (_, index) =>
                ![timeIndex, highIndex, lowIndex, openIndex, volIndex].includes(
                  index
                )
            );
            headerMap.set(closeIndex, ColumnHeaders.CLOSE);
          }

          const processRow: Record<string, any> = {};
          rowData.forEach((cell, index) => {
            const key = headerMap.get(index) as string;
            const value =
              key !== "time" ? cell : transferToDateStr(cell as Date);

            if (key === "time" && !dayjs(value as string).isValid())
              reject(new Error("The date format is incorrect"));

            processRow[key] = value;
          });
          data.push(processRow);
        });

        // order by time DESC
        data.sort(
          (a: any, b: any) =>
            new Date(b.time).getTime() - new Date(a.time).getTime()
        );
        resolve(data);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log("Error in reading file.", error);
      reject(error);
    }
  });
}

// export function analyzeCSVData(file: File) {
//   return new Promise((resolve, reject) => {
//     csvParse(file, {
//       header: true, // Use the first row as the header
//       complete: function (results) {
//         const headers = results.meta.fields!;
//         const invalid = headers.some((item) => !COLUMN_HEADERS.includes(item));
//         if (invalid)
//           reject(new Error("The header name of the table is incorrect"));
//         const processData: Record<string, any>[] = [];

//         (results.data as Record<string, any>[]).forEach((item) => {
//           const processItem: Record<string, any> = {};
//           for (const k in item) {
//             const key = ["date", "time"].includes(k) ? "time" : k;
//             processItem[key] =
//               key !== "time"
//                 ? +item[k]
//                 : dayjs(item[k] as string).isValid()
//                 ? dayjs(item[k] as string).format(FORMAT_DATE_STR)
//                 : dayjs(item[k] as string, SPECIAL_DATE_STR).format(
//                     FORMAT_DATE_STR
//                   );
//           }
//           processData.push(processItem);
//         });
//         resolve(processData);
//       },
//       error: function (error) {
//         console.error("Something wrong with parsing csv file."); // Error Handler
//         reject(error);
//       },
//     });
//   });
// }

export function verifyOpenAndClose(
  data: CandlestickData<Time>[],
  count: number = 1000
) {
  if (!data || !data.length) throw new Error("Parameter 1 is missing data");
  let correct = 0;
  count = Math.min(data.length, count);

  for (let i = 0; i < count; i++) {
    const rand = Math.floor(Math.random() * (data.length + 1));
    const current = data[rand];
    const next = data[rand - 1];

    if (!current || !next) {
      i--;
      continue;
    }

    if (current.close === next.open) correct++;
  }

  return correct / count;
}
