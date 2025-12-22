import { BackLink, Loader, FormComposerV2, Toast } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";
import Carousel from "./Carousel/Carousel";
import ImageComponent from "../../../components/ImageComponent";

const setEmployeeDetail = (userObject, token) => {
  if (Digit.Utils.getMultiRootTenant() && process.env.NODE_ENV !== "development") {
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

const Login = ({ config: propsConfig, t, isDisabled, loginOTPBased }) => {
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const { data: storeData, isLoading: isStoreLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [disable, setDisable] = useState(false);
  //checking for custom login components
  const DynamicLoginComponent = Digit.ComponentRegistryService?.getComponent("DynamicLoginComponent");
  // const { t } = useTranslation();

  const history = useHistory();

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    const filteredRoles = user?.info?.roles?.filter((role) => role.tenantId === Digit.SessionStorage.get("Employee.tenantId"));
    if (user?.info?.roles?.length > 0) user.info.roles = filteredRoles;
    Digit.UserService.setUser(user);
    setEmployeeDetail(user?.info, user?.access_token);
    let redirectPath = `/${window?.contextPath}/employee`;

    /* logic to redirect back to same screen where we left off */
    if (window?.location?.href?.includes("from=")) {
      redirectPath = decodeURIComponent(window?.location?.href?.split("from=")?.[1]) || `/${window?.contextPath}/employee`;
    }

    /*  RAIN-6489 Logic to navigate to National DSS home in case user has only one role [NATADMIN]*/
    if (user?.info?.roles && user?.info?.roles?.length > 0 && user?.info?.roles?.every((e) => e.code === "NATADMIN")) {
      redirectPath = `/${window?.contextPath}/employee/dss/landing/NURT_DASHBOARD`;
    }
    /*  RAIN-6489 Logic to navigate to National DSS home in case user has only one role [NATADMIN]*/
    if (user?.info?.roles && user?.info?.roles?.length > 0 && user?.info?.roles?.every((e) => e.code === "STADMIN")) {
      redirectPath = `/${window?.contextPath}/employee/dss/landing/home`;
    }

    history.replace(redirectPath); // Replaced history.replace with navigate
  }, [user]);

  const onLogin = async (data) => {
    // if (!data.city) {
    //   alert("Please Select City!");
    //   return;
    // }
    if (data?.username) {
      data.username = data.username.trim();
    }
    if (data?.password) {
      data.password = data.password.trim();
    }

    setDisable(true);

    const requestData = {
      ...data,
      ...defaultValues,
      userType: "EMPLOYEE",
    };
    requestData.tenantId = requestData?.city?.code || Digit?.ULBService?.getStateId();
    delete requestData.city;
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
    setDisable(false);
  };

  const reqCreate = {
    url: `/user-otp/v1/_send`,
    params: { tenantId: Digit?.ULBService?.getStateId() },
    body: {},
    config: {
      enable: false,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onOtpLogin = async (data) => {
    const inputEmail = data.email;
    await mutation.mutate(
      {
        body: {
          otp: {
            userName: data.email,
            type: "login",
            tenantId: Digit?.ULBService?.getStateId(),
            userType: "EMPLOYEE",
          },
        },
        config: {
          enable: true,
        },
      },
      {
        onError: (error, variables) => {
          setShowToast(
            error?.response?.data?.Errors?.[0].code ? `SANDBOX_RESEND_OTP${error?.response?.data?.Errors?.[0]?.code}` : `SANDBOX_RESEND_OTP_ERROR`
          );
          setTimeout(closeToast, 5000);
        },
        onSuccess: async (data) => {
          history.push(`/${window?.contextPath}/employee/user/login/otp`, {
            state: { email: inputEmail, tenant: Digit?.ULBService?.getStateId() },
          });
        },
      }
    );
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onForgotPassword = () => {
    history.push(`/${window?.contextPath}/employee/user/forgot-password`);
  };
  const defaultTenant = Digit.ULBService.getStateId();

  const defaultValue = {
    code: defaultTenant,
    name: Digit.Utils.locale.getTransformedLocale(`TENANT_TENANTS_${defaultTenant}`),
  };

  let config = [{ body: propsConfig?.inputs }];

  const { mode } = Digit.Hooks.useQueryParams();

  if (mode === "admin" && config?.[0]?.body?.[2]?.disable === false && config?.[0]?.body?.[2]?.populators?.defaultValue == undefined) {
    config[0].body[2].disable = true;
    config[0].body[2].isMandatory = false;
    config[0].body[2].populators.defaultValue = defaultValue;
  }

  const defaultValues = useMemo(() => Object.fromEntries(
    config[0].body
      .filter(field => field?.populators?.defaultValue && field?.populators?.name)
      .map(field => [field.populators.name, field.populators.defaultValue])
  ), [])

  const onFormValueChange = (setValue, formData, formState) => {

    // Extract keys from the config    
    const keys = config[0].body.filter(field => field?.isMandatory).map((field) => field?.key);

    const hasEmptyFields = keys.some((key) => {
      const value = formData[key];
      return value == null || value === "" || value === false;
    });

    setDisable(hasEmptyFields);
  };

  const renderLoginForm = (extraClasses = "", cardClassName = "", wrapperClass = "") => (
    <FormComposerV2
      onSubmit={loginOTPBased ? onOtpLogin : onLogin}
      isDisabled={isDisabled || disable}
      noBoxShadow
      inline
      submitInForm
      config={config}
      label={propsConfig?.texts?.submitButtonLabel}
      secondaryActionLabel={
        propsConfig?.texts?.secondaryButtonLabel +
        (extraClasses.includes("login-form-container") ? "?" : "")
      }
      onSecondayActionClick={onForgotPassword}
      onFormValueChange={onFormValueChange}
      heading={propsConfig?.texts?.header}
      className={`${wrapperClass}`}
      cardSubHeaderClassName="loginCardSubHeaderClassName"
      cardClassName={cardClassName}
      buttonClassName="buttonClassName"
      defaultValues={defaultValues}
    >
      {stateInfo?.code ? <Header /> : <Header showTenant={false} />}
    </FormComposerV2>
  );

  const renderFooter = (footerClassName) => (
    <div className={footerClassName} style={{ backgroundColor: "unset" }}>
      <ImageComponent
        alt="Powered by DIGIT"
        src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
        style={{ cursor: "pointer" }}
        onClick={() => {
          window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
        }}
      />
    </div>
  );


  if (isLoading || isStoreLoading) {
    return <Loader page={true} variant="PageLoader" />
  }
  return propsConfig?.bannerImages ? (
    <div className="login-container">
      <Carousel bannerImages={propsConfig?.bannerImages} />
      <div className="login-form-container">
        {renderLoginForm("login-form-container", "", loginOTPBased ? "sandbox-onboarding-wrapper" : "")}
        {DynamicLoginComponent && <DynamicLoginComponent />}
        {showToast && <Toast type="error" label={t(showToast)} onClose={closeToast} />}
        {renderFooter("EmployeeLoginFooter")}
      </div>
    </div>
  ) : (
    <Background>
      <div className="employeeBackbuttonAlign">
        <BackLink onClick={() => window.history.back()} />
      </div>
      {renderLoginForm(
        "loginFormStyleEmployee",
        "loginCardClassName",
        loginOTPBased ? "sandbox-onboarding-wrapper" : ""
      )}
      {DynamicLoginComponent && <DynamicLoginComponent />}
      {showToast && <Toast type="error" label={t(showToast)} onClose={closeToast} />}
      {renderFooter("employee-login-home-footer")}
    </Background>
  );

};

Login.propTypes = {
  loginParams: PropTypes.any,
};

Login.defaultProps = {
  loginParams: null,
};

export default Login;