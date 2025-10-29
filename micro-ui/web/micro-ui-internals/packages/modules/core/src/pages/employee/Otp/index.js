import React, { useState, useEffect } from "react";
import { BackLink, Loader, Toast, Button } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import ImageComponent from "../../../components/ImageComponent";
import SandBoxHeader from "../../../components/SandBoxHeader";
import Carousel from "../SignUp-v2/CarouselComponent/CarouselComponent";

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
  const { path } = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  const [showToast, setShowToast] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [user, setUser] = useState(null);

  const email = location?.state?.email || sessionStorage.getItem('otpEmail') || '';
  const tenant = location?.state?.tenant || sessionStorage.getItem('otpTenant') || '';

  const { data: MdmsRes } = Digit.Hooks.useCustomMDMS(
    tenant,
    "SandBoxLanding",
    [{ name: "LandingPageRoles" }],
    { enabled: true, staleTime: 0, cacheTime: 0, select: (data) => data?.SandBoxLanding?.LandingPageRoles }
  );

  const RoleLandingUrl = MdmsRes?.[0]?.url;

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
      bannerImages: [   {
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
      }],
    }
  ];

  const OtpConfig = [{ texts: { submitButtonLabel: "CORE_COMMON_SUBMIT" } }];

  const closeToast = () => setShowToast(null);

  useEffect(() => {
    if (!user) return;
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    const filteredRoles = user?.info?.roles?.filter((role) => role.tenantId === Digit.SessionStorage.get("Employee.tenantId"));
    if (user?.info?.roles?.length > 0) user.info.roles = filteredRoles;
    Digit.UserService.setUser(user);
    setEmployeeDetail(user?.info, user?.access_token);

    const getRedirectPathOtpLogin = (locationPathname, user, MdmsRes, RoleLandingUrl) => {
      const userRole = user?.info?.roles?.[0]?.code;
      const isSuperUser = userRole === "SUPERUSER";
      const contextPath = window?.contextPath;

      switch (true) {
        case locationPathname === "/sandbox-ui/user/otp" && isSuperUser:
          return `/${contextPath}/employee/sandbox/landing`;
        case isSuperUser && MdmsRes?.[0]?.rolesForLandingPage?.includes("SUPERUSER"):
          return `/${contextPath}${RoleLandingUrl}`;
        default:
          return `/${contextPath}/employee`;
      }
    };
    const redirectPathOtpLogin = getRedirectPathOtpLogin(location.pathname, user, MdmsRes, RoleLandingUrl);

    if (isLogin) history.push(redirectPathOtpLogin);
    else history.push({ pathname: `/${window?.globalPath}/user/setup`, state: { tenant } });

  }, [user]);

  const onSubmit = async (formData) => {
    const requestData = { username: email, password: formData?.OtpComponent?.otp, tenantId: tenant, userType: "EMPLOYEE" };
    try {
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

  // Responsive logic
  const isMobile = window.innerWidth <= 768;

  const renderFormSection = () => (
    <div   style={{
      padding: isMobile ? "1rem" : "2rem",
      width: isMobile ? "100%" : "30%",
      backgroundColor: "#fff",
      overflowY: "auto",
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      height : isMobile ? "100vh" : "auto"
    }}>
      <div className="employeeBackbuttonAlign" style={{ alignSelf: "flex-start", marginBottom: "1rem" }}>
        <BackLink onClick={() => window.history.back()} />
      </div>
      <FormComposerV2
        onSubmit={onSubmit}
        noBoxShadow
        inline
        submitInForm
        config={config}
        label={t("CORE_COMMON_SUBMIT")}
        headingStyle={{ textAlign: "center" }}
        cardStyle={{ maxWidth: "408px", margin: "auto" }}
        className="sandbox-onboarding-wrapper"
        buttonClassName="sandbox-otp-submit-button"
        buttonStyle={{ 
          width: "100%", 
          maxWidth: "408px",
          backgroundColor: "#F47738",
          borderColor: "#F47738",
          color: "#fff",
          fontWeight: "500",
          padding: "12px 24px",
          borderRadius: "4px",
          fontSize: "16px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        onFormValueChange={(_, formValue) => setIsOtpValid(formValue?.OtpComponent?.otp?.length === 6)}
        isDisabled={!isOtpValid}
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

  // Return
  return isMobile ? (
    renderFormSection()
  ) : (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "70%", position: "relative" }}>
        <Carousel bannerImages={config[0].bannerImages} />
      </div>
      {renderFormSection()}
    </div>
  );
};

export default Otp;
