import React from "react";
import * as XLSX from "xlsx";
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
 * @param {Array} props.localeData - Array of available locales
 * @param {boolean} props.skipHeader - Whether to skip header row (default: false)
 * @param {string} props.sheetName - Base name for the Excel file (default: "Localizations")
 * @param {Array} props.moduleOptions - Optional array of module objects for explicit module selection
 */
const GenerateXlsx = ({ inputRef, jsonData = [], localeData = [], skipHeader = false, sheetName = "Localizations", moduleOptions = [] }) => {
  const { t } = useTranslation();

  /**
   * Calculate optimal column widths based on content
   * @param {Array} data - Array of row objects
   * @param {Array} headers - Array of header names
   * @returns {Array} Array of column width objects
   */
  const calculateColumnWidths = (data, headers) => {
    const columnWidths = headers.map((header) => {
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
   * @returns {Object} Object with module names as keys and arrays of merged rows as values
   */
  const groupAndMergeByModule = (messages, locales) => {
    // First, create a map: module -> code -> { code, module, message_locale1, message_locale2, ... }
    const moduleMap = {};

    messages.forEach((message) => {
      const moduleName = message.module || "default";
      const code = message.code || "";
      const locale = message.locale || "default";

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

      // Set the message for this locale
      moduleMap[moduleName][code][`message_${locale}`] = message.message || "";
    });

    // Convert the map to arrays grouped by module
    const grouped = {};
    Object.keys(moduleMap).forEach((moduleName) => {
      grouped[moduleName] = Object.values(moduleMap[moduleName]);
    });

    return grouped;
  };

  const handleExport = async () => {
    // Get all locales from localeData
    const allLocales = localeData?.length > 0
      ? localeData.map((l) => l.value)
      : ["default"];

    // Create a map from locale value to display label
    const localeLabelsMap = {};
    localeData.forEach((loc) => {
      localeLabelsMap[loc.value] = loc.label;
    });

    // Internal data keys (used in data objects)
    const dataKeys = ["module","code", ...allLocales.map((loc) => `message_${loc}`)];

    // Display headers for Excel columns (using locale labels)
    const displayHeaders = ["module","code", ...allLocales.map((loc) => {
      const label = localeLabelsMap[loc] || loc;
      return `message_${label}`;
    })];

    // Flatten if wrapped in an array
    const flatMessages = jsonData && jsonData.length
      ? (Array.isArray(jsonData[0]) ? jsonData[0] : jsonData)
      : [];

    // Group and merge messages by module
    const messagesByModule = groupAndMergeByModule(flatMessages, allLocales);

    // Use moduleOptions if provided, otherwise fall back to modules from data
    if (moduleOptions.length === 0 && Object.keys(messagesByModule).length === 0) {
      console.warn("No modules to export");
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
