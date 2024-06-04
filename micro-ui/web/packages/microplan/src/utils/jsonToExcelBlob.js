import XLSX from 'xlsx';

export const convertJsonToXlsx = (jsonData,options) => {
  const workbook = XLSX.utils.book_new();

  Object.keys(jsonData).forEach(sheetName => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData[sheetName], options);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', compression: true });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return blob;
  
};
