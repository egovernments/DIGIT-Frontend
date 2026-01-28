import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../atoms/Loader";
import AppConfigurationWrapper from "./AppConfigurationWrapper";
import { MODULE_CONSTANTS } from "./app-config-utils/constants";
import ErrorBoundary from "./ErrorBoundary";

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
        const newEntry = action.payload.enabledModules.reduce((acc, locale) => ({ ...acc, [locale.value]: "" }), {
          code: action.payload.code,
        });
        return [...state, newEntry];
      }
    case "UPDATE_LOCALIZATION":
      const checkCodeAlreadyPresent = Array.isArray(state) && state?.some((item) => item?.code === action?.payload?.code);
      if (checkCodeAlreadyPresent) {
        return state.map((item) =>
          item.code === action.payload.code ? { ...item, [action.payload.locale]: action.payload.message } : item
        );
      } else {
        return [
          ...state,
          {
            code: action.payload.code,
            [action.payload.locale]: action.payload.message,
          },
        ];
      }

    case "REMOVE_KEY":
      return state.filter((item) => item.code !== action.payload.code);
  }
};

function AppLocalisationWrapper({ onSubmit, localeModule, screenConfig, back, showBack, parentDispatch, ...props }) {
  if (!localeModule) {
    return <Loader />;
  }
  const queryClient = useQueryClient();
  const [locState, locDispatch] = useReducer(locReducer, initialState);
  const searchParams = new URLSearchParams(location.search);
  // const localeModule = searchParams.get("localeModule");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const enabledModules = Digit?.SessionStorage.get("initData")?.languages || [];
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

  const addMissingKey = (code) => {
    locDispatch({ type: "ADD_MISSING_KEY", payload: { code, enabledModules } });
  };
  const updateLocalization = (code, locale, message) => {
    locDispatch({
      type: "UPDATE_LOCALIZATION",
      payload: { code, locale, message },
    });
    return;
  };

  const { isLoading: isLoadingAppScreenLocalisationConfig, data: AppScreenLocalisationConfig } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [{ name: "AppScreenLocalisationConfig" }],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        return data?.[MODULE_CONSTANTS]?.["AppScreenLocalisationConfig"]?.[0];
      },
    },
    { schemaCode: "APP_MASTER_DATA_LOCALISATION" } //mdmsv2
  );

  const { data: localisationData, isLoading } = Digit.Hooks.campaign.useSearchLocalisation({
    tenantId: tenantId,
    locale: enabledModules?.map((i) => i.value),
    module: localeModule,
    fetchCurrentLocaleOnly: true,
    isMultipleLocale: enabledModules?.length > 0 ? true : false,
    config: {
      cacheTime: 0,
      staleTime: 0,
      select: (data) => {
        return data;
      },
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["SEARCH_APP_LOCALISATION", tenantId, localeModule]);
    };
  }, [tenantId, localeModule]);

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

  if (isLoading) return <Loader page={true} variant={"PageLoader"} />;

  return (
    <ErrorBoundary>
      <AppLocalisationContext.Provider
        value={{
          locState,
          enabledModules,
          locDispatch,
          AppScreenLocalisationConfig,
          addMissingKey,
          updateLocalization,
          onSubmit,
          back,
          showBack,
          parentDispatch,
          localeModule,
        }}
      >
        <AppConfigurationWrapper
          pageTag={props?.pageTag}
          screenConfig={screenConfig}
          localeModule={localeModule}
          back={back}
          showBack={showBack}
          parentDispatch={parentDispatch}
        >
          {props.children}
        </AppConfigurationWrapper>
      </AppLocalisationContext.Provider>
    </ErrorBoundary>
  );
}

export default React.memo(AppLocalisationWrapper);
