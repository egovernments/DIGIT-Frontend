
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useMatch } from "react-router-dom";
import ChangePasswordComponent from "./changePassword";
import { config } from "./config";

const EmployeeChangePassword = () => {
  const { t } = useTranslation();
  const match = useMatch(); 

  const params = useMemo(() =>
    config.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [config, t]
    )
  );

  return (
    <Routes>
      <Route
        path={`${match?.pathname || ""}`} // Use match.pathname or an empty string as the base path
        element={<ChangePasswordComponent config={params[0]} t={t} />}
      />
    </Routes>
  );
};

export default EmployeeChangePassword;