import React, { useState, useEffect } from "react";
import { BackLink, CardLabel, Loader, Toast } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom"; // Updated imports for v6
import Background from "../../../components/Background";
import Header from "../../../components/Header";
import ImageComponent from "../../../components/ImageComponent";

/* set employee details to enable backward compatible */
const setEmployeeDetail = (userObject, token) => {
  if (Digit.Utils.getMultiRootTenant()) {
    return;
  }
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
  const navigate = useNavigate(); // Replaced useHistory with useNavigate
  const location = useLocation();
  const [showToast, setShowToast] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [user, setUser] = useState(null);
  const [params, setParams] = useState(location?.state?.data || {});
  const [ifSuperUserExists, setIfSuperUserExist] = useState(false);
  // In v6, location.state is directly available, no need for destructuring within another object
  const { email, tenant } = location.state || {}; 

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

  const RoleLandingUrl = MdmsRes?.[0].url;

  const config = [
    {
      body: [
        {
          type: "component",
          component: "OtpComponent",
          key: "OtpComponent",
          withoutLabel: true,
          isMandatory: false,
          customProps: {
            email: email,
            tenant: tenant,
          },
          populators: {
            required: true,
          },
        },
      ],
    },
  ];

  const OtpConfig = [
    {
      texts: {
        // header: t("CORE_COMMON_OTP_LABEL"),
        header: t("SANDBOX_OTP_VERIFICATION"),
        submitButtonLabel: "CORE_COMMON_SUBMIT",
      },
    },
  ];

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    const filteredRoles = user?.info?.roles?.filter((role) => role.tenantId === Digit.SessionStorage.get("Employee.tenantId"));
    if (user?.info?.roles?.length > 0) user.info.roles = filteredRoles;
    Digit.UserService.setUser(user);
    setEmployeeDetail(user?.info, user?.access_token);
    let redirectPath = `/${window?.globalPath}/user/setup`;

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

    // Usage
    const redirectPathOtpLogin = getRedirectPathOtpLogin(location.pathname, user, MdmsRes, RoleLandingUrl);

    if (isLogin) {
      navigate(redirectPathOtpLogin); // Replaced history.push with navigate
      return;
    } else {
      navigate(
        {
          pathname: redirectPath,
        },
        { state: { tenant: tenant } } // Pass state as a separate options object
      );
      return;
    }
  }, [user]);

  const onSubmit = async (formData) => {
    const requestData = {
      username: email,
      password: formData?.OtpComponent?.otp,
      tenantId: tenant,
      userType: "EMPLOYEE",
    };
    try {
      const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
      Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
      setUser({ info, ...tokens });
    } catch (err) {
      setShowToast(
        err?.response?.data?.error_description ||
          (err?.message == "ES_ERROR_USER_NOT_PERMITTED" && t("ES_ERROR_USER_NOT_PERMITTED")) ||
          t("INVALID_LOGIN_CREDENTIALS")
      );
      setTimeout(closeToast, 5000);
    }
  };

  return (
    <Background>
      <div className="employeeBackbuttonAlign">
        <BackLink onClick={() => navigate(-1)} /> {/* navigate(-1) for going back */}
      </div>
      <FormComposerV2
        onSubmit={onSubmit}
        noBoxShadow
        inline
        submitInForm
        onFormValueChange={(setValue, formValue) => {
          const otpValue = formValue["OtpComponent"];
          if (otpValue?.otp?.length === 6) {
            setIsOtpValid(true);
          } else {
            setIsOtpValid(false);
          }
        }}
        isDisabled={!isOtpValid}
        config={config}
        label={OtpConfig[0].texts.submitButtonLabel}
        heading={OtpConfig[0].texts.header}
        headingStyle={{ textAlign: "center" }}
        cardStyle={{ maxWidth: "408px", margin: "auto" }}
        className="sandbox-onboarding-wrapper"
      >
        <Header showTenant={false} />
      </FormComposerV2>
      {showToast && <Toast type={"error"} label={t(showToast)} onClose={closeToast} />}
      <div className="EmployeeLoginFooter">
        <ImageComponent
          alt="Powered by DIGIT"
          src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
          }}
        />{" "}
      </div>
    </Background>
  );
};

export default Otp;