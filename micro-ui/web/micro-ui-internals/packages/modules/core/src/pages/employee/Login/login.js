import { BackLink, Loader, FormComposerV2, Toast } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";

/* set employee details to enable backward compatiable */
const setEmployeeDetail = (userObject, token) => {
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

const Login = ({ config: propsConfig, t, isDisabled }) => {
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const { data: storeData, isLoading: isStoreLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [disable, setDisable] = useState(false);

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

  const onLogin = async (data) => {
    // if (!data.city) {
    //   alert("Please Select City!");
    //   return;
    // }
    setDisable(true);
    const requestData = {
      ...data,
      ...defaultValues,
      userType: "EMPLOYEE",
    };
    requestData.tenantId = requestData?.city?.code || Digit.ULBService.getStateId();
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
  if (
    mode === "admin" && config?.[0]?.body?.[2]?.disable == false && config?.[0]?.body?.[2]?.populators?.defaultValue == undefined ) {
    config[0].body[2].disable = true;
    config[0].body[2].isMandatory = false;
    config[0].body[2].populators.defaultValue = defaultValue;
  }
  const defaultValues = config[0].body.reduce((acc, curr) => {
    if (curr?.populators?.defaultValue) {
      acc = { ...acc, [curr?.populators?.name]: curr?.populators?.defaultValue };
    }
    return acc;
  }, {});  
  const onFormValueChange = (setValue, formData, formState) => {
    // Extract keys from the config
    const keys = config[0].body.filter(field=>field?.isMandatory).map((field) => field.key);

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
        <BackLink />
      </div>
      <FormComposerV2
        onSubmit={onLogin}
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
        className="loginFormStyleEmployee"
        cardSubHeaderClassName="loginCardSubHeaderClassName"
        cardClassName="loginCardClassName"
        buttonClassName="buttonClassName"
        defaultValues={defaultValues}
      >
        <Header />
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
