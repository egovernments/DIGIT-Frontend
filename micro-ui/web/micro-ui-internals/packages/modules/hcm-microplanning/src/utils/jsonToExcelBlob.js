import ExcelJS from "exceljs";

export const convertJsonToXlsx = async (jsonData, columnWithStyle) => {
  const workbook = new ExcelJS.Workbook();

  for (const [sheetName, data] of Object.entries(jsonData)) {
    const worksheet = workbook.addWorksheet(sheetName);
    populateWorksheet(worksheet, data, columnWithStyle);
  }

  return await writeWorkbookToBuffer(workbook);
};

const populateWorksheet = (worksheet, data, columnWithStyle) => {
  data.forEach((row, rowIndex) => {
    const newRow = worksheet.addRow(row);
    if (columnWithStyle?.errorColumn && rowIndex > 0) {
      applyStyleToColumn(newRow, data[0], columnWithStyle);
    }
  });

  styleHeaderRow(worksheet);
  setColumnWidths(worksheet, data[0].length);
};

const applyStyleToColumn = (newRow, headerRow, columnWithStyle) => {
  const errorColumnIndex = headerRow.indexOf(columnWithStyle.errorColumn);
  if (errorColumnIndex !== -1) {
    const columnIndex = errorColumnIndex + 1;
    const newCell = newRow.getCell(columnIndex);
    if (columnWithStyle.style && newCell) {
      for (const key in columnWithStyle.style) {
        newCell[key] = columnWithStyle.style[key];
      }
    }
  }
};

const styleHeaderRow = (worksheet) => {
  const headerRow = worksheet.getRow(1);
  if (headerRow) {
    headerRow.font = { bold: true };
  }
};

const setColumnWidths = (worksheet, columnCount) => {
  const columnWidth = 30;
  for (let colIndex = 1; colIndex <= columnCount; colIndex++) {
    worksheet.getColumn(colIndex).width = columnWidth;
  }
};

const writeWorkbookToBuffer = async (workbook) => {
  const buffer = await workbook.xlsx.writeBuffer({ compression: true });
  return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
};
