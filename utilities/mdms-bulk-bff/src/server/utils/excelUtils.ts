import config from "../config";
import { throwError } from "./errorUtils";
import { logger } from "./logger";
import { httpRequest } from "./request";
import * as ExcelJS from "exceljs";
import FormData from "form-data"; // Import FormData for handling multipart/form-data requests



// Function to create Excel sheet and upload it
export async function createAndUploadFile(
  updatedWorkbook: any,
  request: any,
  tenantId?: any
) {
  // Write the updated workbook to a buffer
  const buffer = await updatedWorkbook.xlsx.writeBuffer();

  // Create form data for file upload
  const formData = new FormData();
  formData.append("file", buffer, "filename.xlsx");
  formData.append(
    "tenantId",
    tenantId ? tenantId : request?.body?.RequestInfo?.userInfo?.tenantId
  );
  formData.append("module", "HCM-ADMIN-CONSOLE-SERVER");

  // Make HTTP request to upload file
  var fileCreationResult = await httpRequest(
    config.host.filestore + config.paths.filestoreCreate,
    formData,
    undefined,
    undefined,
    undefined,
    {
      "Content-Type": "multipart/form-data",
      "auth-token": request?.body?.RequestInfo?.authToken,
    }
  );

  // Extract response data
  const responseData = fileCreationResult?.files;
  if (!responseData?.[0]?.fileStoreId) {
    throwError("COMMON", 500, "INTERNAL_SERVER_ERROR", "File creation failed");
  }

  return responseData; // Return the response data
}


function getRawCellValue(cell: any) {
  if (cell.value && typeof cell.value === 'object') {
    if ('richText' in cell.value) {
      // Handle rich text
      return cell.value.richText.map((rt: any) => rt.text).join('');
    } else if ('formula' in cell.value) {
      // Get the result of the formula
      return cell.value.result;
    } else if ('error' in cell.value) {
      // Get the error value
      return cell.value.error;
    } else if (cell.value instanceof Date) {
      // Handle date values
      return cell.value.toISOString();
    } else {
      // Return as-is for other object types
      return cell.value;
    }
  }
  return cell.value; // Return raw value for plain strings, numbers, etc.
}


function getSheetDataFromWorksheet(worksheet: any) {
  var sheetData: any[][] = [];

  worksheet.eachRow({ includeEmpty: true }, (row: any, rowNumber: any) => {
    const rowData: any[] = [];

    row.eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
      const cellValue = getRawCellValue(cell);
      rowData[colNumber - 1] = cellValue; // Store cell value (0-based index)
    });

    // Push non-empty row only
    if (rowData.some(value => value !== null && value !== undefined)) {
      sheetData[rowNumber - 1] = rowData; // Store row data (0-based index)
    }
  });
  return sheetData;
}

function getJsonData(sheetData: any, getRow = false, getSheetName = false, sheetName = "sheet1") {
  const jsonData: any[] = [];
  const headers = sheetData[0]; // Extract the headers from the first row

  for (let i = 1; i < sheetData.length; i++) {
    const rowData: any = {};
    const row = sheetData[i];
    if (row) {
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j];
        const value = row[j] === undefined || row[j] === "" ? "" : row[j];
        if (value || value === 0) {
          rowData[key] = value;
        }
      }
      if (Object.keys(rowData).length > 0) {
        if (getRow) rowData["!row#number!"] = i + 1;
        if (getSheetName) rowData["!sheet#name!"] = sheetName;
        jsonData.push(rowData);
      }
    }
  };
  return jsonData;
}


export const getSheetData = async (
  fileUrl: string,
  sheetName: string,
  getRow = false
) => {
  const workbook: any = await getExcelWorkbookFromFileURL(fileUrl, sheetName);

  const worksheet: any = workbook.getWorksheet(sheetName);

  // Collect sheet data by iterating through rows and cells
  const sheetData = getSheetDataFromWorksheet(worksheet);
  const jsonData = getJsonData(sheetData, getRow);
  return jsonData;
};


export const getNewExcelWorkbook = () => {
  const workbook = new ExcelJS.Workbook();
  return workbook;
};

// Function to retrieve workbook from Excel file URL and sheet name
export const getExcelWorkbookFromFileURL = async (
  fileUrl: string,
  sheetName: string
) => {
  // Define headers for HTTP request
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/pdf",
  };
  logger.info("loading for the file based on fileurl");
  // Make HTTP request to retrieve Excel file as arraybuffer
  const responseFile = await httpRequest(
    fileUrl,
    null,
    {},
    "get",
    "arraybuffer",
    headers
  );
  logger.info("received the file response");

  // Create a new workbook instance
  const workbook = getNewExcelWorkbook();
  await workbook.xlsx.load(responseFile);
  logger.info("workbook created based on the fileresponse");

  // Check if the specified sheet exists in the workbook
  const worksheet = workbook.getWorksheet(sheetName);
  if (sheetName && !worksheet) {
    throwError(
      "FILE",
      400,
      "INVALID_SHEETNAME",
      `Sheet with name "${sheetName}" is not present in the file.`
    );
  }

  // Return the workbook
  return workbook;
};

export function prepareDataForExcel(boundaryDataForSheet: any, hierarchy: any[], boundaryMap: any) {
  const data = boundaryDataForSheet.map((boundary: any[]) => {
    const boundaryCode = boundary.pop();
    const boundaryValues = boundary.map(obj => obj.value);
    const rowData = boundaryValues.concat(Array(Math.max(0, hierarchy.length - boundary.length)).fill(''));
    const boundaryCodeIndex = hierarchy.length;
    rowData[boundaryCodeIndex] = boundaryCode;
    return rowData;
  });
  return data;
}

export async function createExcelSheet(data: any, headers: any) {
  var rows = [headers, ...data];
  return rows;
}

export function addDataToSheet(sheet: any, sheetData: any, firstRowColor: string = '93C47D', columnWidth: number = 40, frozeCells: boolean = false, frozeWholeSheet: boolean = false) {
  sheetData?.forEach((row: any, index: number) => {
    const worksheetRow = sheet.addRow(row);

    if (index === 0) {
      formatFirstRow(worksheetRow, sheet, firstRowColor, columnWidth, frozeCells);
    } else {
      formatOtherRows(worksheetRow, frozeCells);
    }
  });

  finalizeSheet(sheet, frozeCells, frozeWholeSheet);
}

// Function to finalize the sheet settings
function finalizeSheet(sheet: any, frozeCells: boolean, frozeWholeSheet: boolean) {
  if (frozeCells) {
    performUnfreezeCells(sheet);
  }
  if (frozeWholeSheet) {
    performFreezeWholeSheet(sheet);
  }
  updateFontNameToRoboto(sheet);
  sheet.views = [{ state: 'frozen', ySplit: 1, zoomScale: 110 }];
}

function updateFontNameToRoboto(worksheet: ExcelJS.Worksheet) {
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      // Preserve existing font properties
      const existingFont = cell.font || {};

      // Update only the font name to Roboto
      cell.font = {
        ...existingFont, // Spread existing properties
        name: 'Roboto'   // Update the font name
      };
    });
  });
}

function performUnfreezeCells(sheet: any) {
  logger.info(`Unfreezing the sheet ${sheet.name}`);

  let lastFilledColumn = 1;
  sheet.getRow(1).eachCell((cell: any, colNumber: number) => {
    if (cell.value !== undefined && cell.value !== null && cell.value !== '') {
      lastFilledColumn = colNumber;
    }
  });

  for (let row = 1; row <= parseInt(config.values.unfrozeTillRow); row++) {
    for (let col = 1; col <= lastFilledColumn; col++) {
      const cell = sheet.getCell(row, col);
      if (!cell.value && cell.value !== 0) {
        cell.protection = { locked: false };
      }
    }
  }
  sheet.protect('passwordhere', { selectLockedCells: true, selectUnlockedCells: true });
}


function performFreezeWholeSheet(sheet: any) {
  logger.info(`Freezing the whole sheet ${sheet.name}`);
  sheet.eachRow((row: any) => {
    row.eachCell((cell: any) => {
      cell.protection = { locked: true };
    });
  });
  sheet.protect('passwordhere', { selectLockedCells: true });
}


// Function to format the first row
function formatFirstRow(row: any, sheet: any, firstRowColor: string, columnWidth: number, frozeCells: boolean) {
  row.eachCell((cell: any, colNumber: number) => {
    setFirstRowCellStyles(cell, firstRowColor, frozeCells);
    adjustColumnWidth(sheet, colNumber, columnWidth);
    adjustRowHeight(row, cell, columnWidth);
  });
}

// Function to set styles for the first row's cells
function setFirstRowCellStyles(cell: any, firstRowColor: string, frozeCells: boolean) {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: firstRowColor }
  };

  cell.font = { bold: true };

  if (frozeCells) {
    cell.protection = { locked: true };
  }

  cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
}

// Function to adjust column width
function adjustColumnWidth(sheet: any, colNumber: number, columnWidth: number) {
  sheet.getColumn(colNumber).width = columnWidth;
}

// Function to adjust row height based on content
function adjustRowHeight(row: any, cell: any, columnWidth: number) {
  const text = cell.value ? cell.value.toString() : '';
  const lines = Math.ceil(text.length / (columnWidth - 2)); // Approximate number of lines
  row.height = Math.max(row.height ?? 0, lines * 15);
}

// Function to format cells in other rows
function formatOtherRows(row: any, frozeCells: boolean) {
  row.eachCell((cell: any) => {
    if (frozeCells) {
      cell.protection = { locked: true };
    }
  });
  row.alignment = { wrapText: true };
}

export const freezeStatusColumn = (worksheet: any) => {
  // Find the column index of the header '!status!'
  const statusColumnIndex = worksheet.getRow(1).values.indexOf('!status!');

  if (statusColumnIndex !== -1) {
    // Protect the worksheet
    worksheet.protect('passwordhere', {
      selectLockedCells: true,
      selectUnlockedCells: true
    });

    // Lock the status column up to 10,000 rows
    for (let i = 1; i <= parseInt(config.values.unfrozeTillRow); i++) {
      const cell = worksheet.getRow(i).getCell(statusColumnIndex);
      cell.protection = { locked: true };
    }
  }
};


export async function addErrorsToSheet(request: any, worksheet: any, errors: any, errorStatus: any) {
  if (errors) {
    // Find the first unfilled column
    const headerRow = worksheet.getRow(1);
    let statusColIndex: number | undefined;
    let errorsColIndex: number | undefined;
    let firstEmptyColIndex: number | undefined;

    headerRow.eachCell((cell: any, colNumber: any) => {
      if (cell.value == '!status!') {
        statusColIndex = colNumber;
      }
      if (cell.value == '!errors!') {
        errorsColIndex = colNumber;
      }
      firstEmptyColIndex = colNumber + 1;
    });

    // If !errors! column is not found, use the first empty column
    if (errorsColIndex === undefined && firstEmptyColIndex !== undefined) {
      errorsColIndex = firstEmptyColIndex;
      var cell = headerRow.getCell(errorsColIndex);
      cell.value = '!errors!';
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '93C47D' }
      };
      cell.font = { bold: true, name: 'Roboto' };
      worksheet.getColumn(errorsColIndex).width = 40;
      headerRow.commit();
    }

    if (statusColIndex === undefined || errorsColIndex === undefined) {
      throw new Error('!status! column not found and no empty column available for !errors!');
    }
    for (const data of request?.body?.dataToCreate) {
      const rowNumber = data?.["!row#number!"];
      const row = worksheet.getRow(rowNumber);
      if (errors[rowNumber] as string[]) {
        console.log(errors[rowNumber], " eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        row.getCell(statusColIndex).value = errorStatus;
        row.getCell(errorsColIndex).value = (errors[rowNumber] as string[]).join(', ');
        row.commit();
      }
      else {
        row.getCell(statusColIndex).value = '';
        row.getCell(errorsColIndex).value = '';
        row.commit();
      }
    }

    // Iterate through the errors object
    for (const [rowNum, errorMessages] of Object.entries(errors)) {
      const row = worksheet.getRow(Number(rowNum));

      // Add 'invalid' to the !status! column
      row.getCell(statusColIndex).value = errorStatus;

      // Add the error messages to the !errors! column
      row.getCell(errorsColIndex).value = (errorMessages as string[]).join(', ');

      // Commit the row changes
      row.commit();
    }
  }
}

export async function formatProcessedSheet(worksheet: any) {
  // Find the indices of the !status! and !errors! columns
  const headerRow = worksheet.getRow(1);
  let statusColIndex: number | undefined;
  let errorsColIndex: number | undefined;

  headerRow.eachCell((cell: any, colNumber: any) => {
    if (cell.value === '!status!') {
      statusColIndex = colNumber;
    }
    if (cell.value === '!errors!') {
      errorsColIndex = colNumber;
    }
  });

  if (statusColIndex === undefined || errorsColIndex === undefined) {
    throw new Error('!status! or !errors! column not found');
  }

  // Unlock all cells first
  worksheet.eachRow({ includeEmpty: true }, (row: any) => {
    row.eachCell({ includeEmpty: true }, (cell: any) => {
      cell.protection = { locked: false };
    });
  });

  // Lock the !status! and !errors! columns till specified rows
  const unfrozeTillRow = parseInt(config.values.unfrozeTillRow, 10);
  for (let i = 2; i <= unfrozeTillRow; i++) {
    const statusCell = worksheet.getRow(i).getCell(statusColIndex);
    const errorsCell = worksheet.getRow(i).getCell(errorsColIndex);

    statusCell.protection = { locked: true };
    errorsCell.protection = { locked: true };
  }

  // Protect the entire worksheet to enforce the cell protections
  await worksheet.protect('passwordhere', {
    selectLockedCells: true,
    selectUnlockedCells: true
  });
}