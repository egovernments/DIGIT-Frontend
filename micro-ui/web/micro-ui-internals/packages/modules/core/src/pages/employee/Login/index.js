import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch,useLocation } from "react-router-dom";
import { loginConfig as defaultLoginConfig } from "./config";
import { LoginOtpConfig as defaultLoginOtpConfig } from "./ConfigOtp";
import { Login2fa as defaultLogin2fa } from "./configfa";
import LoginComponent from "./login";

const EmployeeLogin = ({ stateCode }) => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const [loginConfig, setloginConfig] = useState(defaultLoginConfig);
  const [loginOtpConfig, setloginOtpConfig] = useState(defaultLoginOtpConfig);
  const [login2faConfig, setLogin2faConfig] = useState(defaultLogin2fa);
  const moduleCode = ["privacy-policy"];
  const location = useLocation();
  const language = Digit.StoreData.getCurrentLanguage();
  const modulePrefix = "digit";
  const loginType = window?.globalConfigs?.getConfig("OTP_BASED_LOGIN") || false;
  const { loginMethod } = location.state || {}; // Extract loginMethod from location.state
  const { data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  console.log("Login Method:", loginMethod);

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(stateCode, "commonUiConfig", ["LoginConfig"], {
    select: (data) => {
      return {
        config: data?.commonUiConfig?.LoginConfig,
      };
    },
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && mdmsData?.config) {
      setloginConfig(mdmsData?.config);
    } else {
      setloginConfig(defaultLoginConfig);
    }
  }, [mdmsData, isLoading]);

  const loginParams = useMemo(() =>
    loginConfig.map((step) => {
      const texts = {};
      for (const key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return { ...step, texts };
    }),
    [loginConfig, t]
  );

  const loginOtpParams = useMemo(() =>
    loginOtpConfig.map((step) => {
      const texts = {};
      for (const key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return { ...step, texts };
    }),
    [loginOtpConfig, t]
  );

  const login2faParams = useMemo(() =>
    login2faConfig.map((step) => {
      const texts = {};
      for (const key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return { ...step, texts };
    }),
    [login2faConfig, t]
  );

  const getConfigForLoginMethod = () => {
    switch (loginMethod) {
      case "direct":
        return loginParams[0];
      case "2fa":
        return login2faParams[0];
      case "otp":
        return loginOtpParams[0];
      default:
        return loginParams[0]; // Default to direct login if no method is specified
    }
  };

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <LoginComponent config={getConfigForLoginMethod()} t={t} loginOTPBased={loginType} loginType={loginMethod} />
      </Route>
    </Switch>
  );
};

export default EmployeeLogin;
