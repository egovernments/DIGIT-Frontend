// import React, { useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Route, Switch, useRouteMatch } from "react-router-dom";
// import { loginConfig as defaultLoginConfig } from "./config";
// import { LoginOtpConfig as defaultLoginOtpConfig } from "./ConfigOtp";
// import LoginComponent from "./login";
// // import useCommonMDMS from "../../../../libraries/src/hooks/useMDMS"

// const EmployeeLogin = ({ stateCode }) => {
//   const { t } = useTranslation();
//   console.log(t("CORE_LOGIN_USERNAME"));

//   const { path } = useRouteMatch();
//   const [loginConfig, setloginConfig] = useState(defaultLoginConfig);
//   const [loginOtpConfig, setloginOtpConfig] = useState(defaultLoginOtpConfig);
//   const moduleCode = ["privacy-policy"];
//   const language = Digit.StoreData.getCurrentLanguage();
//   const modulePrefix = "digit";
//   const loginType = window?.globalConfigs?.getConfig("OTP_BASED_LOGIN") || false;
//   // const { data: store } = Digit.Services.useStore({
//   //   stateCode,
//   //   moduleCode,
//   //   language,
//   //   modulePrefix,
//   // });

//   // const { data: mdmsData, isLoading } = useCommonMDMS(stateCode, "commonUiConfig", ["LoginConfig"], {
//   //   select: (data) => {
//   //     return {
//   //       config: data?.commonUiConfig?.LoginConfig,
//   //     };
//   //   },
//   //   retry: false,
//   // });

//   // let loginConfig = mdmsData?.config ? mdmsData?.config : defaultLoginConfig;

//   // let loginConfig = defaultLoginConfig;

//   // useEffect(() => {
//   //   if (isLoading == false && mdmsData?.config) {
//   //     setloginConfig(mdmsData?.config);
//   //   } else {
//   //     setloginConfig(defaultLoginConfig);
//   //   }
//   // }, [mdmsData, isLoading]);

//   const loginParams = useMemo(() =>
//     loginConfig.map(
//       (step) => {
//         const texts = {};
//         for (const key in step.texts) {
//           texts[key] = t(step.texts[key]);
//         }
//         return { ...step, texts };
//       },
//       [loginConfig]
//     )
//   );

//   const loginOtpParams = useMemo(() =>
//     loginOtpConfig.map(
//       (step) => {
//         const texts = {};
//         for (const key in step.texts) {
//           texts[key] = t(step.texts[key]);
//         }
//         return { ...step, texts };
//       },
//       [loginOtpConfig]
//     )
//   );

//   return (
//     <Switch>
//       <Route path={`${path}`} exact>
//         {loginType ? <LoginComponent config={loginOtpParams[0]} t={t} loginOTPBased={loginType}/> : <LoginComponent config={loginParams[0]} t={t} />}
//       </Route>
//     </Switch>
//   );
// };

// export default EmployeeLogin;


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
