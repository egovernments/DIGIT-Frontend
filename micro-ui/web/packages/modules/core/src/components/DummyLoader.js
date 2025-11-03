import React, {useRef, useEffect, useState } from "react";
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
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 2000); // 1 second delay for each step

    if (currentStep === steps.length) {
      clearInterval(stepInterval); // Clear the interval to stop further updates
       const globalPath = typeof window !== 'undefined' ? window?.globalPath : '';

      const navigateTimeout = setTimeout(() => {
        if (roleForLandingPage(getUserRoles, MdmsRes)) {
        navigate({
          pathname: `/${window?.globalPath}/${tenant}${RoleLandingUrl}`,
          state: { tenant: tenant },
        });

        } else {
          navigate({
          pathname: `/${window?.globalPath}/${tenant}/employee`,
          state: { tenant: tenant },
        });
        }
      }, 1000);

      return () => clearTimeout(navigateTimeout); // Cleanup timeout
    }

    return () => {
      clearInterval(stepInterval);
    };
  }, [currentStep]);

  const ref = useRef(null);
  const getUserRoles = Digit.SessionStorage.get("User")?.info?.roles;
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { data: MdmsRes } = Digit.Hooks.useCustomMDMS(
    tenant,
    "SandBoxLanding",
    [
      {
        name: "LandingPageRoles",
      },
    ],
    {
      enabled: true,
      staleTime: 0,
      cacheTime: 0,
      select: (data) => {
        return data?.["SandBoxLanding"]?.["LandingPageRoles"];
      },
    }
  );

  useEffect(() => {
    if (MdmsRes?.[0].url) {
      setButtonDisabled(false);
    }
  }, [MdmsRes]);

  const RoleLandingUrl = MdmsRes?.[0].url;

  const roleForLandingPage = (getUserRoles, MdmsRes) => {
    const userRole = getUserRoles?.[0]?.code;
    return userRole === "SUPERUSER" && MdmsRes.some((page) => page.rolesForLandingPage.includes("SUPERUSER"));
  };

  const onButtonClick = () => {
    if (roleForLandingPage(getUserRoles, MdmsRes)) {
      window.location.href = `/${window?.globalPath}/${tenant}${RoleLandingUrl}`;
    } else {
      window.location.href = `/${window?.globalPath}/${tenant}/employee`;
    }
  };

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
