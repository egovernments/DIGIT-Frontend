import { AppContainer, BackLink, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { loginSteps } from "./config";
import SelectMobileNumber from "./SelectMobileNumber";
import SelectName from "./SelectName";
import SelectOtp from "./SelectOtp";

const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
const DEFAULT_USER = "digit-user";
let DEFAULT_REDIRECT_URL = `/${window?.contextPath || window?.globalConfigs?.getConfig("CONTEXT_PATH")}/citizen`;

/* set citizen details to enable backward compatiable */
const setCitizenDetail = (userObject, token, tenantId) => {
  if (Digit.Utils.getMultiRootTenant()) {
    return;
  }
  let locale = JSON.parse(sessionStorage.getItem("Digit.initData"))?.value?.selectedLanguage;
  localStorage.setItem("Citizen.tenant-id", tenantId);
  localStorage.setItem("tenant-id", tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem("Citizen.locale", locale);
  localStorage.setItem("token", token);
  localStorage.setItem("Citizen.token", token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
};

const getFromLocation = (state, searchParams) => {
  return state?.from || searchParams?.from || DEFAULT_REDIRECT_URL;
};

const Login = ({ stateCode, isUserRegistered = true }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [tokens, setTokens] = useState(null);
  const [params, setParmas] = useState(isUserRegistered ? {} : location?.state?.data);
  const [errorTO, setErrorTO] = useState(null);
  const searchParams = Digit.Hooks.useQueryParams();
  const [canSubmitName, setCanSubmitName] = useState(false);
  const [canSubmitOtp, setCanSubmitOtp] = useState(true);
  const [canSubmitNo, setCanSubmitNo] = useState(true);

  // Check if individual service context path is configured
  const individualServicePath = window?.globalConfigs?.getConfig("INDIVIDUAL_SERVICE_CONTEXT_PATH");

  const stateId = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  const moduleName = Digit?.Utils?.getConfigModuleName?.() || "commonUiConfig";
  const { data: validationConfig } = Digit.Hooks.useCustomMDMS(
    stateId,
    moduleName,
    [{ name: "UserValidation" }],
    {
      select: (data) => {
        const validationData = data?.[moduleName]?.UserValidation?.find((x) => x.fieldType === "mobile");
        const rules = validationData?.rules;
        const attributes = validationData?.attributes;
        return {
          prefix: attributes?.prefix,
          pattern: rules?.pattern,
          maxLength: rules?.maxLength,
          minLength: rules?.minLength,
        };
      },
      staleTime: 300000,
      enabled: !!stateId,
    }
  );

  useEffect(() => {
    let errorTimeout;
    if (error) {
      if (errorTO) {
        clearTimeout(errorTO);
        setErrorTO(null);
      }
      errorTimeout = setTimeout(() => {
        setError("");
      }, 5000);
      setErrorTO(errorTimeout);
    }
    return () => {
      errorTimeout && clearTimeout(errorTimeout);
    };
  }, [error]);

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    Digit.UserService.setUser(user);
    setCitizenDetail(user?.info, user?.access_token, stateCode);
    const redirectPath = location.state?.from || DEFAULT_REDIRECT_URL;
    if (!Digit.ULBService.getCitizenCurrentTenant()) {
      history.replace(`/${window?.contextPath}/citizen/select-location`, {
        redirectBackTo: redirectPath,
      });
    } else {
      history.replace(redirectPath);
    }
  }, [user]);

  const stepItems = useMemo(() =>
    loginSteps.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [loginSteps]
    )
  );

  const getUserType = () => "citizen" || Digit.UserService.getType();

  const handleOtpChange = (otp) => {
    setParmas({ ...params, otp });
  };

  const handleMobileChange = (event) => {
    const { value } = event.target;
    setParmas({ ...params, mobileNumber: value });
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setParmas({ ...params, userName: value });
  };

  const selectMobileNumber = async (mobileNumber) => {
    setCanSubmitNo(false);
    setParmas({ ...params, ...mobileNumber });
    const data = {
      ...mobileNumber,
      tenantId: stateCode,
      userType: getUserType(),
    };

    if (isUserRegistered) {
      // LOGIN FLOW: Send OTP
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
      if (!err) {
        setCanSubmitNo(true);
        history.replace(`${path}/otp`, {
          from: getFromLocation(location.state, searchParams),
          role: location.state?.role
        });
        return;
      } else {
        setCanSubmitNo(true);
        if (!(location.state && location.state.role === "FSM_DSO")) {
          history.push(`/${window?.contextPath}/citizen/register/name`, {
            from: getFromLocation(location.state, searchParams),
            data: data
          });
        }
      }
      if (location.state?.role) {
        setCanSubmitNo(true);
        setError(location.state?.role === "FSM_DSO" ? t("ES_ERROR_DSO_LOGIN") : "User not registered.");
      }
    } else {
      // REGISTER FLOW
      if (individualServicePath) {
        // NEW FLOW: Go directly to name screen
        setCanSubmitNo(true);
        history.replace(`${path}/name`, {
          from: getFromLocation(location.state, searchParams),
          data: data
        });
      } else {
        // OLD FLOW: Send OTP first
        const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
        if (!err) {
          setCanSubmitNo(true);
          history.replace(`${path}/otp`, {
            from: getFromLocation(location.state, searchParams)
          });
          return;
        }
        setCanSubmitNo(true);
      }
    }
  };

  const selectName = async (name) => {
    setCanSubmitName(true);

    const userData = {
      ...params,
      ...name,
    };

    setParmas(userData);

    if (!isUserRegistered && individualServicePath) {
      // NEW FLOW: Call the custom register API using Digit.CustomService
      const registerURL = `${individualServicePath}/v1/_register`;

      const requestData = {
        IndividualRegister: {
          tenantId: stateCode,
          name: userData.name,
          emailId: userData.userName || "",
          mobileNumber: userData.mobileNumber || "",
          requestType: "Register"
        }
      };

      try {
        const registerResponse = await Digit.CustomService.getResponse({
          url: registerURL,
          body: requestData,
          useCache: false,
          method: "POST",
          userService: false,
          auth: false,
          params: {}
        });

        if (!registerResponse) {
          throw new Error("Registration API failed");
        }

        setCanSubmitName(false);
        // After registration, go to OTP screen
        history.replace(`${path}/otp`, {
          from: getFromLocation(location.state, searchParams)
        });

      } catch (err) {
        console.error("Registration error:", err);
        setCanSubmitName(false);
        setError(t("REGISTRATION_FAILED") || "Registration failed. Please try again.");
      }
    } else {
      // OLD FLOW: Send OTP
      const data = {
        ...params,
        tenantId: stateCode,
        userType: getUserType(),
        ...name,
      };
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
      if (res) {
        setCanSubmitName(false);
        history.replace(`${path}/otp`, {
          from: getFromLocation(location.state, searchParams)
        });
      } else {
        setCanSubmitName(false);
      }
    }
  };

  const selectOtp = async () => {
    try {
      setIsOtpValid(true);
      setCanSubmitOtp(false);
      const { mobileNumber, otp, name, userName } = params;

      if (isUserRegistered || individualServicePath) {
        // LOGIN FLOW or NEW REGISTER FLOW: Authenticate with OTP
        const requestData = {
          username: mobileNumber || userName,
          password: otp,
          tenantId: stateCode,
          userType: getUserType(),
        };

        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);

        if (location.state?.role) {
          const roleInfo = info.roles.find((userRole) => userRole.code === location.state.role);
          if (!roleInfo || !roleInfo.code) {
            setError(t("ES_ERROR_USER_NOT_PERMITTED"));
            setTimeout(() => history.replace(DEFAULT_REDIRECT_URL), 5000);
            return;
          }
        }

        if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
          info.tenantId = Digit.ULBService.getStateId();
        }

        setUser({ info, ...tokens });
      } else {
        // OLD REGISTER FLOW: Register user with OTP
        const requestData = {
          name,
          username: mobileNumber || userName,
          otpReference: otp,
          tenantId: stateCode,
        };

        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.registerUser(requestData, stateCode);

        if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
          info.tenantId = Digit.ULBService.getStateId();
        }

        setUser({ info, ...tokens });
      }

    } catch (err) {
      setCanSubmitOtp(true);
      setIsOtpValid(false);
      setError(t("INVALID_OTP") || "Invalid OTP");
    }
  };

  const resendOtp = async () => {
    const { mobileNumber, userName } = params;
    const data = {
      mobileNumber,
      userName,
      tenantId: stateCode,
      userType: getUserType(),
    };

    if (!isUserRegistered && individualServicePath) {
      // NEW REGISTER FLOW: Cannot resend
      setError(t("PLEASE_COMPLETE_REGISTRATION") || "Please enter the OTP sent during registration.");
    } else if (!isUserRegistered) {
      // OLD REGISTER FLOW: Resend OTP
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
      if (err) {
        setError(t("OTP_RESEND_ERROR") || "Failed to resend OTP");
      }
    } else {
      // LOGIN FLOW: Resend OTP
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
      if (err) {
        setError(t("OTP_RESEND_ERROR") || "Failed to resend OTP");
      }
    }
  };

  const sendOtp = async (data) => {
    try {
      const res = await Digit.UserService.sendOtp(data, stateCode);
      return [res, null];
    } catch (err) {
      return [null, err];
    }
  };

  return (
    <div className="citizen-form-wrapper">
      <Switch>
        <AppContainer>
          {location.pathname.includes("login") ? null : <BackLink onClick={() => window.history.back()} />}
          <Route path={`${path}`} exact>
            <SelectMobileNumber
              onSelect={selectMobileNumber}
              config={stepItems[0]}
              mobileNumber={params.mobileNumber || ""}
              emailId={params.userName || ""}
              onMobileChange={handleMobileChange}
              onEmailChange={handleEmailChange}
              canSubmit={canSubmitNo}
              showRegisterLink={isUserRegistered && !location.state?.role}
              t={t}
              validationConfig={validationConfig}
            />
          </Route>
          <Route path={`${path}/otp`}>
            <SelectOtp
              config={{ ...stepItems[1], texts: { ...stepItems[1].texts, cardText: `${stepItems[1].texts.cardText} ${params.mobileNumber || params.userName || ""}` } }}
              onOtpChange={handleOtpChange}
              onResend={resendOtp}
              onSelect={selectOtp}
              otp={params.otp}
              error={isOtpValid}
              canSubmit={canSubmitOtp}
              t={t}
            />
          </Route>
          <Route path={`${path}/name`}>
            <SelectName config={stepItems[2]} onSelect={selectName} t={t} isDisabled={canSubmitName} />
          </Route>
          {error && <Toast type={"error"} label={error} onClose={() => setError(null)} />}
        </AppContainer>
      </Switch>
    </div>
  );
};

export default Login;