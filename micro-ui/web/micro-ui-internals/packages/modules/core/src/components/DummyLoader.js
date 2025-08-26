import React, { useEffect, useState } from "react";
import { CheckCircle } from "@egovernments/digit-ui-svg-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DummyLoaderScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
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
    // Clear any existing intervals/timeouts on cleanup
    let stepInterval;
    let navigateTimeout;

    if (currentStep < steps.length) {
      stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          // Use functional update to avoid stale closure
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);
    } else if (currentStep === steps.length) {
      // Navigate after all steps are complete
      navigateTimeout = setTimeout(() => {
        // Add safety check for window object
        const globalPath = typeof window !== 'undefined' ? window?.globalPath : '';
        navigate({
          pathname: `/${globalPath}/user/url`,
          state: { tenant: tenant },
        });
      }, 1000);
    }

    // Cleanup function - always clear both timers
    return () => {
      if (stepInterval) {
        clearInterval(stepInterval);
      }
      if (navigateTimeout) {
        clearTimeout(navigateTimeout);
      }
    };
  }, [currentStep, steps.length, navigate, tenant]);

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
