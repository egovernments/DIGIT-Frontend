import XLSX from "xlsx";

export const parseXlsToJson = (event, setter) => {
  event.preventDefault();

  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet

    const result = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    setter(() => result);
  };

  reader.readAsArrayBuffer(file);
};

export const parseXlsToJsonMultipleSheets = (uploadEvent, options) => {
  const allowedFileTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];

  return new Promise((resolve, reject) => {
    const uploadedFile = uploadEvent.target.files[0];

    // if (!allowedFileTypes.includes(uploadedFile.type)) {
    //   reject(new Error('WBH_LOC_INAVLID_FILY_TYPE'));
    //   return;
    // }
    const reader = new FileReader();

    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "arraybuffer" });
      const jsonData = {};

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        // const options = { header: 1 };
        const jsonSheetData = XLSX.utils.sheet_to_json(worksheet, options);
        // Remove leading and trailing spaces from each cell
        // Remove leading and trailing spaces from each cell
      // Remove leading and trailing spaces from each cell
      for (let i = 0; i < jsonSheetData.length; i++) {
        for (let j = 0; j < jsonSheetData[i].length; j++) {
          const cell = jsonSheetData[i][j];
          if (typeof cell === 'string') {
            jsonSheetData[i][j] = cell.trim(); // Trim leading and trailing spaces if it's a string
          }
        }
      }
        jsonData[sheetName] = jsonSheetData;
      });

      resolve(jsonData);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsArrayBuffer(uploadEvent.target.files[0]);
  });
};
