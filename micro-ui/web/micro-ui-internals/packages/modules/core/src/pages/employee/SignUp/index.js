
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useMatch } from "react-router-dom";
import { SignUpConfig as defaultSignUpConfig } from "./config";
import Login from "./signUp";

const SignUp = ({ stateCode }) => {
  const { t } = useTranslation();
  const match = useMatch();
  const [signUpConfig, setSignUpConfig] = useState(defaultSignUpConfig);
  const moduleCode = ["privacy-policy"];
  const language = Digit.StoreData.getCurrentLanguage();
  const modulePrefix = "digit";
  const { data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(stateCode, "commonUiConfig", ["SignUpConfig"], {
    select: (data) => {
      return {
        config: data?.commonUiConfig?.SignUpConfig,
      };
    },
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && mdmsData?.config) {
      setSignUpConfig(mdmsData?.config);
    } else {
      setSignUpConfig(defaultSignUpConfig);
    }
  }, [mdmsData, isLoading]);

  const SignUpParams = useMemo(() =>
    signUpConfig.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [signUpConfig, t]
    )
  );

  return (
    <Routes>
      <Route
        path={`${match?.pathname || ""}`}
        element={<Login config={SignUpParams[0]} t={t} />}
      />
    </Routes>
  );
};

export default SignUp;