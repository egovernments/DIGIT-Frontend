import { BackLink, Loader, FormComposerV2, Toast } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";

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

const Login = ({ config: propsConfig, t, isDisabled, loginOTPBased, loginType }) => {
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const { data: storeData, isLoading: isStoreLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [disable, setDisable] = useState(false);

  // console.log("lognnnn", loginType)
  const history = useHistory();
  // const getUserType = () => "EMPLOYEE" || Digit.UserService.getType();

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

    /* logic to redirect back to same screen where we left off  */
    if (window?.location?.href?.includes("from=")) {
      redirectPath = decodeURIComponent(window?.location?.href?.split("from=")?.[1]) || `/${window?.contextPath}/employee`;
    }

    /*  RAIN-6489 Logic to navigate to National DSS home incase user has only one role [NATADMIN]*/
    if (user?.info?.roles && user?.info?.roles?.length > 0 && user?.info?.roles?.every((e) => e.code === "NATADMIN")) {
      redirectPath = `/${window?.contextPath}/employee/dss/landing/NURT_DASHBOARD`;
    }
    /*  RAIN-6489 Logic to navigate to National DSS home incase user has only one role [NATADMIN]*/
    if (user?.info?.roles && user?.info?.roles?.length > 0 && user?.info?.roles?.every((e) => e.code === "STADMIN")) {
      redirectPath = `/${window?.contextPath}/employee/dss/landing/home`;
    }

    history.replace(redirectPath);
  }, [user]);


  // const onLogin = async (data) => {
  //   // if (!data.city) {
  //   //   alert("Please Select City!");
  //   //   return;
  //   // }
  //   setDisable(true);

  //   const requestData = {
  //     ...data,
  //     userType: "EMPLOYEE",
  //   };
  //   requestData.tenantId = data?.city?.code || Digit.ULBService.getStateId();
  //   delete requestData.city;
  //   try {
  //     const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
  //     Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
  //     setUser({ info, ...tokens });
  //   } catch (err) {
  //     setShowToast(
  //       err?.response?.data?.error_description ||
  //         (err?.message == "ES_ERROR_USER_NOT_PERMITTED" && t("ES_ERROR_USER_NOT_PERMITTED")) ||
  //         t("INVALID_LOGIN_CREDENTIALS")
  //     );
  //     setTimeout(closeToast, 5000);
  //   }
    

  const onLogin = async (data) => {
    // // if (!data.city) {
    // //   alert("Please Select City!");
    // //   return;
    // // }
    // setDisable(true);

    // const requestData = {
    //   ...data,
    //   userType: "EMPLOYEE",
    // };
    // requestData.tenantId = data?.city?.code || Digit.ULBService.getStateId();
    // delete requestData.city;
    // try {
    //   const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
    //   Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
    //   setUser({ info, ...tokens });
    // } catch (err) {
    //   setShowToast(
    //     err?.response?.data?.error_description ||
    //       (err?.message == "ES_ERROR_USER_NOT_PERMITTED" && t("ES_ERROR_USER_NOT_PERMITTED")) ||
    //       t("INVALID_LOGIN_CREDENTIALS")
    //   );
    //   setTimeout(closeToast, 5000);
    // }
    // setDisable(false);
    const username = data?.username;
    const password = data?.password
  
    try {
      const response = await fetch("https://digit-lts.digit.org/keycloak-test/realms/2fa/protocol/openid-connect/token", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "admin-cli",
          client_secret: "secret",
          username,
          password,
          grant_type: "password",
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      console.log("JWT:", data.access_token);
      localStorage.setItem("jwt", data.access_token);
  
      // On successful login, redirect to the OTP screen
      history.push({
        pathname: `/${window?.contextPath}/employee/user/success`,
        // state: { email: username, tenant: Digit.ULBService.getStateId() },
      });
    } catch (error) {
      setShowToast(
        error?.response?.data?.Errors?.[0]?.code
          ? `SANDBOX_RESEND_OTP${error.response.data.Errors[0].code}`
          : `SANDBOX_RESEND_OTP_ERROR`
      );
      setTimeout(closeToast, 5000);
    }
  };

  const reqCreate = {
    url: `/user-otp/v1/_send`,
    params: { tenantId: Digit.ULBService.getStateId() },
    body: {},
    config: {
      enable: false,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onKey1Login = async (data) => {
    const username = data?.username;
    // const password = data?.password
  
    try {
      const response = await fetch("https://digit-lts.digit.org/keycloak-test/realms/2fa/protocol/openid-connect/token", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "testing2",
          // client_secret: "secret",
          username,
          grant_type: "password",
        }),
      });
  
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
  
      // const data = await response.json();
  
      // console.log("JWT:", data.access_token);
  
      // On successful login, redirect to the OTP screen
      history.push({
        pathname: `/${window?.contextPath}/employee/user/login/otp`,
        state: { email: username, tenant: Digit.ULBService.getStateId(), username : username , loginType : "otp" },
      });
    } catch (error) {
      setShowToast(
        error?.response?.data?.Errors?.[0]?.code
          ? `SANDBOX_RESEND_OTP${error.response.data.Errors[0].code}`
          : `SANDBOX_RESEND_OTP_ERROR`
      );
      setTimeout(closeToast, 5000);
    }
  };

  const onKeyLogin = async (data) => {
    // const { email: username, password } = data; // Extracting username and password from form data
    const username = data?.username;
    const password = data?.password
  
    try {
      const response = await fetch("https://digit-lts.digit.org/keycloak-test/realms/2fa/protocol/openid-connect/token", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "testing",
          // client_secret: "secret",
          username,
          password,
          grant_type: "password",
        }),
      });
  
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
  
      // const data = await response.json();
  
      // console.log("JWT:", data.access_token);
  
      // On successful login, redirect to the OTP screen
      history.push({
        pathname: `/${window?.contextPath}/employee/user/login/otp`,
        state: { email: username, tenant: Digit.ULBService.getStateId(), username : username , password: password , loginType : "2fa" },
      });
    } catch (error) {
      setShowToast(
        error?.response?.data?.Errors?.[0]?.code
          ? `SANDBOX_RESEND_OTP${error.response.data.Errors[0].code}`
          : `SANDBOX_RESEND_OTP_ERROR`
      );
      setTimeout(closeToast, 5000);
    }
  };
  
  const closeToast = () => {
    setShowToast(null);
  };

  const onForgotPassword = () => {
    history.push(`/${window?.contextPath}/employee/user/forgot-password`);
  };
  const defaultValue = {
    code: Digit.ULBService.getStateId(),
    name: Digit.Utils.locale.getTransformedLocale(`TENANT_TENANTS_${Digit.ULBService.getStateId()}`),
  };

  let config = [{ body: propsConfig?.inputs }];

  const { mode } = Digit.Hooks.useQueryParams();
  if (mode === "admin" && config?.[0]?.body?.[2]?.disable == false && config?.[0]?.body?.[2]?.populators?.defaultValue == undefined) {
    config[0].body[2].disable = true;
    config[0].body[2].isMandatory = false;
    config[0].body[2].populators.defaultValue = defaultValue;
  }

  const onFormValueChange = (setValue, formData, formState) => {
    // Extract keys from the config
    const keys = config[0].body.map((field) => field.key);

    const hasEmptyFields = keys.some((key) => {
      const value = formData[key];
      return value == null || value === "" || (key === "check" && value === false) || (key === "captcha" && value === false);
    });

    // Set disable based on the check
    setDisable(hasEmptyFields);
  };

  return isLoading || isStoreLoading ? (
    <Loader />
  ) : (
    <Background>
      <div className="employeeBackbuttonAlign">
      <BackLink onClick={() => window.history.back()}/>
      </div>
      <FormComposerV2
        onSubmit={(data) => {
    if (loginType === "otp") {
      onKey1Login(data); // Call the appropriate function based on loginType
    } else if (loginType === "2fa") {
      onKeyLogin(data);
    } else {
      onLogin(data); // Default login method
    }
  }}
        isDisabled={isDisabled || disable}
        noBoxShadow
        inline
        submitInForm
        config={config}
        label={propsConfig?.texts?.submitButtonLabel}
        secondaryActionLabel={propsConfig?.texts?.secondaryButtonLabel}
        onSecondayActionClick={onForgotPassword}
        onFormValueChange={onFormValueChange}
        heading={propsConfig?.texts?.header}
        className={`loginFormStyleEmployee ${loginOTPBased ? "sandbox-onboarding-wrapper" : ""}`}
        cardSubHeaderClassName="loginCardSubHeaderClassName"
        cardClassName="loginCardClassName"
        buttonClassName="buttonClassName"
      >
        {stateInfo?.code ? <Header /> : <Header showTenant={false} /> }
      </FormComposerV2>
      {showToast && <Toast type={"error"} label={t(showToast)} onClose={closeToast} />}
      <div className="employee-login-home-footer" style={{ backgroundColor: "unset" }}>
        <img
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

Login.propTypes = {
  loginParams: PropTypes.any,
};

Login.defaultProps = {
  loginParams: null,
};

export default Login;
