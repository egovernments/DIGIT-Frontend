import React from "react";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import { LOCALIZATION } from "../constants/localizationConstants";

const GenerateXlsx = ({ inputRef, jsonData = [], localeData = [], skipHeader = false, sheetName = "template" }) => {
  const { t } = useTranslation();

  const handleExport = () => {
    // ✅ Fallback data (in case jsonData is empty)
    const data =
      jsonData && jsonData.length
        ? jsonData
        : [
            {
              code: "WBH_MDMS_MASTER_ACCESSCONTROL_ACTIONS_TEST",
              message: "Access Control",
              module: "rainmaker-workbench",
              locale: Digit?.Utils?.getDefaultLanguage?.() || "default",
            },
          ];

    // ✅ Flatten if wrapped in an array
    const allMessages = Array.isArray(data[0]) ? data[0] : data;

    // ✅ Get all locales — prefer from localeData
    const allLocales = localeData?.length > 0 ? localeData.map((l) => l.value) : [...new Set(allMessages.map((m) => m.locale))];

    // ✅ Sanitize name for Excel
    const safeName = (name) => name?.replace(/[:\\/?*\[\]]/g, "").substring(0, 31) || "Sheet1";

    // ✅ Export separate XLSX file for each locale
    allLocales.forEach((locale) => {
      try {
        const localeMessages = allMessages.filter((m) => m.locale === locale);

        const sheetData =
          localeMessages.length > 0
            ? localeMessages
            : [
                {
                  code: "",
                  message: "",
                  module: sheetName,
                  locale,
                },
              ];

        const ws = XLSX.utils.json_to_sheet(sheetData, { skipHeader });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, safeName(locale));

        const fileName = `${sheetName}_${locale}.xlsx`;
        XLSX.writeFile(wb, fileName);
      } catch (error) {
        console.error(`Failed to generate XLSX for locale ${locale}:`, error);
      }
    });
  };

  return (
    <div style={{ display: "none" }}>
      <button ref={inputRef} onClick={handleExport}>
        {t(LOCALIZATION.WBH_DOWNLOAD_XLS)} {/* ✅ i18n key for “Export XLSX Files” */}
      </button>
    </div>
  );
};

export default GenerateXlsx;
