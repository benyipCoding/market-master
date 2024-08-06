import ExcelJS from "exceljs";

const COLUMN_HEADERS = ["time", "open", "high", "low", "close"];

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

        // Iterate each row
        worksheet.eachRow((row, rowNumber) => {
          try {
            if (rowNumber === 1) {
              console.log(row.values);
              // Remove undefined item
              const rowData = (row.values as ExcelJS.CellValue[]).filter(
                (item) => item
              );

              rowData.forEach((header) => {
                // Validate headers name
                if (!COLUMN_HEADERS.includes(header as string))
                  throw new Error("The header name of the table is incorrect");
              });
            }
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
