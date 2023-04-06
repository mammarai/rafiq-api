import { Document } from "langchain/document";
import xlsx from "xlsx";

export function XLSXLoader(filePath: string) {
  const workbook = xlsx.readFile(filePath); // Step 2
  let workbook_sheet = workbook.SheetNames; // Step 3
  const data: { [key: string]: any }[] = [];
  workbook_sheet.forEach((sheet) => {
    let workbook_response = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
    data.push(workbook_response);
  });

  return data;
}
