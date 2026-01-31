import React from "react";
import * as XLSX from "xlsx-js-style";
import { useTranslation } from "react-i18next";

/**
 * GenerateXlsx Component
 *
 * Generates a single Excel file with all locales as separate message columns.
 * Within the file, messages are grouped by module with each module as a separate sheet/tab.
 * Columns: code, module, message_default, message_en_MZ, message_fr_MZ, etc.
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
const GenerateXlsx = ({
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
   * Calculate optimal column widths based on content
   * For message columns, use a fixed width to encourage text wrapping
   * @param {Array} data - Array of row objects
   * @param {Array} headers - Array of header names
   * @returns {Array} Array of column width objects
   */
  const calculateColumnWidths = (data, headers) => {
    const columnWidths = headers.map((header) => {
      // For message columns, use a fixed width of 50 characters
      // This encourages text wrapping in Excel
      if (header.startsWith("message_")) {
        return { wch: 100 };
      }

      // For other columns (code, module), calculate based on content
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

      return { wch: Math.min(maxLength + 2, 100) };
    });

    return columnWidths;
  };

  /**
   * Apply text wrap styling to all cells in the worksheet
   * @param {Object} worksheet - The worksheet to style
   * @param {number} rowCount - Number of data rows
   * @param {number} colCount - Number of columns
   * @param {number} protectedColIndex - Index of the column to mark as protected/read-only (optional)
   */
  const applyTextWrapToWorksheet = (worksheet, rowCount, colCount, protectedColIndex = -1) => {
    // Style for header row (first row)
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "C84C0E" } },
      alignment: { wrapText: true, vertical: "center", horizontal: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    // Style for protected header (first locale column) - Gray to indicate read-only
    const protectedHeaderStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "808080" } }, // Gray background for protected column
      alignment: { wrapText: true, vertical: "center", horizontal: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    // Style for data cells (editable - white background)
    const cellStyle = {
      alignment: { wrapText: true, vertical: "top" },
      fill: { fgColor: { rgb: "FFFFFF" } }, // Explicit white background for editable cells
      border: {
        top: { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left: { style: "thin", color: { rgb: "CCCCCC" } },
        right: { style: "thin", color: { rgb: "CCCCCC" } },
      },
    };

    // Style for protected data cells (read-only, gray background)
    const protectedCellStyle = {
      alignment: { wrapText: true, vertical: "top" },
      fill: { fgColor: { rgb: "E8E8E8" } }, // Light gray background for protected cells
      border: {
        top: { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left: { style: "thin", color: { rgb: "CCCCCC" } },
        right: { style: "thin", color: { rgb: "CCCCCC" } },
      },
    };

    // Iterate through all cells and apply styles
    for (let row = 0; row <= rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cellAddress]) {
          const isProtectedCol = col === protectedColIndex;
          if (row === 0) {
            // Header row
            worksheet[cellAddress].s = isProtectedCol ? protectedHeaderStyle : headerStyle;
          } else {
            // Data rows
            worksheet[cellAddress].s = isProtectedCol ? protectedCellStyle : cellStyle;
          }
        }
      }
    }
  };

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

    // Internal data keys (used in data objects)
    const dataKeys = ["module","code", ...allLocales.map((loc) => `message_${loc}`)];

    // Display headers for Excel columns (using locale labels)
    const displayHeaders = ["module","code", ...allLocales.map((loc) => {
      const label = localeLabelsMap[loc] || loc;
      return `message_${label}`;
    })];

    // Find the index of the first locale column (languages[0])
    // Headers are: module, code, message_<first_locale>, message_<second_locale>, etc.
    // So first locale column index is 2 (0-based): module=0, code=1, first_locale=2
    const firstLocaleColIndex = 2;

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
    const workbook = XLSX.utils.book_new();

    // Add a sheet for each module
    const modulesToExport = moduleOptions.length > 0
      ? moduleOptions
      : Object.keys(messagesByModule).sort().map((m) => ({ name: m, value: m }));

    modulesToExport.forEach((moduleOption) => {
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

      // Create worksheet from JSON
      const worksheet = XLSX.utils.json_to_sheet(sheetData, {
        header: displayHeaders,
        skipHeader: skipHeader,
      });

      // Calculate and set column widths based on content
      const columnWidths = calculateColumnWidths(sheetData, displayHeaders);
      worksheet["!cols"] = columnWidths;

      // Apply text wrap styling to all cells, with visual styling for first locale column (gray background)
      // Note: xlsx-js-style doesn't support column-level protection (only sheet-level)
      // The gray background visually indicates read-only, and upload logic enforces it by skipping first locale
      applyTextWrapToWorksheet(worksheet, sheetData.length, displayHeaders.length, firstLocaleColIndex);

      // Use display name for sheet tab, sanitized for Excel
      const safeSheetName = sanitizeSheetName(moduleDisplayName);

      // Append sheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
    });

    // Download the single file
    const fileName = `${sheetName}.xlsx`;
    try {
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error(`Failed to download ${fileName}:`, error);
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

export default GenerateXlsx;
