import React, { useEffect, useState } from "react";
import { CheckCircle } from "@egovernments/digit-ui-svg-components";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DummyLoaderScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const { tenant } = location.state || {};
  const steps = [
    "SANDBOX_GUIDE_SETUP_ACCOUNT",
    "SANDBOX_GUIDE_DEFAULT_MASTER_DATA",
    "SANDBOX_GUIDE_CONFIGURING_COMPLAINTS",
    "SANDBOX_GUIDE_CONFIGURING_EMPLOYEE_MANAGEMENT",
    "SANDBOX_GUIDE_SETTING_UP_CITIZEN_PORTAL",
    "SANDBOX_GUIDE_SETTING_UP_EMPLOYEE_PORTAL",
    "SANDBOX_GUIDE_LOADING_CONFIGURATION_INTERFACE",
    "SANDBOX_GUIDE_CREATING_DASHBOARD",
    "SANDBOX_GUIDE_ALL_SETUP_DONE",
  ];
  useEffect(() => {
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 2000); // 1 second delay for each step

    if (currentStep === steps.length) {
      clearInterval(stepInterval); // Clear the interval to stop further updates
      const navigateTimeout = setTimeout(() => {
        history.push({
          pathname: `/${window?.globalPath}/user/url`,
          state: { tenant: tenant },
        });
      }, 1000);

      return () => clearTimeout(navigateTimeout); // Cleanup timeout
    }

    return () => {
      clearInterval(stepInterval);
    };
  }, [currentStep]);

  return (
    <div className="sandbox-loader-screen">
      <div className="sandbox-loader"></div>
      <ul className="sandbox-installation-steps">
        {steps.map((step, index) => (
          <li key={index} className={`sandbox-step ${index < currentStep ? "sandbox-visible" : ""}`}>
            <span className="sandbox-step-text">{t(step)}</span>
            {index < currentStep && <CheckCircle fill="#00703C" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DummyLoaderScreen;
