import { AppContainer, BackLink, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"; // Updated imports for v6
import { loginSteps } from "./config";
import SelectMobileNumber from "./SelectMobileNumber";
import SelectName from "./SelectName";
import SelectOtp from "./SelectOtp";

const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
const DEFAULT_USER = "digit-user"; // This variable is unused, consider removing
const DEFAULT_REDIRECT_URL = `/${window?.contextPath}/citizen`;

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

const Login = ({ stateCode, isUserRegistered = true }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate(); // Replaced useHistory with useNavigate
  // useRouteMatch is removed in v6. Path matching is handled by Routes/Route.
  // `path` and `url` were used for constructing sub-routes. In v6, paths are often relative.
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [tokens, setTokens] = useState(null); // This variable is unused, consider removing
  const [params, setParams] = useState(isUserRegistered ? {} : location?.state?.data); // Renamed setParmas to setParams for consistency
  const [errorTO, setErrorTO] = useState(null);
  const searchParams = Digit.Hooks.useQueryParams();
  const [canSubmitName, setCanSubmitName] = useState(false);
  const [canSubmitOtp, setCanSubmitOtp] = useState(true);
  const [canSubmitNo, setCanSubmitNo] = useState(true);

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
        { state: { redirectBackTo: redirectPath }, replace: true } // `replace: true` for history.replace
      );
    } else {
      navigate(redirectPath, { replace: true }); // `replace: true` for history.replace
    }
  }, [user]);

  const stepItems = useMemo(
    () =>
      loginSteps.map((step) => {
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

  const selectMobileNumber = async (mobileNumber) => {
    setCanSubmitNo(false);
    setParams({ ...params, ...mobileNumber });
    const data = {
      ...mobileNumber,
      tenantId: stateCode,
      userType: getUserType(),
    };
    if (isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
      if (!err) {
        setCanSubmitNo(true);
        // Use relative path for navigation, `.` means current base path
        navigate(`otp`, { state: { from: getFromLocation(location.state, searchParams), role: location.state?.role }, replace: true });
        return;
      } else {
        setCanSubmitNo(true);
        if (!(location.state && location.state.role === "FSM_DSO")) {
          // Use absolute path if navigating outside the current route's scope, or relative if it's a sibling route
          navigate(`/${window?.contextPath}/citizen/register/name`, { state: { from: getFromLocation(location.state, searchParams), data: data } });
        }
      }
      if (location.state?.role) {
        setCanSubmitNo(true);
        setError(location.state?.role === "FSM_DSO" ? t("ES_ERROR_DSO_LOGIN") : "User not registered.");
      }
    } else {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
      if (!err) {
        setCanSubmitNo(true);
        navigate(`otp`, { state: { from: getFromLocation(location.state, searchParams) }, replace: true });
        return;
      }
      setCanSubmitNo(true);
    }
  };

  const selectName = async (name) => {
    const data = {
      ...params,
      tenantId: stateCode,
      userType: getUserType(),
      ...name,
    };
    setParams({ ...params, ...name });
    setCanSubmitName(true);
    const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
    if (res) {
      setCanSubmitName(false);
      navigate(`otp`, { state: { from: getFromLocation(location.state, searchParams) }, replace: true });
    } else {
      setCanSubmitName(false);
    }
  };

  const selectOtp = async () => {
    try {
      setIsOtpValid(true);
      setCanSubmitOtp(false);
      const { mobileNumber, otp, name } = params;
      if (isUserRegistered) {
        const requestData = {
          username: mobileNumber,
          password: otp,
          tenantId: stateCode,
          userType: getUserType(),
        };
        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);

        if (location.state?.role) {
          const roleInfo = info.roles.find((userRole) => userRole.code === location.state.role);
          if (!roleInfo || !roleInfo.code) {
            setError(t("ES_ERROR_USER_NOT_PERMITTED"));
            // navigate also handles timeouts for redirects
            setTimeout(() => navigate(DEFAULT_REDIRECT_URL, { replace: true }), 5000);
            return;
          }
        }
        if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
          info.tenantId = Digit.ULBService.getStateId();
        }

        setUser({ info, ...tokens });
      } else if (!isUserRegistered) {
        const requestData = {
          name,
          username: mobileNumber,
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
    }
  };

  const resendOtp = async () => {
    const { mobileNumber } = params;
    const data = {
      mobileNumber,
      tenantId: stateCode,
      userType: getUserType(),
    };
    if (!isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
    } else if (isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
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
        {/* BackLink now uses navigate(-1) for going back */}
        {location.pathname.includes("login") ? null : <BackLink onClick={() => navigate(-1)} />}
        <Routes> {/* Replaced Switch with Routes */}
          {/* Route path is now relative to the parent <Routes> */}
          <Route
            path="/" // This will match the base path where this component is rendered (e.g., /citizen/login if mounted there)
            element={
              <SelectMobileNumber
                onSelect={selectMobileNumber}
                config={stepItems[0]}
                mobileNumber={params.mobileNumber || ""}
                onMobileChange={handleMobileChange}
                canSubmit={canSubmitNo}
                showRegisterLink={isUserRegistered && !location.state?.role}
                t={t}
              />
            }
          />
          <Route
            path="otp" // This will match /path/to/current/route/otp
            element={
              <SelectOtp
                config={{ ...stepItems[1], texts: { ...stepItems[1].texts, cardText: `${stepItems[1].texts.cardText} ${params.mobileNumber || ""}` } }}
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
            path="name" // This will match /path/to/current/route/name
            element={<SelectName config={stepItems[2]} onSelect={selectName} t={t} isDisabled={canSubmitName} />}
          />
          {error && <Toast type={"error"} label={error} onClose={() => setError(null)} />}
        </Routes>
      </AppContainer>
    </div>
  );
};

export default Login;