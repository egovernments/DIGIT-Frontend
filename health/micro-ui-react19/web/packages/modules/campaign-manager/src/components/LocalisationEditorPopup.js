import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { TextInput, Tab, Loader } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";

const LocalisationEditorPopup = forwardRef(({ locales, languages, currentLocale, localisationData, module = "hcm-checklist", tenantId }, ref) => {
  const { t } = useTranslation();
  const [activeLocale, setActiveLocale] = useState(locales[0]);
  const [translations, setTranslations] = useState({});
  const [mergedData, setMergedData] = useState(localisationData);
  const [searching, setSearching] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const searchLocalisations = async (localeToSearch) => {
    if (!localeToSearch) return;
    try {
      setSearching(true);
      const response = await Digit.CustomService.getResponse({
        url: "/localization/messages/v1/_search",
        params: { tenantId: tenantId, module: module, locale: localeToSearch },
        body: {},
      });
      const messages = response?.messages || [];
      setMergedData((prev) => {
        const updated = prev.map((item) => ({ ...item }));
        messages.forEach(({ code, message }) => {
          const existing = updated.find((item) => item.code === code);
          if (existing) {
            existing[localeToSearch] = message;
          }
        });
        return updated;
      });
    } catch (error) {
      // silently fail search
    } finally {
      setSearching(false);
      setInitialLoading(false);
    }
  };

  // Search on mount for the first active locale
  useEffect(() => {
    if (locales[0]) {
      searchLocalisations(locales[0]);
    }
  }, []);

  const handleTabClick = (newLocale) => {
    const localeValue = newLocale?.value || newLocale;
    setActiveLocale(localeValue);
    searchLocalisations(localeValue);
  };

  useImperativeHandle(ref, () => ({
    getFormattedTranslations: () => {
      return Object.entries(translations)
        .flatMap(([code, localesMap]) =>
          Object.entries(localesMap).map(([locale, message]) => ({
            code,
            message: message.trim(),
            module: module,
            locale,
          }))
        )
        .filter((entry) => entry.message !== "");
    },
  }));

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

  if (initialLoading) {
    return (
      <div className="localisation-editor-content">
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="localisation-editor-content">
      <Tab
        activeLink={activeLocale}
        configItemKey="value"
        configNavItems={languages}
        onTabClick={handleTabClick}
        setActiveLink={setActiveLocale}
        showNav
        style={{}}
      />

      {searching ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}>
          <Loader />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={mergedData.filter((row) => row.message?.trim() !== "")}
          pagination
          highlightOnHover
          noHeader
          persistTableHead
        />
      )}
    </div>
  );
});

export default LocalisationEditorPopup;
