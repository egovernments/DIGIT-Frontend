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


   const { data: mdmsBannerImages, isLoading: loadingimages } = Digit.Hooks.useCustomAPIHook({
    // 1. Specify the API URL for MDMS search
    url: "/mdms-v2/v1/_search",

    // 2. Construct the request body for the POST call
    body: {
      MdmsCriteria:{
        "tenantId": stateCode,
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

    // 3. Provide the react-query configuration, including the 'select' function
    config: {
      select: (response) => {
        console.log(response, "response from useCustomAPIHook");
        try {
          // IMPORTANT: The key in the response is 'mdms' (lowercase).
          // Path: response -> mdms -> [0] -> data -> bannerImages
          const fetchedBanners =response?.MdmsRes?.sandbox?.BannerImages?.[0]?.bannerImages;

          // Check if we received a valid array
          if (Array.isArray(fetchedBanners) && fetchedBanners.length > 0) {
            // SUCCESS: Return the full bannerImages array from MDMS
            return fetchedBanners;
          }

          // FAILURE or NO DATA: Return null to fall back to the default
          return null;

        } catch (error) {
          console.error("Error processing MDMS data from useCustomAPIHook:", error);
          // On any processing error, return null
          return null;
        }
      },
      retry: false, // Optional: prevents retrying on failure
    },
  });


  console.log(mdmsBannerImages, "mdmsBannerImages12345")
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
    // While loading, it's safe to use the default
    if (loadingimages) {
      return defaultSignUpConfig;
    }
    console.log(mdmsBannerImages, "mdmsBannerImages");
    // If the API call was successful and returned banner images, merge them
    if (mdmsBannerImages) {
      return [
        {
          ...defaultSignUpConfig[0],           // Keep all default texts and inputs
          bannerImages: mdmsBannerImages,    // Override ONLY the bannerImages with the fetched data
        },
      ];
    }

    // Otherwise (API failed or returned null), use the local default config
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
