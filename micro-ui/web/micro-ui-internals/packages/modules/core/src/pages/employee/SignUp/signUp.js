import { BackLink, Loader, FormComposerV2, Toast, useCustomAPIMutationHook } from "@egovernments/digit-ui-components";
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


    history.replace(redirectPath);
  }, [user]);

  const reqCreate = {
   url: `/tenant-management/tenant/_create`,
   params: {},
   body: {},
   config: {
     enable: false,
   },
 };

  
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onLogin = async(data) => {


          //  history.push({
          //         pathname: `/${window?.contextPath}/employee/user/otp`,
          //         state: {email:data.email },
          //       });

    await mutation.mutate(
      {
        body: {
          "tenant": {
                   "name": data.accountName,
                   "email": data.email
              },
        },
        config: {
          enable: true,
        },
      },
      {
        onError: (error, variables) => {
          console.log(error, "eryjhtj");
          setShowToast({ key: "error", label: error?.message ? error?.message : error });
        },
        onSuccess: async (data) => {
          console.log("abcd",data);
          
          history.push({
                  pathname: `/${window?.contextPath}/employee/user/otp`,
                  state: {email:data.email },
                });
          Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
        },
      });

  };

  const closeToast = () => {
    setShowToast(null);
  };

 
  // const defaultValue = {
  //   code: Digit.ULBService.getStateId(),
  //   name: Digit.Utils.locale.getTransformedLocale(`TENANT_TENANTS_${Digit.ULBService.getStateId()}`),
  // };

  let config = [{ body: propsConfig?.inputs }];

  const { mode } = Digit.Hooks.useQueryParams();
  if (mode === "admin" && config?.[0]?.body?.[2]?.disable == false && config?.[0]?.body?.[2]?.populators?.defaultValue == undefined) {
    config[0].body[2].disable = true;
    config[0].body[2].isMandatory = false;
    config[0].body[2].populators.defaultValue = defaultValue;
  }

  const onFormValueChange = (setValue, formData, formState) => {

    // Extract keys from the config
  const keys = config[0].body.map(field => field.key);

  const hasEmptyFields = keys.some(key => {
    const value = formData[key];
    return value == null || value === '' || (key === 'check' && value === false) || (key === 'captcha' && value === false);
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
        // onSecondayActionClick={onForgotPassword}
        onFormValueChange={onFormValueChange}
        heading={propsConfig?.texts?.header}
        className="loginFormStyleEmployee"
        cardSubHeaderClassName="loginCardSubHeaderClassName"
        cardClassName="loginCardClassName"
        buttonClassName="buttonClassName"
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
