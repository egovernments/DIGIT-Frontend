import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { SignUpConfig as defaultSignUpConfig  } from "./config-v2";
import Login from "./signUp";
import { useHistory, useLocation } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-react-components";


const LoginV2 = ({stateCode}) => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const [SignUpConfig, setSignUpConfig] = useState(defaultSignUpConfig);
  const moduleCode = ["privacy-policy"];
  const language = Digit.StoreData.getCurrentLanguage();
  const modulePrefix = "digit";
  const { data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix
  });

  const history = useHistory();
  const location = useLocation();

  // Clear old data and refresh localization when accessing login page
  useEffect(() => {
    // Clear expired/stale data but preserve essential config
    const preserveKeys = ['Employee.tenantId', 'Citizen.tenantId', 'CONTEXT_PATH'];
    const sessionData = {};
    const localData = {};
    
    // Backup preserved keys from both storages
    preserveKeys.forEach(key => {
      const sessionValue = window.Digit.SessionStorage.get(key);
      const localValue = window.Digit.LocalStorage?.get(key) || localStorage.getItem(key);
      
      if (sessionValue) sessionData[key] = sessionValue;
      if (localValue) localData[key] = localValue;
    });

    // Clear both session and local storage
    window.sessionStorage.clear();
    window.localStorage.clear();
    
    // Restore preserved keys
    Object.keys(sessionData).forEach(key => {
      window.Digit.SessionStorage.set(key, sessionData[key]);
    });
    
    Object.keys(localData).forEach(key => {
      if (window.Digit.LocalStorage?.set) {
        window.Digit.LocalStorage.set(key, localData[key]);
      } else {
        localStorage.setItem(key, localData[key]);
      }
    });

    // Clear React Query cache for fresh data
    if (window.Digit?.QueryClient) {
      window.Digit.QueryClient.clear();
    }

    // Clear API cache service
    if (window.Digit?.ApiCacheService) {
      window.Digit.ApiCacheService.clearAllCache();
    }

    // Trigger fresh localization loading
    if (window.Digit?.Localization) {
      window.Digit.Localization.invalidateLocalizationCache();
    }
  }, []); // Run only once when component mounts


   const { data: mdmsBannerImages, isLoading: loadingimages } = Digit.Hooks.useCustomAPIHook({
    url: "/mdms-v2/v1/_search",

    body: {
      MdmsCriteria:{
        "tenantId":"DEFAULT"|| stateCode,
        "moduleDetails": [
            {
                "moduleName": "sandbox",
                "masterDetails": [
                    {
                        "name": "BannerImages"
                    }
                ]
            }
        ]
    }
    },

    config: {
      select: (response) => {
        try {
          const fetchedBanners =response?.MdmsRes?.sandbox?.BannerImages?.[0]?.bannerImages;

          if (Array.isArray(fetchedBanners) && fetchedBanners.length > 0) {
            return fetchedBanners;
          }

          return null;

        } catch (error) {
          console.error("Error processing MDMS data from useCustomAPIHook:", error);
         
          return null;
        }
      },
      retry: false, 
    },
  });

    // Timestamp handling
    useEffect(() => {
      const query = new URLSearchParams(location.search);
      if (!query.get("ts")) {
        const ts = Date.now();
        history.replace({
          pathname: location.pathname,
          search: `?ts=${ts}`
        });
      }
    }, [location, history]);

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(stateCode, "commonUiConfig", ["SignUpConfig"], {
    select: (data) => {
      return {
        config: data?.commonUiConfig?.SignUpConfig
      };
    },
    retry: false,
  });

  // let SignUpConfig = mdmsData?.config ? mdmsData?.config : defaultSignUpConfig;
  useEffect(() => {
    if(isLoading == false && mdmsData?.config)
    {  
      setSignUpConfig(mdmsData?.config)
    }else{
      setSignUpConfig(defaultSignUpConfig)
    }
  },[mdmsData, isLoading])


  
   const finalConfig = useMemo(() => {
    if (loadingimages) {
      return defaultSignUpConfig;
    }
    if (mdmsBannerImages) {
      return [
        {
          ...defaultSignUpConfig[0],
          bannerImages: mdmsBannerImages,
        },
      ];
    }

    return defaultSignUpConfig;

  }, [loadingimages, mdmsBannerImages]);


  const SignUpParams = useMemo(
    () =>
      finalConfig.map((step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      }),
    [finalConfig, t]
  );



  if (loadingimages) {
    return <Loader />;
  }

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <Login config={SignUpParams[0]} t={t} />
      </Route>
    </Switch>
  );
};

export default LoginV2;
