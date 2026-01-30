import { AppContainer, BackLink, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { loginSteps } from "./config";
import SelectMobileNumber from "./SelectMobileNumber";
import SelectName from "./SelectName";
import SelectOtp from "./SelectOtp";

const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
const DEFAULT_USER = "digit-user";
let DEFAULT_REDIRECT_URL = `/${window?.contextPath || window?.globalConfigs?.getConfig("CONTEXT_PATH")}/citizen`;

/* set citizen details to enable backward compatible */
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

const IndividualLogin = ({ stateCode, isUserRegistered = true }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [params, setParams] = useState(isUserRegistered ? {} : location?.state?.data);
  const [errorTO, setErrorTO] = useState(null);
  const searchParams = Digit.Hooks.useQueryParams();
  const [canSubmitName, setCanSubmitName] = useState(false);
  const [canSubmitOtp, setCanSubmitOtp] = useState(true);
  const [canSubmitNo, setCanSubmitNo] = useState(true);

  const individualServicePath = window?.globalConfigs?.getConfig("INDIVIDUAL_SERVICE_CONTEXT_PATH");

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
    if (!Digit.ULBService.getCitizenCurrentTenant(true)) {
      navigate(
        `/${window?.contextPath}/citizen/select-location`,
        { state: { redirectBackTo: redirectPath }, replace: true }
      );
    } else {
      navigate(redirectPath, { replace: true });
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
    setParams({ ...params, otp });
  };

  const handleMobileChange = (event) => {
    const { value } = event.target;
    setParams({ ...params, mobileNumber: value });
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setParams({ ...params, userName: value });
  };

  const selectMobileNumber = async (mobileNumber) => {
    setCanSubmitNo(false);
    setParams({ ...params, ...mobileNumber });
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
        navigate(`otp`, { 
          state: { 
            from: getFromLocation(location.state, searchParams) 
          }, 
          replace: true 
        });
        return;
      } else {
        setCanSubmitNo(true);
        setError(t("USER_NOT_REGISTERED") || "User not registered.");
      }
    } else {
      // REGISTER FLOW: Go directly to name screen (no OTP needed yet)
      setCanSubmitNo(true);
      navigate(`name`, {
        state: {
          from: getFromLocation(location.state, searchParams),
          data: data
        },
        replace: true
      });
    }
  };

  const selectName = async (name) => {
    setCanSubmitName(true);

    const userData = {
      ...params,
      ...name,
    };

    setParams(userData);

    // Call the Individual service registration API
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
      navigate(`otp`, {
        state: {
          from: getFromLocation(location.state, searchParams)
        },
        replace: true
      });

    } catch (err) {
      console.error("Registration error:", err);
      setCanSubmitName(false);
      setError(t("REGISTRATION_FAILED") || "Registration failed. Please try again.");
    }
  };

  const selectOtp = async () => {
    try {
      setIsOtpValid(true);
      setCanSubmitOtp(false);
      const { mobileNumber, otp, userName } = params;

      // Authenticate with OTP
      const requestData = {
        username: mobileNumber || userName,
        password: otp,
        tenantId: stateCode,
        userType: getUserType(),
      };

      const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);

      if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
        info.tenantId = Digit.ULBService.getStateId();
      }

      setUser({ info, ...tokens });

    } catch (err) {
      setCanSubmitOtp(true);
      setIsOtpValid(false);
      setError(t("INVALID_OTP") || "Invalid OTP");
    }
  };

  const resendOtp = async () => {
    if (!isUserRegistered) {
      // For registration flow, user needs to complete registration first
      setError(t("PLEASE_COMPLETE_REGISTRATION") || "Please enter the OTP sent during registration.");
    } else {
      // For login flow, resend OTP
      const { mobileNumber, userName } = params;
      const data = {
        mobileNumber,
        userName,
        tenantId: stateCode,
        userType: getUserType(),
      };
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
      <AppContainer>
        {location.pathname.includes("login") ? null : <BackLink onClick={() => window.history.back()} />}
        <Routes>
          <Route
            path="/" 
            element={
              <SelectMobileNumber
                onSelect={selectMobileNumber}
                config={stepItems[0]}
                mobileNumber={params.mobileNumber || ""}
                emailId={params.userName || ""}
                onMobileChange={handleMobileChange}
                onEmailChange={handleEmailChange}
                canSubmit={canSubmitNo}
                showRegisterLink={isUserRegistered}
                t={t}
              />
            } 
          />
          <Route 
            path="otp" 
            element={
              <SelectOtp
                config={{ 
                  ...stepItems[1], 
                  texts: { 
                    ...stepItems[1].texts, 
                    cardText: `${stepItems[1].texts.cardText} ${params.mobileNumber || params.userName || ""}` 
                  } 
                }}
                onOtpChange={handleOtpChange}
                onResend={resendOtp}
                onSelect={selectOtp}
                otp={params.otp}
                error={isOtpValid}
                canSubmit={canSubmitOtp}
                t={t}
              />
            } 
          />
          <Route 
            path="name" 
            element={
              <SelectName 
                config={stepItems[2]} 
                onSelect={selectName} 
                t={t} 
                isDisabled={canSubmitName} 
              />
            } 
          />
        </Routes>
        {error && <Toast type={"error"} label={error} onClose={() => setError(null)} />}
      </AppContainer>
    </div>
  );
};

export default IndividualLogin;