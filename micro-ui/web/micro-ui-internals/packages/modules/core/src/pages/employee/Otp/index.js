import React, { useState, useEffect } from "react";
import { BackLink, Toast, Loader } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory, useLocation } from "react-router-dom";
import ImageComponent from "../../../components/ImageComponent";
import Carousel from "../SignUp-v2/CarouselComponent/CarouselComponent";
import SandBoxHeader from "../../../components/SandBoxHeader";

const setEmployeeDetail = (userObject, token) => {
  if (Digit.Utils.getMultiRootTenant()) return;
  let locale = JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || Digit.Utils.getDefaultLanguage();
  localStorage.setItem("Employee.tenant-id", userObject?.tenantId);
  localStorage.setItem("tenant-id", userObject?.tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem("Employee.locale", locale);
  localStorage.setItem("token", token);
  localStorage.setItem("Employee.token", token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem("Employee.user-info", JSON.stringify(userObject));
};

const Otp = ({ isLogin = false }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const [showToast, setShowToast] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [user, setUser] = useState(null);

  const email = location?.state?.email || sessionStorage.getItem("otpEmail") || "";
  const tenant = location?.state?.tenant || sessionStorage.getItem("otpTenant") || "";

  // Carousel + Form config
  const config = [
    {
      body: [
        {
          type: "component",
          component: "OtpComponent",
          key: "OtpComponent",
          withoutLabel: true,
          isMandatory: false,
          customProps: { email, tenant },
          populators: { required: true }
        }
      ],
      bannerImages: [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1746277121508-f44615ff09bb",
          title: "Digital Headquarters for National Health Agencies",
          description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
        },
        {
          id: 2,
          image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
          title: "Digital Headquarters for National Health Agencies",
          description: "Access real-time data dashboards and manage complaints."
        }
        // ... other images
      ]
    }
  ];

  const OtpConfig = [
    {
      texts: {
        submitButtonLabel: "CORE_COMMON_SUBMIT",
        // header: "SANDBOX_OTP_VERIFICATION"
      }
    }
  ];

  const closeToast = () => setShowToast(null);

  const onSubmit = async (formData) => {
    try {
      const requestData = {
        username: email,
        password: formData?.OtpComponent?.otp,
        tenantId: tenant,
        userType: "EMPLOYEE"
      };
      const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
      Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
      setUser({ info, ...tokens });
    } catch (err) {
      setShowToast(
        err?.response?.data?.error_description ||
          (err?.message === "ES_ERROR_USER_NOT_PERMITTED" && t("ES_ERROR_USER_NOT_PERMITTED")) ||
          t("INVALID_LOGIN_CREDENTIALS")
      );
      setTimeout(closeToast, 5000);
    }
  };

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      setEmployeeDetail(user?.info, user?.access_token);
      history.push(`/${window?.globalPath}/user/setup`);
    }
  }, [user]);

  // Responsive check
  const isMobile = window.innerWidth <= 768;

  // Form section helper
  const renderOtpFormSection = () => (
    <div
      style={{
        padding: isMobile ? "1rem" : "2rem",
        width: isMobile ? "100%" : "30%",
        backgroundColor: "#fff",
        overflowY: "auto",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height : isMobile ? "100vh" : "auto"
      }}
    >
      <div className="employeeBackbuttonAlign" style={{ alignSelf: "flex-start", marginBottom: "1rem" }}>
        <BackLink onClick={() => window.history.back()} />
      </div>
      <FormComposerV2
        onSubmit={onSubmit}
        noBoxShadow
        inline
        submitInForm
        isDisabled={!isOtpValid}
        config={config}
        label={OtpConfig[0].texts.submitButtonLabel}
        heading={OtpConfig[0].texts.header}
        className="sandbox-onboarding-wrapper"
        onFormValueChange={(setValue, formValue) => {
          const otpValue = formValue["OtpComponent"]?.otp;
          setIsOtpValid(otpValue?.length === 6);
        }}
      >
        <SandBoxHeader showTenant={false} />
      </FormComposerV2>
      {showToast && <Toast type="error" label={t(showToast)} onClose={closeToast} />}
      <div className="EmployeeLoginFooter" style={{ marginTop: "auto" }}>
        <ImageComponent
          alt="Powered by DIGIT"
          src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
          style={{ cursor: "pointer" }}
          onClick={() => window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus()}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return renderOtpFormSection();
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "70%", position: "relative" }}>
        <Carousel bannerImages={config[0].bannerImages} />
      </div>
      {renderOtpFormSection()}
    </div>
  );
};

export default Otp;
