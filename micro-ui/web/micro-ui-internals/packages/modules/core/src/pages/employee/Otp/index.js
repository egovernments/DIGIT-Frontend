import React, { useState } from "react";
import { BackLink, Loader, Toast } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch, useHistory, useLocation } from "react-router-dom";
import { OtpConfig } from "./config";
import Background from "../../../components/Background";
import Header from "../../../components/Header";

const Otp = () => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const [showToast, setShowToast] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [params, setParams] = useState(location?.state?.data || {});

  const config = [
    {
      body: OtpConfig[0].body
    },
  ];

  const navigateToLogin = (formData) => {
    console.log("xxxxx", formData)

    history.replace(`/${window?.contextPath}/employee/login`);
  };

  return (
    <Background>
      <div className="employeeBackbuttonAlign">
        <BackLink />
      </div>
      <FormComposerV2
        onSubmit={navigateToLogin}
        noBoxShadow
        inline
        submitInForm
        onFormValueChange={(setValue, formValue) => {
          const otpValue = formValue["OtpComponent"]; // Assuming "OtpComponent" is the key for OTP value
          if (otpValue?.otp?.length === 6) {
            setIsOtpValid(true);
          } else {
            setIsOtpValid(false);
          }
        }}
        isDisabled={!isOtpValid}
        config={config}
        label={OtpConfig[0].texts.submitButtonLabel}
        // secondaryActionLabel={OtpConfig.texts.secondaryButtonLabel}
        onSecondayActionClick={navigateToLogin}
        heading={OtpConfig[0].texts.header}
        // description={OtpConfig[0].texts.description}
        headingStyle={{ textAlign: "center" }}
        cardStyle={{ maxWidth: "408px", margin: "auto" }}
        className="employeeForgotPassword"
      >
        <Header />
      </FormComposerV2>
      {showToast && <Toast type={"error"} label={t(showToast)} onClose={closeToast} />}
      <div className="EmployeeLoginFooter">
        <img
          alt="Powered by DIGIT"
          src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
          }}
        />{" "}
      </div>
    </Background >
  );
};

export default Otp;



