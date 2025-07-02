import React, { useMemo, useState } from "react";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import DataTable from "react-data-table-component";
import { TextInput } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { tableCustomStyle } from "./tableCustomStyle";

const Tabs = ({ availableLocales, onTabChange, setActiveLocale, activeLocale }) => {
  const { t } = useTranslation();
  return (
    <div className="campaign-tabs">
      {availableLocales.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`campaign-tab-head ${_?.value === activeLocale?.value ? "active" : ""} hover`}
          onClick={() => onTabChange(_, index)}
        >
          <p style={{ margin: 0, position: "relative", top: "-0 .1rem" }}>{t(_?.label)}</p>
        </button>
      ))}
    </div>
  );
};
export const AppLocalisationTable = ({ currentScreen, state }) => {
  const { locState, addMissingKey, updateLocalization } = useAppLocalisationContext();
  const currentLocState = useMemo(() => {
    return locState?.filter(
      (i) =>
        i?.code &&
        typeof i?.code !== "boolean" &&
        (i?.code?.includes(Digit.Utils.locale.getTransformedLocale(currentScreen)) || i?.code?.includes(currentScreen))
    );
  }, [locState, currentScreen]);

  const hiddenFields = useMemo(() => {
    return state?.screenData?.[0]?.cards?.[0]?.fields?.filter((i) => i?.hidden);
  }, [state?.screenData]);

  const fieldValuesSet = useMemo(() => {
    const set = new Set();
    for (const field of hiddenFields || []) {
      for (const val of Object.values(field)) {
        if (typeof val === "string") {
          set.add(val);
        }
      }
    }
    return set;
  }, [hiddenFields]);

  const filteredLocData = useMemo(() => currentLocState.filter((locItem) => !fieldValuesSet.has(locItem.code)), [currentLocState, fieldValuesSet]);
  const { t } = useTranslation();
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;
  const availableLocales = (Digit?.SessionStorage.get("initData")?.languages || []).filter((locale) => locale?.value !== currentLocale);
  const [activeLocale, setActiveLocale] = useState(availableLocales[0]);

  const columns = [
    {
      name: t(`TRANSLATION_${currentLocale || "EN"}`),
      selector: (row) => {
        return <div title={(row && currentLocale && row[currentLocale]) || ""}>{(row && currentLocale && row[currentLocale]) || ""}</div>;
      },
      sortable: true,
    },
    ...((Array.isArray(availableLocales) ? availableLocales : []).map((locale) => ({
      name: t(locale?.label || locale?.value || ""),
      cell: (row) => (
        <TextInput
          name={`translation_${locale?.value || ""}`}
          value={(row && locale?.value && row[locale.value]) || ""}
          onChange={(event) => {
            if (row && row.code && locale && locale.value && typeof updateLocalization === "function") {
              updateLocalization(row.code, locale.value, event.target.value);
            }
          }}
        />
      ),
    })) || []),
  ];

  return (
    <div>
      {/* Tabs */}
      {/* <div style={{ display: "flex", marginBottom: "16px" }}>
        <Tabs
          availableLocales={availableLocales}
          setActiveLocale={setActiveLocale}
          activeLocale={activeLocale}
          onTabChange={(tab, index) => {
            setActiveLocale(tab);
          }}
        />
      </div> */}

      {/* Data Table */}
      <DataTable
        // title={t(`LABEL_TRANSLATIONS_FOR_${activeLocale.label.toUpperCase()}`)}
        customStyles={tableCustomStyle}
        columns={columns}
        data={filteredLocData}
        pagination
        highlightOnHover
      />
    </div>
  );
};

export default AppLocalisationTable;
