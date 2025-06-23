import React, { useState, useEffect } from "react";
import { BackLink, CardLabel, Loader, Toast } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch, useHistory, useLocation } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";
import ImageComponent from "../../../components/ImageComponent";
import Carousel  from "../SignUp-v2/CarouselComponent/CarouselComponent";
import SandBoxHeader from "../../../components/SandBoxHeader";


/* set employee details to enable backward compatiable */
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
  const { path } = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const [showToast, setShowToast] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [user, setUser] = useState(null);
  const [params, setParams] = useState(location?.state?.data || {});
  const [ifSuperUserExists, setIfSuperUserExist] = useState(false);
  const { state } = location;
  const email = state?.email || sessionStorage.getItem('otpEmail') || '';
  const tenant = state?.tenant || sessionStorage.getItem('otpTenant') || '';
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
      bannerImages: [{
        id: 1,
        image: 'https://images.unsplash.com/photo-1746277121508-f44615ff09bb',
        title: 'Digital Headquarters for National Health Agencies',
        description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9',
        title: 'Digital Headquarters for National Health Agencies',
        description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0',
        title: 'Digital Headquarters for National Health Agencies',
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aut autem aperiam et modi saepe obcaecati doloremque voluptatem iusto quidem!"
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1547481887-a26e2cacb5b2',
        title: 'Digital Headquarters for National Health Agencies',
        description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
      },
      {
        id: 5,
        image: 'https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0',
        title: 'Digital Headquarters for National Health Agencies',
        description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
      },
      {
        id: 6,
        image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94',
        title: 'Digital Headquarters for National Health Agencies',
        description: "Set up and configure multiple campaigns, access real-time data dashboards, manage centralized help desks and complaints, and easily integrate with DHIS2 and other open-source products."
      },
      ],

    },
  ];

  const OtpConfig = [
    {
      texts: {
        // header: t("CORE_COMMON_OTP_LABEL"),
        submitButtonLabel: "CORE_COMMON_SUBMIT",
        // header: t("SANDBOX_OTP_VERIFICATION"),

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
      history.push(redirectPathOtpLogin);
      return;
    } else {
      history.push({
        pathname: redirectPath,
        state: { tenant: tenant },
      });
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

  console.log(`*** LOG ***`,config);

  return (

    <div style={{ display: "flex", height: "100vh" }}>
    {/* Left Carousel Section */}
    <div style={{ width: "70%", position: "relative" }}>
      <Carousel bannerImages={config[0].bannerImages} />
    </div>

    {/* Right Form Section */}
    <div style={{ width: "30%", backgroundColor: "#fff", padding: "2rem", overflowY: "auto",
      justifyContent:"center", display:"flex",alignItems:"center"
     }}>
         <div className="employeeBackbuttonAlign">
        <BackLink onClick={() => window.history.back()} />
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
        <SandBoxHeader showTenant={false} />
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
    </div>
  </div>





    
    // <Background>
    //   <div className="employeeBackbuttonAlign">
    //     <BackLink onClick={() => window.history.back()} />
    //   </div>
    //   <FormComposerV2
    //     onSubmit={onSubmit}
    //     noBoxShadow
    //     inline
    //     submitInForm
    //     onFormValueChange={(setValue, formValue) => {
    //       const otpValue = formValue["OtpComponent"];
    //       if (otpValue?.otp?.length === 6) {
    //         setIsOtpValid(true);
    //       } else {
    //         setIsOtpValid(false);
    //       }
    //     }}
    //     isDisabled={!isOtpValid}
    //     config={config}
    //     label={OtpConfig[0].texts.submitButtonLabel}
    //     heading={OtpConfig[0].texts.header}
    //     headingStyle={{ textAlign: "center" }}
    //     cardStyle={{ maxWidth: "408px", margin: "auto" }}
    //     className="sandbox-onboarding-wrapper"
    //   >
    //     <Header showTenant={false} />
    //   </FormComposerV2>
    //   {showToast && <Toast type={"error"} label={t(showToast)} onClose={closeToast} />}
    //   <div className="EmployeeLoginFooter">
    //     <ImageComponent
    //       alt="Powered by DIGIT"
    //       src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
    //       style={{ cursor: "pointer" }}
    //       onClick={() => {
    //         window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
    //       }}
    //     />{" "}
    //   </div>
    // </Background>
  );
};

export default Otp;
