import React, { useState } from "react";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import DataTable from "react-data-table-component";
import { TextInput } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

const Tabs = ({ availableLocales, onTabChange, setActiveLocale, activeLocale }) => {
  const { t } = useTranslation();
  return (
    <div className="campaign-tabs">
      {availableLocales.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`campaign-tab-head ${_ === activeLocale ? "active" : ""} hover`}
          onClick={() => onTabChange(_, index)}
        >
          <p style={{ margin: 0, position: "relative", top: "-0 .1rem" }}>{t(_)}</p>
        </button>
      ))}
    </div>
  );
};
export const AppLocalisationTable = ({ data }) => {
  const { locState, addMissingKey, updateLocalization } = useAppLocalisationContext();
  const currentLocale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const availableLocales = ["en_IN", "pt_IN", "fr_IN"].filter((locale) => locale !== currentLocale);
  const [activeLocale, setActiveLocale] = useState(availableLocales[0]);

  const columns = [
    {
      name: "Code",
      selector: (row) => row?.[currentLocale],
      sortable: true,
    },
    {
      name: "Translation",
      cell: (row) => {
        return (
          <TextInput
            name="translation"
            value={row?.[activeLocale]}
            onChange={(event) => {
              updateLocalization(row?.code, activeLocale, event.target.value);
            }}
          />
        );
      },
    },
  ];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "16px" }}>
        <Tabs
          availableLocales={availableLocales}
          setActiveLocale={setActiveLocale}
          activeLocale={activeLocale}
          onTabChange={(tab, index) => {
            setActiveLocale(tab);
          }}
        />
      </div>

      {/* Data Table */}
      <DataTable title={`Translations for ${activeLocale.toUpperCase()}`} columns={columns} data={locState} pagination highlightOnHover />
    </div>
  );
};

export default AppLocalisationTable;
