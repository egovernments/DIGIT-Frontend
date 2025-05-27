import React, { useEffect, useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";

const setCitizenDetail = (userObject, token, tenantId) => {
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

const AutoLogin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const history = useHistory();
  const location = useLocation();

  
  const DEFAULT_REDIRECT_URL = "/digit-ui/citizen";
  
  const queryParams = new URLSearchParams(location.search);
  const fromSandbox= queryParams.get("fromSandbox") || false


  const mobileNumber = queryParams.get("mobile");
  const otp = queryParams.get("otp") || "123456"; 
  const city = queryParams.get("city") || Digit.ULBService.getStateId();
  Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", city);
  const redirectUrl = queryParams.get("redirectUrl") || DEFAULT_REDIRECT_URL;
  

  useEffect(() => {
    if (!user) return;
    
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    Digit.UserService.setUser(user);
    setCitizenDetail(user?.info, user?.access_token, city);
    Digit.SessionStorage.set("fromSandbox", fromSandbox);  

    if (!Digit.ULBService.getCitizenCurrentTenant(true)) {
      history.replace("/digit-ui/citizen/select-location", {
        redirectBackTo: redirectUrl,
      });
    } else {
      history.replace(redirectUrl);
    }
  }, [user]);



  const handleAutoLogin = async () => {
    try {
      const requestData = {
        username: mobileNumber,
        password: otp, 
        tenantId: city,
        userType: "CITIZEN",
      };
      
      const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
      
      // Handle single instance config if applicable
      if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
        info.tenantId = Digit.ULBService.getStateId();
      }
      
      setUser({ info, ...tokens });
    } catch (err) {
      console.error("Auto-login failed:", err);
      setError(err.response?.data?.error_description || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAutoLogin();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <div>
          <h2>Login Failed</h2>
        </div>
      ) : null}
    </div>
  );
};

export default AutoLogin;
