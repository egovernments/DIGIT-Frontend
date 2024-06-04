import ExcelJS from "exceljs";

export const convertJsonToXlsx = (jsonData) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();

  // Iterate over each sheet in jsonData
  for (const [sheetName, data] of Object.entries(jsonData)) {
    // Create a new worksheet
    const worksheet = workbook.addWorksheet(sheetName);

    // Convert data to worksheet
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    // Make the first row bold
    if (worksheet.getRow(1)) {
      worksheet.getRow(1).font = { bold: true };
    }

    // Set column widths
    const columnCount = data?.[0]?.length || 0;
    const wscols = Array(columnCount).fill({ width: 30 });
    wscols.forEach((col, colIndex) => {
      worksheet.getColumn(colIndex + 1).width = col.width;
    });
  }

  // Write the workbook to a buffer
  return workbook.xlsx.writeBuffer({ compression: true }).then((buffer) => {
    // Create a Blob from the buffer
    return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  });
};
