import * as XLSX from "xlsx";
import { Toast } from "@egovernments/digit-ui-react-components";

const validateExcel = (selectedFile) => {
  return new Promise((resolve, reject) => {
    // Check if a file is selected
    if (!selectedFile) {
      reject("Please select a file.");
      return;
    }

    // Read the Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming your columns are in the first sheet
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const columnsToValidate = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        })[0];

        // Check if all columns have non-empty values in every row
        const isValid = XLSX.utils.sheet_to_json(sheet).every((row) =>
          columnsToValidate.every((column) =>
            row[column] !== undefined &&
            row[column] !== null &&
            row[column] !== ""
          )
        );

        if (isValid) {
          // All columns in all rows have non-empty values, it is valid
          resolve(true);
        } else {
          reject(
            "Please ensure all columns have non-empty values in every row."
          );
        }
      } catch (error) {
        console.error("Error reading the file:", error);
        reject("Error reading the file. Please try again.");
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  });
};

export default validateExcel;