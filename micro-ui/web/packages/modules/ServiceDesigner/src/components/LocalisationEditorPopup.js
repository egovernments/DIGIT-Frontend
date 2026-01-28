import React, { useState } from "react";
import { TextInput, Button, Tab } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

const LocalisationEditorPopup = ({ locales, languages, currentLocale, localisationData, onSave, onClose }) => {
  const { t } = useTranslation();
  const [activeLocale, setActiveLocale] = useState(locales[0]);
  const [translations, setTranslations] = useState({});

  const filteredData = localisationData.filter((row) => row.message?.trim() !== "");

  return (
    <div style={{ minWidth: "min-content", maxWidth: "100%", padding: "1rem" }}>
      <Tab
        activeLink={activeLocale}
        configItemKey="value"
        configNavItems={languages}
        onTabClick={() => {}}
        setActiveLink={setActiveLocale}
        showNav
      />

      <div style={{ marginTop: "1rem", maxHeight: "60vh", overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
        {filteredData.map((row, idx) => (
          <div
            key={row.code || idx}
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "1rem",
              borderBottom: "1px solid #eee",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Current Locale Column */}
            <div style={{ flex: 1, wordBreak: "break-word", fontWeight: 500 }}>{row?.[currentLocale] || row?.message || row.code}</div>

            {/* Editable Input Column */}
            <div style={{ flex: 1 }}>
              <TextInput
                style={{ width: "100%" }}
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
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
        <Button label={t("CANCEL")} variation="secondary" onClick={onClose} />
        <Button
          label={t("SAVE_TRANSLATIONS")}
          variation="primary"
          onClick={() => {
            const formatted = Object.entries(translations)
              .flatMap(([code, localesMap]) =>
                Object.entries(localesMap).map(([locale, message]) => ({
                  code,
                  message: message.trim(),
                  module: "hcm-checklist",
                  locale,
                }))
              )
              .filter((entry) => entry.message !== "");
            onSave(formatted);
          }}
        />
      </div>
    </div>
  );
};

export default LocalisationEditorPopup;
