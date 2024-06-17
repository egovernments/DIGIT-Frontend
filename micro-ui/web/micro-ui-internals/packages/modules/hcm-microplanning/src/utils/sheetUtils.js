import ExcelJS from "exceljs";
import { SHEET_PASSWORD } from "../configs/constants";

export function protectFirstRowInAllSheets(workbook) {
  workbook.eachSheet((worksheet) => {
    const firstRow = worksheet.getRow(1);

    // Protect each cell in the first row
    firstRow.eachCell((cell) => {
      cell.protection = { locked: true };
    });

    // Protect the sheet with a password
    worksheet.protect(SHEET_PASSWORD, {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });
  });
}

export function protectColumnsByHeadersInEverySheet(workbook, headers) {
  workbook.eachSheet((worksheet) => {
    // Find the column numbers for the given header names
    const headerRow = worksheet.getRow(1);
    const columnNumbers = headers.map((header) => {
      let columnNumber = -1;
      headerRow.eachCell((cell, colNumber) => {
        if (cell.value === header) {
          columnNumber = colNumber;
        }
      });
      return columnNumber;
    });

    // Iterate through all rows and cells in the worksheet
    worksheet.eachRow((row) => {
      row.eachCell((cell, colNumber) => {
        // Check if the current cell is in one of the protected columns
        if (columnNumbers.includes(colNumber)) {
          // Protect the cell if it's in a protected column
          cell.protection = { locked: true };
        } else {
          // Leave the cell unlocked if it's not in a protected column
          cell.protection = { locked: false };
        }
      });
    });

    // Protect the sheet with a password
    worksheet.protect(SHEET_PASSWORD, {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });
  });
}

export function protectSheetByName(workbook, sheetName) {
  const worksheet = workbook.getWorksheet(sheetName);
  if (worksheet) {
    // Protect all cells in the sheet
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.protection = { locked: true };
      });
    });

    // Protect the sheet with a password
    worksheet.protect(SHEET_PASSWORD, {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });
  }
}

export function protectWholeWorkbook(workbook) {
  workbook.eachSheet((worksheet) => {
    // Protect all cells in the sheet
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.protection = { locked: true };
      });
    });

    // Protect the sheet with a password
    worksheet.protect(SHEET_PASSWORD, {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });
  });
}

export function unprotectColumnsByHeadersInEverySheet(workbook, headers) {
  workbook.eachSheet((worksheet) => {
    // Find the column numbers for the given header names
    const headerRow = worksheet.getRow(1);
    const columnNumbers = headers.map((header) => {
      let columnNumber = -1;
      headerRow.eachCell((cell, colNumber) => {
        if (cell.value === header) {
          columnNumber = colNumber;
        }
      });
      return columnNumber;
    });

    // Unprotect each found column
    worksheet.eachRow((row) => {
      columnNumbers.forEach((colNumber) => {
        if (colNumber > 0) {
          const cell = row.getCell(colNumber);
          cell.protection = { locked: false };
        }
      });
    });

    // Re-protect the sheet without a password to apply the changes
    worksheet.protect(null, {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });
  });
}
// Function to Protect Cells with Data and Leave Empty Cells Unprotected in a Specific Sheet
export function protectCellsWithDataInSheet(workbook, sheetName) {
  const worksheet = workbook.getWorksheet(sheetName);
  if (worksheet) {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (cell.value !== null && cell.value !== undefined && cell.value !== "") {
          cell.protection = { locked: true };
        } else {
          cell.protection = { locked: false };
        }
      });
    });

    worksheet.protect(SHEET_PASSWORD, {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });
  }
}
