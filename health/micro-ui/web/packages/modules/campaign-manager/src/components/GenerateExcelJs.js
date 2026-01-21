import React from "react";
import ExcelJS from "exceljs";
import { useTranslation } from "react-i18next";

/**
 * GenerateExcelJs Component
 *
 * Generates a single Excel file with all locales as separate message columns.
 * Within the file, messages are grouped by module with each module as a separate sheet/tab.
 * Columns: code, message_en_MZ, message_fr_MZ, etc. (module column hidden from UI but used internally)
 *
 * Uses ExcelJS library for better column protection support.
 *
 * @param {Object} props
 * @param {React.RefObject} props.inputRef - Reference to trigger the export
 * @param {Array} props.jsonData - Array of localization message objects
 * @param {Array} props.languages - Array of available languages/locales from initStore (e.g., [{value: "en_MZ", label: "English"}, ...])
 * @param {boolean} props.skipHeader - Whether to skip header row (default: false)
 * @param {string} props.sheetName - Base name for the Excel file (default: "Localizations")
 * @param {Array} props.moduleOptions - Optional array of module objects for explicit module selection
 * @param {Object} props.baseModuleMessages - Map of moduleValue -> { code -> message } for default locale from base modules
 */
const GenerateExcelJs = ({
  inputRef,
  jsonData = [],
  languages = [],
  skipHeader = false,
  sheetName = "Localizations",
  moduleOptions = [],
  baseModuleMessages = {},
}) => {
  const { t } = useTranslation();

  /**
   * Sanitize sheet name for Excel compatibility
   * Excel sheet names cannot contain: : \ / ? * [ ]
   * and must be <= 31 characters
   */
  const sanitizeSheetName = (name) => {
    if (!name) return "Sheet1";
    return name
      .replace(/[:\\/?*\[\]]/g, "_")
      .substring(0, 31);
  };

  /**
   * Calculate optimal column widths based on content
   * All columns have minimum width of 100, but can extend to fit longer content
   * @param {Array} data - Array of row objects
   * @param {Array} headers - Array of header names
   * @returns {Array} Array of column width values
   */
  const calculateColumnWidths = (data, headers) => {
    const MIN_WIDTH = 100;

    return headers.map((header) => {
      // Calculate width based on content
      let maxLength = header.toString().length;

      data.forEach((row) => {
        const value = row[header];
        if (value !== undefined && value !== null) {
          const length = value.toString().length;
          if (length > maxLength) {
            maxLength = length;
          }
        }
      });

      // Add padding and ensure minimum width of 100
      return Math.max(maxLength + 5, MIN_WIDTH);
    });
  };

  /**
   * Group messages by module and code, merging locale messages into columns
   * @param {Array} messages - Array of localization messages
   * @param {Array} locales - Array of locale values
   * @param {Object} baseMessages - Map of moduleValue -> { code -> message } for first locale from base modules
   * @param {string} firstLocale - The first locale value (languages[0].value) to be protected
   * @returns {Object} Object with module names as keys and arrays of merged rows as values
   */
  const groupAndMergeByModule = (messages, locales, baseMessages = {}, firstLocale) => {
    // First, create a map: module -> code -> { code, module, message_locale1, message_locale2, ... }
    const moduleMap = {};

    // First, populate from base module messages (for first locale)
    Object.entries(baseMessages).forEach(([moduleName, codeMap]) => {
      if (!moduleMap[moduleName]) {
        moduleMap[moduleName] = {};
      }
      Object.entries(codeMap).forEach(([code, message]) => {
        if (!moduleMap[moduleName][code]) {
          moduleMap[moduleName][code] = {
            code: code,
            module: moduleName,
          };
          // Initialize all locale columns as empty
          locales.forEach((loc) => {
            moduleMap[moduleName][code][`message_${loc}`] = "";
          });
        }
        // Set the first locale message from base module
        moduleMap[moduleName][code][`message_${firstLocale}`] = message || "";
      });
    });

    // Then, overlay with campaign-specific messages
    messages.forEach((message) => {
      const moduleName = message.module || "default";
      const code = message.code || "";
      const locale = message.locale || firstLocale;

      if (!moduleMap[moduleName]) {
        moduleMap[moduleName] = {};
      }

      if (!moduleMap[moduleName][code]) {
        moduleMap[moduleName][code] = {
          code: code,
          module: moduleName,
        };
        // Initialize all locale columns as empty
        locales.forEach((loc) => {
          moduleMap[moduleName][code][`message_${loc}`] = "";
        });
      }

      // Set the message for this locale (don't override first locale if it comes from base)
      // Only set if it's not first locale OR if first locale message is empty
      if (locale !== firstLocale || !moduleMap[moduleName][code][`message_${firstLocale}`]) {
        moduleMap[moduleName][code][`message_${locale}`] = message.message || "";
      }
    });

    // Convert the map to arrays grouped by module
    const grouped = {};
    Object.keys(moduleMap).forEach((moduleName) => {
      grouped[moduleName] = Object.values(moduleMap[moduleName]);
    });

    return grouped;
  };

  /**
   * Main export handler
   */
  const handleExport = async () => {
    // Get all locales from languages
    const allLocales = languages?.length > 0
      ? languages.map((l) => l.value)
      : [];

    // Get the first locale value (languages[0].value) - this will be the protected column
    const firstLocale = allLocales[0];

    // Create a map from locale value to display label
    const localeLabelsMap = {};
    languages.forEach((loc) => {
      localeLabelsMap[loc.value] = loc.label;
    });

    // Internal data keys (used in data objects) - module is kept internally but hidden from UI
    const dataKeys = ["code", ...allLocales.map((loc) => `message_${loc}`)];

    // Display headers for Excel columns (using translated labels) - module column hidden
    // Use localization codes for headers to support all languages
    const displayHeaders = [t("DIGIT_LOC_CODE_HEADER"), ...allLocales.map((loc) => {
      const label = localeLabelsMap[loc] || loc;
      return t(`DIGIT_LOC_MESSAGE_HEADER_${label}`);
    })];

    // Find the index of the first locale column (languages[0])
    // Headers are: code, message_<first_locale>, message_<second_locale>, etc.
    // So first locale column index is 2 (1-based in ExcelJS): code=1, first_locale=2
    const firstLocaleColIndex = 2; // 1-based for ExcelJS

    // Flatten if wrapped in an array
    const flatMessages = jsonData && jsonData.length
      ? (Array.isArray(jsonData[0]) ? jsonData[0] : jsonData)
      : [];

    // Group and merge messages by module, including base module messages for first locale
    const messagesByModule = groupAndMergeByModule(flatMessages, allLocales, baseModuleMessages, firstLocale);

    // Use moduleOptions if provided, otherwise fall back to modules from data
    if (moduleOptions.length === 0 && Object.keys(messagesByModule).length === 0) {
      return;
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "DIGIT HCM";
    workbook.created = new Date();

    // Add a sheet for each module
    const modulesToExport = moduleOptions.length > 0
      ? moduleOptions
      : Object.keys(messagesByModule).sort().map((m) => ({ name: m, value: m }));

    for (let modIndex = 0; modIndex < modulesToExport.length; modIndex++) {
      const moduleOption = modulesToExport[modIndex];
      const moduleValue = moduleOption.value;
      const moduleDisplayName = moduleOption.name;

      // Get messages for this module, or create empty template row
      const moduleMessages = messagesByModule[moduleValue] || [];

      // If no messages, create an empty template row
      const rawData = moduleMessages.length > 0
        ? moduleMessages
        : [dataKeys.reduce((acc, h) => ({ ...acc, [h]: "" }), {})];

      // Transform data keys to display headers
      const sheetData = rawData.map((row) => {
        const newRow = {};
        dataKeys.forEach((key, index) => {
          newRow[displayHeaders[index]] = row[key] || "";
        });
        return newRow;
      });

      // Use display name for sheet tab, sanitized for Excel
      const safeSheetName = sanitizeSheetName(moduleDisplayName);

      // Create worksheet
      const worksheet = workbook.addWorksheet(safeSheetName, {
        properties: { defaultColWidth: 30 },
      });

      // Calculate column widths based on content (like GenerateXlsx)
      const columnWidths = calculateColumnWidths(sheetData, displayHeaders);

      // Define columns with headers and calculated widths
      worksheet.columns = displayHeaders.map((header, index) => ({
        header: header,
        key: header,
        width: columnWidths[index],
      }));

      // Add data rows (skip header if needed)
      if (!skipHeader) {
        // Header row is automatically added by ExcelJS when defining columns
      }

      // Add data rows
      sheetData.forEach((row) => {
        worksheet.addRow(row);
      });

      // Only the first locale column (column 2, 1-based) should be visually marked as protected/read-only
      // Columns: code=1, first_locale=2, other_locales=3+

      // Style the header row (row 1) - Orange background for all headers, Gray for first locale
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        const isFirstLocaleCol = colNumber === firstLocaleColIndex;
        const isCodeCol = colNumber === 1; // code column is now column 1 (module removed)

        cell.font = { name: "Roboto", bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: isFirstLocaleCol ? "FF808080" : "FFC84C0E" }, // Gray for first locale header, Orange for others
        };
        // Code header should not wrap
        cell.alignment = { wrapText: !isCodeCol, vertical: "center", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
        // Lock all header cells to prevent editing
        cell.protection = { locked: true };
      });

      // Style data rows - ONLY first locale column (column 2) gets gray background and is locked
      // All other columns are ALWAYS editable regardless of their content
      // Columns: code=1, first_locale=2, other_locales=3+
      for (let rowNum = 2; rowNum <= worksheet.rowCount; rowNum++) {
        const row = worksheet.getRow(rowNum);

        // Iterate through all columns using column count from headers
        for (let colNum = 1; colNum <= displayHeaders.length; colNum++) {
          const cell = row.getCell(colNum);
          // IMPORTANT: Protection is based ONLY on column position, NOT on cell content
          const isFirstLocaleCol = colNum === firstLocaleColIndex;

          // Set font for all data cells
          cell.font = { name: "Roboto" };

          // Apply fill color - gray ONLY for first locale column (column 2)
          // All other columns get no fill (white) regardless of whether they have content
          if (isFirstLocaleCol) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFE8E8E8" }, // Light gray for protected column
            };
          }
          // Non-first-locale columns: no explicit fill (uses default/white)

          // Code column (1) should NOT wrap text
          // Message columns should wrap text
          const isCodeCol = colNum === 1;
          cell.alignment = { wrapText: !isCodeCol, vertical: "top" };
          cell.border = {
            top: { style: "thin", color: { argb: "FFCCCCCC" } },
            bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
            left: { style: "thin", color: { argb: "FFCCCCCC" } },
            right: { style: "thin", color: { argb: "FFCCCCCC" } },
          };

          // CRITICAL: Protection is based ONLY on column position
          // Column 2 (first locale) = locked
          // All other columns (1, 3, 4, 5, ...) = unlocked (editable)
          cell.protection = { locked: isFirstLocaleCol };
        }
      }

      // Enable sheet protection - cells with locked:false will be editable
      await worksheet.protect("", {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        insertHyperlinks: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
        pivotTables: false,
      });
    }

    // Generate and download the file
    const fileName = `${sheetName}.xlsx`;
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      // Download failed - error handled silently
    }
  };

  return (
    <div style={{ display: "none" }}>
      <button ref={inputRef} onClick={handleExport}>
        {t("WBH_DOWNLOAD_XLS")}
      </button>
    </div>
  );
};

export default GenerateExcelJs;
