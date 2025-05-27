import React, { useEffect, useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";


const setEmployeeDetail = (userObject, token) => {
    let locale = JSON.parse(sessionStorage.getItem("Digit.locale"))?.value;
    localStorage.setItem("Employee[HPM] Error occurred while trying to proxy request /localization/messages/v1/_search?module=rainmaker-privacy-policy&locale=en_IN&_=1743502018537 from localhost:3000 to https://unified-qa.digit.org (ECONNRESET) (https://nodejs.org/api/errors.html#errors_common_system_errors).tenant-id", userObject?.tenantId);
    localStorage.setItem("tenant-id", userObject?.tenantId);
    localStorage.setItem("Employee.tenant-id", userObject?.tenantId);
    localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
    localStorage.setItem("locale", locale);
    localStorage.setItem("Employee.locale", locale);
    localStorage.setItem("token", token);
    localStorage.setItem("Employee.token", token);
    localStorage.setItem("user-info", JSON.stringify(userObject));
    localStorage.setItem("Employee.user-info", JSON.stringify(userObject));
  };
  
const AutoLogin = () => {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const history = useHistory();
  const [user, setUser] = useState(null);


  const queryParams = new URLSearchParams(location.search);
  const defaultCredentials = {
    username: queryParams.get("username"),
    password: queryParams.get("password"), 
    city: {
      code: queryParams.get("city"),
    },
    fromSandbox: queryParams.get("fromSandbox") || false
  };
  const redirectUrl = queryParams.get("redirectUrl") || "/sanitation-ui/employee"; 
  console.log(`*** LOG ***`,queryParams.get("redirectUrl"));
  useEffect(() => {
    if (!user) {
      return;
    }
    // Digit.SessionStorage.set("citizen.userRequestObject", user);
    const filteredRoles = user?.info?.roles?.filter((role) => role.tenantId === Digit.SessionStorage.get("Employee.tenantId"));
    if (user?.info?.roles?.length > 0) user.info.roles = filteredRoles;
    Digit.UserService.setUser(user);
    setEmployeeDetail(user?.info, user?.access_token);
    if(queryParams.get("redirectUrl")) 
      {
        window.location.href = redirectUrl;
      }
    else
    history.replace(redirectUrl);
  }, [user]);

  const handleAutoLogin = async () => {
    try {
      const requestData = {
        ...defaultCredentials,
        userType: "EMPLOYEE",
        tenantId: defaultCredentials.city.code,
      };
      delete requestData.city;
      const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
      Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
      Digit.SessionStorage.set("fromSandbox", defaultCredentials.fromSandbox);
      setUser({ info, ...tokens });

    } catch (err) {
      console.error("Auto-login failed:", err);
      setError(err.response?.data?.error_description || "Invalid login credentials");
    } finally {
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
