import * as XLSX from "xlsx";

// Magic byte signatures for valid Excel file types
const XLSX_MAGIC = [0x50, 0x4b, 0x03, 0x04]; // PK\x03\x04 — ZIP format used by .xlsx
const XLS_MAGIC = [0xd0, 0xcf, 0x11, 0xe0];  // Compound Document Binary Format used by .xls

// Patterns that indicate embedded malicious content within raw file bytes
const MALICIOUS_PATTERNS = [
  /<script[\s>]/i,
  /on(?:click|load|mouseover|mouseout|error|submit|focus|blur|change|keydown|keyup|keypress|dblclick|contextmenu|drag|drop|paste|copy|cut)\s*=/i,
  /javascript\s*:/i,
  /<%[\s\S]{0,500}%>/,  // JSP / ASP server-side tags
  /<\?php/i,
  /vbscript\s*:/i,
];

const checkMagicBytes = (data, extension) => {
  const magic = extension === "xlsx" ? XLSX_MAGIC : XLS_MAGIC;
  return magic.every((byte, i) => data[i] === byte);
};

const containsMaliciousContent = (data) => {
  const rawText = new TextDecoder("utf-8", { fatal: false }).decode(data);
  return MALICIOUS_PATTERNS.some((pattern) => pattern.test(rawText));
};

const validateBoundaryExcelContent = async (file, t, hierarchyColumnsCount) => {
  return new Promise((resolve) => {
    const extension = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);

      // 1. Magic bytes check — ensure the file signature matches the declared extension
      if (!checkMagicBytes(data, extension)) {
        resolve({ success: false, error: t("INVALID_FILE_CONTENT") });
        return;
      }

      // 2. Raw content scan — reject files containing embedded malicious code patterns
      if (containsMaliciousContent(data)) {
        resolve({ success: false, error: t("MALICIOUS_CONTENT_DETECTED") });
        return;
      }

      // 3. Parse and validate data structure
      let workbook;
      try {
        workbook = XLSX.read(data, { type: "array" });
      } catch {
        resolve({ success: false, error: t("INVALID_FILE_CONTENT") });
        return;
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Extract data including dynamic headers
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      const headers = jsonData[0]; // First row contains the headers
      let rows = jsonData.slice(1); // Remaining rows are data
      if (headers.length === 0) {
        resolve({ success: false, error: t("BOUNDARY_EMPTY_SHEET") });
        return;
      }
      // Remove empty rows immediately following the headers
      while (rows.length > 0 && rows[0].every((cell) => !cell?.trim())) {
        rows = rows.slice(1); // Remove the first row if it's empty
      }
      if (rows.length === 0) {
        resolve({ success: false, error: t("BOUNDARY_NO_VALID_ROWS") });
        return;
      }
      // Only validate hierarchy columns; skip metadata columns (Service Boundary Code, Boundary translations, etc.)
      // hierarchyColumnsCount is derived from the boundary hierarchy definition, so it adapts
      // automatically to any hierarchy structure and is independent of locale/translations
      const validateColumnsCount = hierarchyColumnsCount || headers.length;
      // Perform validations
      const errors = [];
      const referenceCountry = rows[0]?.[0]?.trim(); // Reference country from the first column, first row
      rows.forEach((row, rowIndex) => {
        // Single country validation (based on the first column)
        if (row[0]?.trim() && row[0]?.trim() !== referenceCountry) {
          errors.push(`${t("Row")} ${rowIndex + 2}: ${t("MULTIPLE_COUNTRIES_CANNOT_EXIST")}`);
        }
        // Hierarchical dependency validation
        for (let colIndex = 1; colIndex < validateColumnsCount; colIndex++) {
          const currentCell = row[colIndex]?.trim();
          const previousCell = row[colIndex - 1]?.trim();
          if (currentCell && !previousCell) {
            errors.push(
              `${t("BOUNDARY_ROW")} ${rowIndex + 2}: ${t("BOUNDARY_COLUMN")} "${headers[colIndex]}" ${t("BOUNDARY_FILLED")} "${headers[colIndex - 1]}" ${t("BOUNDARY_EMPTY")}`
            );
          }
        }
      });
      if (errors.length > 0) {
        resolve({ success: false, error: errors.join("\n") });
      } else {
        resolve({ success: true });
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export default validateBoundaryExcelContent;