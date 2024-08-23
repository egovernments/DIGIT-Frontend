import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { loginConfig as defaultLoginConfig } from "./config";
import { LoginOtpConfig as defaultLoginOtpConfig } from "./ConfigOtp";
import LoginComponent from "./login";

const EmployeeLogin = ({ stateCode }) => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const [loginConfig, setloginConfig] = useState(defaultLoginConfig);
  const [loginOtpConfig, setloginOtpConfig] = useState(defaultLoginOtpConfig);
  const moduleCode = ["privacy-policy"];
  const language = Digit.StoreData.getCurrentLanguage();
  const modulePrefix = "digit";
  const loginType = window?.globalConfigs?.getConfig("OTP_BASED_LOGIN") || false;
  const { data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(stateCode, "commonUiConfig", ["LoginConfig"], {
    select: (data) => {
      return {
        config: data?.commonUiConfig?.LoginConfig,
      };
    },
    retry: false,
  });

  //let loginConfig = mdmsData?.config ? mdmsData?.config : defaultLoginConfig;
  useEffect(() => {
    if (isLoading == false && mdmsData?.config) {
      setloginConfig(mdmsData?.config);
    } else {
      setloginConfig(defaultLoginConfig);
    }
  }, [mdmsData, isLoading]);

  const loginParams = useMemo(() =>
    loginConfig.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [loginConfig]
    )
  );

  const loginOtpParams = useMemo(() =>
    loginOtpConfig.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [loginOtpConfig]
    )
  );

  return (
    <Switch>
      <Route path={`${path}`} exact>
        {loginType ? <LoginComponent config={loginOtpParams[0]} t={t} loginOTPBased={loginType}/> : <LoginComponent config={loginParams[0]} t={t} />}
      </Route>
    </Switch>
  );
};

export default EmployeeLogin;
