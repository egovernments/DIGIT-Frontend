import React, { useState } from "react";
import { TextInput, Button } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { wrap } from "lodash";

const CustomTabs = ({ locales, activeLocale, onTabChange }) => {
  const { t } = useTranslation();
  return (
    <div className="localization-tabs" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          className={`tab-button ${locale === activeLocale ? "active" : ""}`}
          onClick={() => onTabChange(locale)}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            background: locale === activeLocale ? "#0075d2" : "#f0f0f0",
            color: locale === activeLocale ? "white" : "#666",
            cursor: "pointer"
          }}
        >
          {t(locale)}
        </button>
      ))}
    </div>
  );
};

const LocalisationEditorPopup = ({ locales, currentLocale, localisationData, onSave, onClose }) => {
  const { t } = useTranslation();
  const [activeLocale, setActiveLocale] = useState(locales[0]);
  const [translations, setTranslations] = useState({});

  const columns = [
    // {
    //   name: t("CODE"),
    //   selector: row => row.code,
    //   sortable: true,
    //   width: "30%"
    // },
    {
      name: t(currentLocale),
      selector: row => row.message,
      wrap: true,
      style: {
        whiteSpace: 'normal',
        overflowWrap: 'break-word'
      },
      width: "45%"
    },
    {
      name: t(activeLocale),
      cell: row => (
        <TextInput
          value={translations[row.code]?.[activeLocale] || ""}
          onChange={e => setTranslations(prev => ({
            ...prev,
            [row.code]: { ...prev[row.code], [activeLocale]: e.target.value }
          }))}
          placeholder={t("ENTER_TRANSLATION")}
        />
      ),
      width: "55%"
    }
  ];

  return (
    <div style={{ minWidth: "min-content" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        {/* <h2>{t("ADD_TRANSLATIONS")}</h2> */}
      </div>

      <CustomTabs 
        locales={locales}
        activeLocale={activeLocale}
        onTabChange={setActiveLocale}
      />

      <DataTable
        columns={columns}
        data={localisationData}
        pagination
        highlightOnHover
        noHeader
        persistTableHead
      />

      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
        <Button
          label={t("CANCEL")}
          variation="secondary"
          onClick={onClose}
        />
        <Button
          label={t("SAVE_TRANSLATIONS")}
          variation="primary"
          onClick={() => {
            const formatted = Object.entries(translations).flatMap(([code, localesMap]) =>
              Object.entries(localesMap).map(([locale, message]) => ({
                code,
                message: message.trim(), // Remove whitespace
                module: "hcm-checklist",
                locale
              }))
            ).filter(entry => entry.message !== ""); // Filter out empty translations
            onSave(formatted);
          }}
        />
      </div>
    </div>
  );
};

export default LocalisationEditorPopup;
