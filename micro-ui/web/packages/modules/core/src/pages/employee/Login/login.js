import { BackLink, Loader, FormComposerV2, Toast } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";
import Carousel from "./Carousel/Carousel";
import ImageComponent from "../../../components/ImageComponent";
// import SkipToMainContent from "../SkipToMainContent/SkipToMainContent";
import withAutoFocusMain from "../../../hoc/withAutoFocusMain";

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
  const {
    data: storeData,
    isLoading: isStoreLoading,
  } = Digit.Hooks.useStore.getInitData();
  const {
    data: ssoMDMSData,
    isLoading: isSSOMDMSLoading,
  } = Digit.Hooks.useSSOConfig(Digit.ULBService.getStateId(), {
    select: (data) => {
      const config =
        data?.MdmsRes?.["SSO"]?.IdentityProviders ||
        data?.["SSO"]?.IdentityProviders ||
        data?.["IdentityProviders"] ||
        [];
      return Array.isArray(config) ? config : [];
    },
  });
  const { stateInfo } = storeData || {};
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [disable, setDisable] = useState(false);
  const [loginLoader, setLoginLoader] = useState(false);
  const navigate = useNavigate();
  const DynamicLoginComponent = Digit.ComponentRegistryService?.getComponent(
    "DynamicLoginComponent",
  );

  /* Generic SSO Callback Handler - runs on mount / when disable/user/stateInfo change */
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const searchParams = new URLSearchParams(window.location.search);
    const idToken = hashParams.get("id_token") || searchParams.get("id_token");
    const accessToken =
      hashParams.get("access_token") || searchParams.get("access_token");
    const code = searchParams.get("code");

    const error = searchParams.get("error") || hashParams.get("error");
    const errorDescription =
      searchParams.get("error_description") ||
      hashParams.get("error_description") ||
      searchParams.get("errorDescription") ||
      hashParams.get("errorDescription");

    // If we are not on an SSO callback URL, never keep the SSO overlay loader.
    // Important: we intentionally don't set the loader before redirecting to the provider,
    // so browser back (including bfcache restores) won't get stuck with a stale loader.
    if (!idToken && !code && !error) {
      if (loginLoader) setLoginLoader(false);
      if (disable) setDisable(false);
      return;
    }

    if (error && !showToast) {
      setShowToast(errorDescription || "SSO Login Failed!");
      setTimeout(closeToast, 5000);
      setLoginLoader(false);
      setDisable(false);
      return;
    }

    if (!stateInfo?.code) {
      // Tenant/state not ready yet; wait and retry when stateInfo arrives.
      return;
    }

    if ((idToken || code) && !user && !disable) {
      if (idToken) {
        handleDigitLogin(idToken, accessToken);
      } else if (code) {
        setDisable(true);
        setLoginLoader(true);
        Digit.UserService.microsoftAuthenticate({ code })
          .then(({ UserRequest: info, ...tokens }) => {
            Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
            setUser({ info, ...tokens });
            setDisable(false);
            setLoginLoader(false);
          })
          .catch((err) => {
            setShowToast(
              err?.response?.data?.error_description || "Login Failed!",
            );
            setTimeout(closeToast, 5000);
            setDisable(false);
            setLoginLoader(false);
          });
      }
    }

  }, [user, disable, stateInfo, loginLoader, showToast]);

  /* Post-login redirect and user setup */
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
    if (
      user?.info?.roles &&
      user?.info?.roles?.every((e) => e.code === "NATADMIN")
    ) {
      redirectPath = `/${window?.contextPath}/employee/dss/landing/NURT_DASHBOARD`;
    }

    /*  RAIN-6489 Logic to navigate to National DSS home incase user has only one role [NATADMIN]*/
    if (
      user?.info?.roles &&
      user?.info?.roles?.every((e) => e.code === "STADMIN")
    ) {
      redirectPath = `/${window?.contextPath}/employee/dss/landing/home`;
    }

    navigate(redirectPath, { replace: true });
  }, [user]);

  /* Generic Token Exchange with DIGIT Backend */
  const handleDigitLogin = async (idToken, accessToken = null) => {
    setDisable(true);
    setLoginLoader(true);
    try {
      const response = await fetch("/user/oauth/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${
            window?.globalConfigs?.getConfig("JWT_TOKEN") ||
            "ZWdvdi11c2VyLWNsaWVudDo="
          }`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "jwt_exchange",
          scope: "read",
          userType: "EMPLOYEE",
          assertion: idToken,
          ...(accessToken && { access_token: accessToken }),
          tenantId: stateInfo?.code,
        }),
      });

      if (!response.ok) {
        const raw = await response.text();
        let parsed;
        try {
          parsed = raw ? JSON.parse(raw) : null;
        } catch (e) {
          parsed = null;
        }
        const message =
          parsed?.error_description ||
          parsed?.errorDescription ||
          parsed?.message ||
          parsed?.error ||
          raw ||
          "DIGIT Login Failed";
        throw new Error(message);
      }

      const data = await response.json();
      const { UserRequest: info, ...tokens } = data;

      Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
      setUser({ info, ...tokens });
    } catch (error) {
      console.error("DIGIT Login Error:", error);
      setShowToast(error?.message || "DIGIT Login Failed");
      setTimeout(closeToast, 5000);


      // If token exchange fails, force Microsoft to prompt credentials on next SSO click.
      try {
        window.sessionStorage.setItem("sso.force.prompt.login", "true");
      } catch (e) {
        // no-op
      }

      // Prevent retry loop: clear `id_token`/`code` from URL (stay on same page).
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        // no-op
      }
    }
    setDisable(false);
    setLoginLoader(false);
  };

  const buildOIDCAuthorizeUrl = (uiConfig) => {
    const {
      authorizeUrl,
      clientId,
      scopes = ["openid", "profile", "email"],
      responseType = "id_token",
      responseMode = "fragment",
      nonceRequired = true,
      redirectPath = "employee/user/login",
      resource,
      provider,
    } = uiConfig || {};

    if (!authorizeUrl || !clientId) {
      throw new Error("Missing authorizeUrl or clientId for OIDC login");
    }

    const nonce = nonceRequired
      ? Math.random().toString(36).substring(2)
      : undefined;
    const redirectUri = `${window.location.origin}/${window?.contextPath}/${redirectPath}`;

    const params = new URLSearchParams();
    params.set("client_id", clientId);
    params.set("response_type", responseType);
    params.set("redirect_uri", redirectUri);
    if (nonce) params.set("nonce", nonce);
    if (responseMode) params.set("response_mode", responseMode);
    if (scopes && scopes.length) params.set("scope", scopes.join(" "));
    if (resource) params.set("resource", resource);

    // One-time forced login prompt (mainly for Microsoft) after a failed exchange.
    try {
      const forcePromptLogin = window.sessionStorage.getItem("sso.force.prompt.login") === "true";
      if (forcePromptLogin && provider === "MICROSOFT") {
        params.set("prompt", "login");
        window.sessionStorage.removeItem("sso.force.prompt.login");
      }
    } catch (e) {
      // no-op
    }

    return `${authorizeUrl}?${params.toString()}`;
  };

  const onSSOLogin = async (ssoConfig) => {
    // For OIDC-like providers (MICROSOFT, GOOGLE, etc.), use generic OIDC login
    const ui = ssoConfig?.ui || {};
    const hasOidcConfig = Boolean((ui.authorizeUrl || ssoConfig?.authorizeUrl) && ui.clientId);

    if (ui.authStrategy === "OIDC_POPUP" || ui.provider === "MICROSOFT" || hasOidcConfig) {
      return onOIDCLogin(ssoConfig);
    }

    // If the config doesn't match any known SSO strategy, don't leave the overlay loader stuck.
    setShowToast("SSO configuration is invalid or unsupported");
    setTimeout(closeToast, 5000);
  };

  const onOIDCLogin = async (ssoConfig) => {
    try {
      const ui = { ...(ssoConfig?.ui || {}) };
      // Backward-compatibility for older configs where authorizeUrl/resource
      // might be on the top level instead of inside ui.
      ui.authorizeUrl = ui.authorizeUrl || ssoConfig?.authorizeUrl;
      ui.resource = ui.resource || ssoConfig?.resource;
      // For Microsoft, if resource is not explicitly provided, default it to clientId (v1 behavior).
      if (ui.provider === "MICROSOFT" && !ui.resource) {
        ui.resource = ui.clientId;
      }
      // Persist provider + logout-relevant info for later use during logout
      if (ui.provider) {
        localStorage.setItem("sso-provider", ui.provider);
      }
      if (ui.logoutUrl) {
        localStorage.setItem("sso-logout-url", ui.logoutUrl);
      }
      if (ui.tenantId) {
        localStorage.setItem("sso-tenant-id", ui.tenantId);
      }
      if (ui.authority) {
        localStorage.setItem("sso-authority", ui.authority);
      }
      const url = buildOIDCAuthorizeUrl(ui);
      // Simple implementation: redirect for OIDC if no library is present
      // For a better experience, a popup and message bridge should be used
      window.location.href = url;
    } catch (error) {
      console.error("OIDC Login Error:", error);
      setShowToast(error.message || "OIDC Login Failed");
      setTimeout(closeToast, 5000);
      setLoginLoader(false);
    }
  };

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
    setLoginLoader(true);
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
    setLoginLoader(false);
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
            error?.response?.data?.Errors?.[0].code
              ? `SANDBOX_RESEND_OTP${error?.response?.data?.Errors?.[0]?.code}`
              : `SANDBOX_RESEND_OTP_ERROR`,
          );
          setTimeout(closeToast, 5000);
        },
        onSuccess: async (data) => {
          navigate(`/${window?.contextPath}/employee/user/login/otp`, {
            state: {
              email: inputEmail,
              tenant: Digit?.ULBService?.getStateId(),
            },
          });
        },
      },
    );
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onForgotPassword = () => {
    navigate(`/${window?.contextPath}/employee/user/forgot-password`);
  };
  const defaultTenant = Digit.ULBService.getStateId();

  const defaultValue = {
    code: defaultTenant,
    name: Digit.Utils.locale.getTransformedLocale(
      `TENANT_TENANTS_${defaultTenant}`,
    ),
  };

  let config = [{ body: propsConfig?.inputs }];

  const { mode } = Digit.Hooks.useQueryParams();
  if (
    mode === "admin" &&
    config?.[0]?.body?.[2]?.disable == false &&
    config?.[0]?.body?.[2]?.populators?.defaultValue == undefined
  ) {
    config[0].body[2].disable = true;
    config[0].body[2].isMandatory = false;
    config[0].body[2].populators.defaultValue = defaultValue;
  }

  const defaultValues = useMemo(
    () =>
      Object.fromEntries(
        config[0].body
          .filter(
            (field) =>
              field?.populators?.defaultValue && field?.populators?.name,
          )
          .map((field) => [
            field.populators.name,
            field.populators.defaultValue,
          ]),
      ),
    [],
  );

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
      ssoConfigs={ssoConfigs}
      loginWithMicroSoft={
        (!ssoConfigs || ssoConfigs.length === 0) &&
        window?.globalConfigs?.getConfig?.("ENABLE_MICROSOFT_LOGIN")
          ? propsConfig.texts.loginWithMicroSoft
          : null
      }
      onSSOLogin={onSSOLogin}
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

  const ssoConfigs = ssoMDMSData?.map((sso) => ({
    ...sso,
    provider: sso.ui?.provider || sso.provider || "sso",
    label: t(`SSO_PROVIDER_${sso.ui?.name || sso.id}`),
    icon: sso.ui?.logo ? (
      <img
        src={sso.ui.logo}
        alt={sso.ui?.name}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    ) : sso.ui?.provider === "MICROSOFT" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 21 21"
      >
        <title>MS-SymbolLockup</title>
        <rect x="1" y="1" width="9" height="9" fill="#f25022" />
        <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
        <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
        <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
      </svg>
    ) : null,
    onLogin: (ssoConfig) => {
      onSSOLogin(ssoConfig);
    },
  }));

  if (isLoading || isStoreLoading) {
    return <Loader page={true} variant="PageLoader" />;
  }
  return propsConfig?.bannerImages ? (
    <div className="login-container">
      {/* <SkipToMainContent class_name={".login-form-container"}/> */}
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
      {loginLoader && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}
      <div className="employeeBackbuttonAlign">
        <BackLink onClick={() => window.history.back()} />
      </div>
      {renderLoginForm(
        "loginFormStyleEmployee",
        "loginCardClassName",
        loginOTPBased ? "sandbox-onboarding-wrapper" : "",
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

export default withAutoFocusMain(Login, ".login-form-container");
