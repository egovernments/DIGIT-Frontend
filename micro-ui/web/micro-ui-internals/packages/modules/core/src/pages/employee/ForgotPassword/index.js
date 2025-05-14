
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useMatch } from "react-router-dom";
import { loginConfig } from "./config";
import ForgotPasswordComponent from "./forgotPassword";

const EmployeeForgotPassword = () => {
  const { t } = useTranslation();
  const match = useMatch();

  const params = useMemo(() =>
    loginConfig.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [loginConfig, t]
    )
  );

  return (
    <Routes>
      <Route
        path={`${match?.pathname || ""}`}
        element={<ForgotPasswordComponent config={params[0]} t={t} />}
      />
    </Routes>
  );
};

export default EmployeeForgotPassword;