import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { SignUpConfig as defaultSignUpConfig  } from "./config";
import Login from "./signUp";

const SignUp = ({stateCode}) => {
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


  const SignUpParams = useMemo(() =>
    SignUpConfig.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [SignUpConfig]
    )
  );

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <Login config={SignUpParams[0]} t={t} />
      </Route>
    </Switch>
  );
};

export default SignUp;
