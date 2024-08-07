import dayjs from "dayjs";
import ExcelJS from "exceljs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const COLUMN_HEADERS = [
  "time",
  "open",
  "high",
  "low",
  "close",
  "date",
  "volumn",
];

const SPECIAL_DATE_STR = "D/M/YYYY HH:mm:ss";
const FORMAT_DATE_STR = "YYYY-MM-DD HH:mm:ss";

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

          try {
            // Related to column headers
            const row: Record<string, any> = {};
            rowData.forEach((cell, index) => {
              if (rowNumber === 1) {
                // Validate headers name
                if (!COLUMN_HEADERS.includes((cell as string).toLowerCase()))
                  throw new Error("The header name of the table is incorrect");

                headerMap.set(index, (cell as string).toLowerCase());
              } else {
                let key = headerMap.get(index) as string;
                key = ["date", "time"].includes(key) ? "time" : key;
                const value =
                  key !== "time"
                    ? cell
                    : dayjs(cell as string).isValid()
                    ? dayjs(cell as string).format(FORMAT_DATE_STR)
                    : dayjs(cell as string, SPECIAL_DATE_STR).format(
                        FORMAT_DATE_STR
                      );

                if (key === "time" && !dayjs(value as string).isValid())
                  throw new Error("The date format is incorrect");

                row[key] = value;
              }
            });
            rowNumber !== 1 && data.push(row);
          } catch (error) {
            reject(error);
          }
        });

        resolve(data);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log("Error in reading file.", error);
      reject(error);
    }
  });
}
