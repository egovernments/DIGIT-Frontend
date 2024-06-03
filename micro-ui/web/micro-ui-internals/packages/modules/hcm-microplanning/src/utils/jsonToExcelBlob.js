import XLSX from 'xlsx';

export const convertJsonToXlsx = (jsonData,options) => {
  const workbook = XLSX.utils.book_new();

  Object.entries(jsonData).forEach(([sheetName, data]) => {
    const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    let columnCount = data?.[0]?.length || 0;
    const wscols = Array(columnCount).fill({ width: 30 });
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', compression: true });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return blob;
  
};
