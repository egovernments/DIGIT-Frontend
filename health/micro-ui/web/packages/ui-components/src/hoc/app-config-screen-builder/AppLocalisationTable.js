import React, { useEffect, useMemo } from "react";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import DataTable from "react-data-table-component";
import TextInput from "../../atoms/TextInput";
import { useTranslation } from "react-i18next";
import { tableCustomStyle } from "./tableCustomStyle";
import { Loader } from "../../atoms";

export const AppLocalisationTable = ({ currentScreen, state }) => {
  const { locState, locDispatch, addMissingKey, updateLocalization, localeModule } = useAppLocalisationContext();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const enabledModules = Digit?.SessionStorage.get("initData")?.languages || [];
  const { t } = useTranslation();
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;
  const availableLocales = (Digit?.SessionStorage.get("initData")?.languages || []).filter((locale) => locale?.value !== currentLocale);
  const currentLocState = useMemo(() => {
    if (!locState || !Array.isArray(locState) || locState.length === 0) {
      return [];
    }
    return (locState || [])?.filter(
      (i) =>
        i?.code &&
        typeof i?.code !== "boolean" &&
        (i?.code?.includes(Digit.Utils.locale.getTransformedLocale(currentScreen)) || i?.code?.includes(currentScreen))
    );
  }, [locState, currentScreen]);

  const { data: localisationData, isLoading } = Digit.Hooks.campaign.useSearchLocalisation({
    queryKey: "FOR_TABLE",
    tenantId: tenantId,
    locale: enabledModules?.map((i) => i.value),
    fetchCurrentLocaleOnly: false,
    module: localeModule,
    isMultipleLocale: enabledModules?.length > 0 ? true : false,
    config: {
      select: (data) => {
        return data;
      },
    },
  });

  useEffect(() => {
    if (!isLoading) {
      locDispatch({
        type: "SET_LOC",
        payload: {
          localisationData: localisationData,
          currentLocale: currentLocale,
          enabledModules: enabledModules,
          localeModule: localeModule,
        },
      });
    }
  }, [localisationData, isLoading, localeModule]);

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

  const filteredLocData = useMemo(() => (currentLocState || []).filter((locItem) => !fieldValuesSet.has(locItem.code)), [
    currentLocState,
    fieldValuesSet,
  ]);

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

  if (isLoading || !locState) {
    return <Loader />;
  }

  return (
    <div>
      <DataTable customStyles={tableCustomStyle} columns={columns} data={filteredLocData} pagination highlightOnHover />
    </div>
  );
};

export default AppLocalisationTable;
