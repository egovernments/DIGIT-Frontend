import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FormComposerV2, Loader, Toast, BackLink } from '@egovernments/digit-ui-components';
import { loginConfig as defaultLoginConfig } from "./config";
import { LoginOtpConfig as defaultLoginOtpConfig } from "./ConfigOtp";
import { useLoginConfig } from "../../../hooks/useLoginConfig";
import { userService } from '@egovernments/digit-ui-libraries-new';
import Carousel from './Carousel/Carousel';
import './login.css';

const setEmployeeDetail = (userObject, token) => {
  let locale = localStorage.getItem('digit-language') || 'en_IN';
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

const EmployeeLogin = ({ stateCode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loginConfig, setloginConfig] = useState(defaultLoginConfig);
  const [loginOtpConfig, setloginOtpConfig] = useState(defaultLoginOtpConfig);
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [disable, setDisable] = useState(false);
  
  const moduleCode = ["privacy-policy"];
  const language = localStorage.getItem('digit-language') || 'en_IN';
  const modulePrefix = "digit";
  const loginType = window?.globalConfigs?.getConfig?.("OTP_BASED_LOGIN") || false;
  
  // Use MDMS config hook
  const { data: mdmsData, isLoading: isMdmsLoading } = useLoginConfig(stateCode);
  
  // Use store data if available
  const storeData = window.Digit?.Hooks?.useStore?.getInitData ? 
    window.Digit.Hooks.useStore.getInitData() : { isLoading: false };

  useEffect(() => {
    if (!isMdmsLoading && mdmsData?.config) { 
      setloginConfig(mdmsData?.config);
    } else {
      setloginConfig(defaultLoginConfig);
    }
  }, [mdmsData, isMdmsLoading]);

  useEffect(() => {
    if (!user) {
      return;
    }
    
    // Set user in session storage equivalent
    localStorage.setItem("citizen.userRequestObject", JSON.stringify(user));
    setEmployeeDetail(user?.info, user?.access_token);
    
    let redirectPath = `/employee/dashboard`;
    
    // Logic to redirect back to same screen where we left off
    if (window?.location?.href?.includes("from=")) {
      redirectPath = decodeURIComponent(window?.location?.href?.split("from=")?.[1]) || `/employee/dashboard`;
    }
    
    navigate(redirectPath, { replace: true });
  }, [user, navigate]);

  const onLogin = async (data) => {
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
    
    // Mock tenant ID - in real app this would come from selected city
    const mockStateCode = stateCode || window?.globalConfigs?.getConfig?.('STATE_LEVEL_TENANT_ID') || 'mz';
    requestData.tenantId = requestData?.city?.code || mockStateCode;
    delete requestData.city;
    
    try {
      // Real authentication using userService
      console.log('Login attempt:', requestData);
      
      const { UserRequest: info, ...tokens } = await userService.authenticate(requestData);
      
      // Store employee tenant ID
      if (info?.tenantId) {
        localStorage.setItem("Employee.tenantId", info.tenantId);
      }
      
      setUser({ info, ...tokens });
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = t('INVALID_LOGIN_CREDENTIALS');
      
      if (err?.response?.data?.error_description) {
        errorMessage = err.response.data.error_description;
      } else if (err?.message === "ES_ERROR_USER_NOT_PERMITTED") {
        errorMessage = t("ES_ERROR_USER_NOT_PERMITTED");
      }
      
      setShowToast(errorMessage);
      setTimeout(closeToast, 5000);
    }
    setDisable(false);
  };

  const onOtpLogin = async (data) => {
    setDisable(true);
    
    try {
      const inputEmail = data.email;
      
      await userService.sendOtp({
        otp: {
          userName: data.email,
          type: "login",
          tenantId: stateCode || window?.globalConfigs?.getConfig?.('STATE_LEVEL_TENANT_ID') || 'mz',
          userType: "EMPLOYEE",
        },
      }, stateCode);
      
      navigate(`/employee/user/login/otp`, {
        state: { email: inputEmail, tenant: stateCode }
      });
    } catch (error) {
      console.error('OTP send error:', error);
      setShowToast(
        error?.response?.data?.Errors?.[0].code ? 
        `SANDBOX_RESEND_OTP${error?.response?.data?.Errors?.[0]?.code}` : 
        `SANDBOX_RESEND_OTP_ERROR`
      );
      setTimeout(closeToast, 5000);
    }
    setDisable(false);
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onForgotPassword = () => {
    navigate(`/employee/user/forgot-password`);
  };

  const defaultTenant = stateCode || window?.globalConfigs?.getConfig?.('STATE_LEVEL_TENANT_ID') || 'mz';
  const defaultValue = {
    code: defaultTenant,
    name: `TENANT_TENANTS_${defaultTenant}` // Mock tenant name
  };

  let config = [{ body: loginConfig[0]?.inputs || [] }];

  // Handle admin mode similar to old core app
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  if (mode === "admin" && config?.[0]?.body?.[2]?.disable === false && config?.[0]?.body?.[2]?.populators?.defaultValue === undefined) {
    config[0].body[2].disable = true;
    config[0].body[2].isMandatory = false;
    config[0].body[2].populators.defaultValue = defaultValue;
  }

  const defaultValues = useMemo(() => Object.fromEntries(
    config[0].body
      .filter(field => field?.populators?.defaultValue && field?.populators?.name)
      .map(field => [field.populators.name, field.populators.defaultValue])
  ), [config]);

  const onFormValueChange = (setValue, formData, formState) => {
    // Extract keys from the config    
    const keys = config[0].body.filter(field => field?.isMandatory).map((field) => field?.key);

    const hasEmptyFields = keys.some((key) => {
      const value = formData[key];
      return value == null || value === "" || value === false;
    });

    setDisable(hasEmptyFields);
  };

  const loginParams = useMemo(
    () =>
      loginConfig.map((step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      }),
    [loginConfig, t]
  );

  const loginOtpParams = useMemo(
    () =>
      loginOtpConfig.map((step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      }),
    [loginOtpConfig, t]
  );

  if (isMdmsLoading || storeData?.isLoading) {
    return <Loader page={true} variant="PageLoader" />;
  }

  const propsConfig = loginType ? loginOtpParams[0] : loginParams[0];

  const renderLoginForm = (extraClasses = "", cardClassName = "", wrapperClass = "") => (
    <FormComposerV2
      onSubmit={loginType ? onOtpLogin : onLogin}
      isDisabled={disable}
      noBoxShadow
      inline
      submitInForm
      config={config}
      label={propsConfig?.texts?.submitButtonLabel}
      secondaryActionLabel={propsConfig?.texts?.secondaryButtonLabel}
      onSecondayActionClick={onForgotPassword}
      onFormValueChange={onFormValueChange}
      heading={propsConfig?.texts?.header}
      className={`${wrapperClass}`}
      cardSubHeaderClassName="loginCardSubHeaderClassName"
      cardClassName={cardClassName}
      buttonClassName="buttonClassName"
      defaultValues={defaultValues}
    />
  );
  
  const renderFooter = (footerClassName) => (
    <div className={footerClassName} style={{ backgroundColor: "unset" }}>
      {window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW") && (
        <img
          alt="Powered by DIGIT"
          src={window.globalConfigs.getConfig("DIGIT_FOOTER_BW")}
          style={{ cursor: "pointer", height: "24px", opacity: 0.7 }}
          onClick={() => {
            window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
          }}
        />
      )}
    </div>
  );

  // Use carousel layout if banner images are configured
  return propsConfig?.bannerImages ? (
    <div className="login-container">
      <Carousel bannerImages={propsConfig?.bannerImages} />
      <div className="login-form-container">
        {renderLoginForm("login-form-container", "", loginType ? "sandbox-onboarding-wrapper" : "")}
        {showToast && <Toast type="error" label={t(showToast)} onClose={closeToast} />}
        {renderFooter("EmployeeLoginFooter")}
      </div>
    </div>
  ) : (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <BackLink onClick={() => navigate('/employee/language-selection')} />
        </div>
        
        {renderLoginForm(
          "loginFormStyleEmployee",
          "loginCardClassName",
          loginType ? "sandbox-onboarding-wrapper" : ""
        )}
        {showToast && <Toast type="error" label={t(showToast)} onClose={closeToast} />}
        {renderFooter("employee-login-home-footer")}
      </div>
    </div>
  );
};

export default EmployeeLogin;