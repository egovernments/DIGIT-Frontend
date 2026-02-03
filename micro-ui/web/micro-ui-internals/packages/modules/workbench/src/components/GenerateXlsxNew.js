import React from "react";
import XLSX from "xlsx";
import ExcelJS from "exceljs";

const GenerateXlsxNew = ({ inputRef, jsonData, skipHeader, sheetName, localeData }) => {
  const handleExport = async () => {
    // Sample JSON data
    const Data = jsonData || [
      {
        code: "WBH_MDMS_MASTER_ACCESSCONTROL_ACTIONS_TEST",
        message: "Access Control",
        module: "rainmaker-workbench",
        locale: Digit.Utils.getDefaultLanguage(),
      },
    ];

    //Creating a map of locale values to their labels
    const localeMap = {};
    localeData.forEach(({ value, label }) => {
      localeMap[value] = label || value || "";
    });

    //Getting all unique locales
    const uniqueLocales = [...new Set(Data.map((item) => item.locale))];

    //Organizing the jsonData by 'code'
    const groupedData = {};
    Data.forEach((item) => {
      const { code, message, locale } = item;
      if (!groupedData[code]) {
        groupedData[code] = { code, message };
      }
      groupedData[code][localeMap[locale] || locale] = item.message; // Storing the message under the locale
    });

    //Converting grouped object into an array
    const formattedData = Object.values(groupedData);

    // Defining the column order with renamed locale headers
    const renamedLocales = uniqueLocales.map((locale) => localeMap[locale] || locale);
    const columnOrder = [...renamedLocales, "code"];

    // Reformating the data to match the column order
    const updatedFormattedData = formattedData.map((row) => {
      let reorderedRow = {};
      columnOrder.forEach((key) => {
        reorderedRow[key] = row[key] || "";
      });
      return reorderedRow;
    });

    // Creating a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName || "Sheet1");

    // Adding headers
    if (!skipHeader) {
      worksheet.addRow(columnOrder);
    }
    // Adding data rows
    updatedFormattedData.forEach((row) => {
      worksheet.addRow(columnOrder.map((key) => row[key] || ""));
    });

    // Auto-sizing columns based on content
    worksheet.columns = columnOrder.map((col) => ({
      header: col,
      key: col,
      width: 40,
    }));

    await worksheet.protect("editDefaultMessage"); 

    // Unlock all columns first (Excel locks everything by default)**
    worksheet.columns.forEach((col) => {
      col.alignment = { wrapText: true, vertical: 'top' }; 
      col.protection = { locked: false }; // Unlock all columns
    });
  
    // Lock only the "Default" column**
    const defaultColumnIndex = columnOrder.indexOf("Message") + 1; 
    if (defaultColumnIndex > 0) {
      worksheet.getColumn(defaultColumnIndex).protection = { locked: true };
    }
  
    // Generating XLSX file and triggering download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${sheetName || "template"}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "none" }}>
      <h1>JSON to XLSX Converter</h1>
      <button ref={inputRef} onClick={handleExport}>
        Export to XLSX
      </button>
    </div>
  );
};

export default GenerateXlsxNew;
