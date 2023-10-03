import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs";
import config from "../config.json" assert { type: "json" };

export const convertXlsx = () => {
  const resultFile = Deno.readFileSync(`${config.outDir}/result.json`);

  if (!resultFile) return console.error("No result file found, aborting.");

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(resultFile);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "result.xlsx");
};

convertXlsx();
