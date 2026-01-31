import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

const validateBoundaryExcelContent = async (file, t) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
  
        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Extract data including dynamic headers
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }); // First row as headers
        const headers = jsonData[0]; // First row contains the headers
        let rows = jsonData.slice(1); // Remaining rows are data
  
        if (headers.length === 0) {
          resolve({ success: false, error: t("BOUNDARY_EMPTY_SHEET") });
          return;
        }

        // Remove empty rows immediately following the headers
        while (rows.length > 0 && rows[0].every(cell => !cell?.trim())) {
          rows = rows.slice(1); // Remove the first row if it's empty
        }

        if (rows.length === 0) {
          resolve({ success: false, error: t("BOUNDARY_NO_VALID_ROWS") });
          return;
        }

        // Find the index of "Service Boundary Code" to exclude validations
        const excludeStartIndex = headers.indexOf(t("HCM_ADMIN_CONSOLE_BOUNDARY_CODE"));
        const validateColumnsCount = excludeStartIndex === -1 ? headers.length : excludeStartIndex;
  
        // Perform validations
        const errors = [];
        const referenceCountry = rows[0]?.[0]?.trim(); // Reference country from the first column, first row
  
        rows.forEach((row, rowIndex) => {
          // Single country validation (based on the first column)
          if (row[0]?.trim() && row[0]?.trim() !== referenceCountry) {
            errors.push(`${t("Row")} ${rowIndex + 2}: ${t("MULTIPLE_COUNTRIES_CANNOT_EXIST")}`);
          }
  
          // Hierarchical dependency validation
          for (let colIndex = 1; colIndex < validateColumnsCount; colIndex++) {
            const currentCell = row[colIndex]?.trim();
            const previousCell = row[colIndex - 1]?.trim();
            if (currentCell && !previousCell) {
              errors.push(
                `${t("BOUNDARY_ROW")} ${rowIndex + 2}: ${t("BOUNDARY_COLUMN")} "${headers[colIndex]}" ${t("BOUNDARY_FILLED")} "${headers[colIndex - 1]}" ${t("BOUNDARY_EMPTY")}`
              );
            }
          }
        });
  
        if (errors.length > 0) {
          resolve({ success: false, error: errors.join("\n") });
        } else {
          resolve({ success: true });
        }
      };
  
      reader.readAsArrayBuffer(file);
    });
  };

  export default validateBoundaryExcelContent;