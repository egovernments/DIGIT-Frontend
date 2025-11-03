import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom"; // Updated imports for v6
import { loginConfig as defaultLoginConfig } from "./config";
import { LoginOtpConfig as defaultLoginOtpConfig } from "./ConfigOtp";
import LoginComponent from "./login";
import { useLoginConfig } from "../../../hooks/useLoginConfig";
import { Loader } from "@egovernments/digit-ui-components";

const EmployeeLogin = ({ stateCode }) => {
  const { t } = useTranslation();
  const [loginConfig, setloginConfig] = useState(defaultLoginConfig);
  const [loginOtpConfig, setloginOtpConfig] = useState(defaultLoginOtpConfig);
  const moduleCode = ["privacy-policy"];
  const language = Digit.StoreData.getCurrentLanguage();
  const modulePrefix = "digit";
  const loginType = window?.globalConfigs?.getConfig("OTP_BASED_LOGIN") || false;
  const { data: mdmsData, isLoading } = useLoginConfig(stateCode);
  const { data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  useEffect(() => {
    if (!isLoading && mdmsData?.config) { 
      setloginConfig(mdmsData?.config);
    } else {
      setloginConfig(defaultLoginConfig);
    }
  }, [mdmsData, isLoading]); 

  const loginParams = useMemo(
    () =>
      loginConfig.map((step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [loginConfig]
    )
  );

  const loginOtpParams = useMemo(
    () =>
      loginOtpConfig.map((step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [loginOtpConfig]
    )
  );

  if (isLoading) {
    return <Loader page={false} variant={"PageLoader"} />;
  }

  return (
    <Routes> {/* Replaced Switch with Routes */}
      <Route
        path="/"      
        element={ 
          loginType ? (
            <LoginComponent config={loginOtpParams[0]} t={t} loginOTPBased={loginType} />
          ) : (
            <LoginComponent config={loginParams[0]} t={t} />
          )
        }
      />
    </Routes>
  );
};

export default EmployeeLogin;