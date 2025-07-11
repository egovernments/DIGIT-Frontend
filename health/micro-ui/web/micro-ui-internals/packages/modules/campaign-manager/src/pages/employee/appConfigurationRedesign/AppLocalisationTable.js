import React, { useMemo } from "react";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import DataTable from "react-data-table-component";
import { TextInput } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { tableCustomStyle } from "./tableCustomStyle";

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
      <DataTable customStyles={tableCustomStyle} columns={columns} data={filteredLocData} pagination highlightOnHover />
    </div>
  );
};

export default AppLocalisationTable;
