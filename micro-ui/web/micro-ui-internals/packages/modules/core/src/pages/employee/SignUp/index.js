import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation } from "react-router-dom";
import { SignUpConfig as defaultSignUpConfig } from "./config";
import Login from "./signUp";

const SignUp = ({ stateCode }) => {
  const { t } = useTranslation();
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

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(
    stateCode,
    "commonUiConfig",
    ["SignUpConfig"],
    {
      select: (data) => ({
        config: data?.commonUiConfig?.SignUpConfig
      }),
      retry: false
    }
  );

  useEffect(() => {
    if (!isLoading && mdmsData?.config) {
      setSignUpConfig(mdmsData.config);
    } else {
      setSignUpConfig(defaultSignUpConfig);
    }
  }, [mdmsData, isLoading]);

  const SignUpParams = useMemo(
    () =>
      SignUpConfig.map((step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      }),
    [SignUpConfig]
  );

  return (
    <Routes>
      <Route
        path=""
        element={<Login config={SignUpParams[0]} t={t} />}
      />
    </Routes>
  );
};

export default SignUp;
