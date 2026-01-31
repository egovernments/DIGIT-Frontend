import React, { createContext, useContext, useEffect, useReducer } from "react";
import AppConfigurationWrapper from "./AppConfigurationWrapper";

const initialState = [];
const AppLocalisationContext = createContext();

export const useAppLocalisationContext = () => {
  return useContext(AppLocalisationContext);
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

function AppLocalisationWrapper({ onSubmit, screenConfig, back, showBack, parentDispatch, ...props }) {
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

  const enabledModules = ["en_IN", "pt_IN", "fr_IN"];
  const currentLocale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const { data: localisationData, isLoading } = Digit.Hooks.campaign.useSearchLocalisation({
    tenantId: "dev",
    locale: enabledModules,
    module: "hcm-dummy-module",
    isMultipleLocale: enabledModules?.length > 1 ? true : false,
    config: {
      staleTime: 0,
      cacheTime: 0,
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
        },
      });
    }
  }, [localisationData, isLoading]);

  return (
    <AppLocalisationContext.Provider value={{ locState, locDispatch, addMissingKey, updateLocalization, onSubmit, back, showBack, parentDispatch }}>
      <AppConfigurationWrapper screenConfig={screenConfig} />
    </AppLocalisationContext.Provider>
  );
}

export default React.memo(AppLocalisationWrapper);
