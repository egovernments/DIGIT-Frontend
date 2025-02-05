import React, { createContext, useContext, useEffect, useReducer } from "react";
import AppConfigurationWrapper from "./AppConfigurationWrapper";
import { CreateChecklist } from "./CreateChecklist";
const initialState = [];
const ChecklistLocalisationContext = createContext();

export const useChecklistLocalisationContext = () => {
  return useContext(ChecklistLocalisationContext);
};

const locReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOC":
      return action.payload.localisationData;
    case "default":
      return state;
    case "ADD_MISSING_KEY":
      if (state.find((item) => item.code === action.payload.code)) {
        return state;
      } else {
        return [...state, { code: action.payload.code, en_IN: "", pt_IN: "", fr_IN: "" }];
      }
    case "UPDATE_LOCALIZATION":
      return state.map((item) => (item.code === action.payload.code ? { ...item, [action.payload.locale]: action.payload.message } : item));

    case "REMOVE_KEY":
      return state.filter((item) => item.code !== action.payload.code);
  }
};
const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";

function ChecklistLocalisationWrapper() {
  const [locState, locDispatch] = useReducer(locReducer, initialState);
  const addMissingKey = (code) => {
    locDispatch({ type: "ADD_MISSING_KEY", payload: { code } });
  };
  const updateLocalization = (code, locale, message) => {
    locDispatch({
      type: "UPDATE_LOCALIZATION",
      payload: { code, locale, message },
    });
  };

  console.log("locStatelocStatelocState", locState);

  const enabledModules = ["en_IN", "pt_IN", "fr_IN"];
  const currentLocale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [{ name: "AppScreenLocalisationConfig" }],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        return data?.["HCM-ADMIN-CONSOLE"]?.AppScreenLocalisationConfig;
      },
    },
    { schemaCode: "LOC_APP_MASTER_DATA" } //mdmsv2
  );
  console.log("sdsd" ,AppConfigMdmsData );
  const { data: localisationData, isLoading } = Digit.Hooks.campaign.useSearchLocalisation({
    tenantId: "dev",
    locale: enabledModules,
    module: "hcm-appconfiguration",
    isMultipleLocale: enabledModules?.length > 1 ? true : false,
    config: {
      staleTime: 0,
      cacheTime: 0,
      select: (data) => {
        return data;
      },
    },
  });
  console.log("pppppp")

  useEffect(() => {
    if (!isLoading) {
      locDispatch({
        type: "SET_LOC",
        payload: {
          localisationData: localisationData,
          currentLocale: currentLocale,
          enabledModules: enabledModules,
        },
      });
    }
  }, [localisationData, isLoading]);

  return (
    <ChecklistLocalisationContext.Provider value={{ locState, locDispatch, addMissingKey, updateLocalization }}>
      <CreateChecklist />
    </ChecklistLocalisationContext.Provider>
  );
}

export default ChecklistLocalisationWrapper;