import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation } from "react-router-dom";
import { loginConfig as defaultLoginConfig } from "./config";
import { LoginOtpConfig as defaultLoginOtpConfig } from "./ConfigOtp";
import LoginComponent from "./login";

const EmployeeLogin = ({ stateCode }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const [loginConfig, setLoginConfig] = useState(defaultLoginConfig);
  const [loginOtpConfig, setLoginOtpConfig] = useState(defaultLoginOtpConfig);

  const loginType = window?.globalConfigs?.getConfig("OTP_BASED_LOGIN") || false;

  const loginParams = useMemo(() => {
    return loginConfig.map((step) => {
      const texts = {};
      for (const key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return { ...step, texts };
    });
  }, [loginConfig, t]);

  const loginOtpParams = useMemo(() => {
    return loginOtpConfig.map((step) => {
      const texts = {};
      for (const key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return { ...step, texts };
    });
  }, [loginOtpConfig, t]);

  const selectedConfig = loginType ? loginOtpParams[0] : loginParams[0];

  return (
    <Routes>
      <Route
        path="/"
        element={<LoginComponent config={selectedConfig} t={t} loginOTPBased={loginType} />}
      />
    </Routes>
  );
};

export default EmployeeLogin;
