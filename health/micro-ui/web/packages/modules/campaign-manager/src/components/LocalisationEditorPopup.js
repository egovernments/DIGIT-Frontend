import React, { useState } from "react";
import { TextInput, Button, Tab } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { wrap } from "lodash";

const LocalisationEditorPopup = ({ locales, languages, currentLocale, localisationData, onSave, onClose }) => {
  const { t } = useTranslation();
  const [activeLocale, setActiveLocale] = useState(locales[0]);
  const [translations, setTranslations] = useState({});

  const columns = [
    {
      name: t(currentLocale),
      selector: (row) => row?.[currentLocale] || row?.message,
      wrap: true,
      style: {
        whiteSpace: "normal",
        overflowWrap: "break-word",
      },
      width: "45%",
    },
    {
      name: t(activeLocale),
      cell: (row) => (
        <TextInput
          value={
            translations[row.code]?.[activeLocale] !== undefined && translations[row.code]?.[activeLocale] !== null
              ? translations[row.code]?.[activeLocale]
              : row?.[activeLocale] !== undefined && row?.[activeLocale] !== null
              ? row?.[activeLocale]
              : ""
          }
          onChange={(e) =>
            setTranslations((prev) => ({
              ...prev,
              [row.code]: { ...prev[row.code], [activeLocale]: e.target.value },
            }))
          }
          placeholder={t("ENTER_TRANSLATION")}
        >
        </TextInput>
      ),
      width: "55%",
    },
  ];

  return (
    <div style={{ minWidth: "min-content" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}></div>

      <Tab
        activeLink={activeLocale}
        configItemKey="value"
        configNavItems={languages}
        onTabClick={(v) => {}}
        setActiveLink={setActiveLocale}
        showNav
        style={{}}
      />

      <DataTable
        columns={columns}
        data={localisationData.filter((row) => row.message?.trim() !== "")}
        pagination
        highlightOnHover
        noHeader
        persistTableHead
      />

      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
        <Button label={t("CANCEL")} title={t("CANCEL")} variation="secondary" onClick={onClose} />
        <Button
          label={t("SAVE_TRANSLATIONS")}
          title={t("SAVE_TRANSLATIONS")}
          variation="primary"
          onClick={() => {
            const formatted = Object.entries(translations)
              .flatMap(([code, localesMap]) =>
                Object.entries(localesMap).map(([locale, message]) => ({
                  code,
                  message: message.trim(), // Remove whitespace
                  module: "hcm-checklist",
                  locale,
                }))
              )
              .filter((entry) => entry.message !== ""); // Filter out empty translations
            onSave(formatted);
          }}
        />
      </div>
    </div>
  );
};

export default LocalisationEditorPopup;
