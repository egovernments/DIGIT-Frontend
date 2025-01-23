import React, { useEffect, useState } from "react";
import { Card } from "@egovernments/digit-ui-components";
import { Button } from "@egovernments/digit-ui-components";
import jwt_decode from "jwt-decode"; // Ensure this is installed: npm install jwt-decode
import { useKeycloak } from "../../../context/Keycloakprovider";
import { useHistory } from "react-router-dom";

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

const SuccessPage = () => {
  const { keycloak } = useKeycloak();
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // To store user API response
  const isLogin =false;

  // Extract username from the token
  useEffect(() => {
    if (keycloak.token) {
      const decodedToken = jwt_decode(keycloak.token);
      setUsername(decodedToken?.preferred_username || "Unknown User");
    }
  }, [keycloak.token]);

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    const filteredRoles = user?.info?.roles?.filter((role) => role.tenantId === Digit.SessionStorage.get("Employee.tenantId"));
    if (user?.info?.roles?.length > 0) user.info.roles = filteredRoles;
    Digit.UserService.setUser(user);
    setEmployeeDetail(user?.info, user?.access_token);
    // let redirectPath = `/${window?.globalPath}/user/setup`;
    let redirectPath = `/${window?.contextPath}/employee`;


  //   const getRedirectPathOtpLogin = (locationPathname, user, MdmsRes, RoleLandingUrl) => {
  //     const userRole = user?.info?.roles?.[0]?.code;
  //     const isSuperUser = userRole === "SUPERUSER";
  //     const contextPath = window?.contextPath;
  
  //     switch (true) {
  //         case locationPathname === "/sandbox-ui/user/otp" && isSuperUser:
  //             return `/${contextPath}/employee/user/landing`;
  
  //         case isSuperUser && MdmsRes?.[0]?.rolesForLandingPage?.includes("SUPERUSER"):
  //             return `/${contextPath}${RoleLandingUrl}`;
  
  //         default:
  //             return `/${contextPath}/employee`;
  //     }
  // };
  
  // // Usage
  // const redirectPathOtpLogin = getRedirectPathOtpLogin(location.pathname, user, MdmsRes, RoleLandingUrl);


    if (isLogin) {
      history.push(redirectPathOtpLogin);
      return;
    } else {
      history.push({
        pathname: redirectPath,
        state: { tenant: "SDFG" },
      });
      return;
    }
  }, [user]);

  // Fetch user details using the username and token
  const fetchUserDetails = async () => {
    if (!username || !keycloak.token) {
      console.error("Username or access token not available!");
      return;
    }

    const url = `http://localhost:8081/admin/realms/2fa/users?username=${username}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${keycloak.token}`, // Pass the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("User Details API Response:", data);
      setUserDetails(data); // Store the response
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // const redirectToHome = () => {
  //    console.log("token",keycloak.token)
  //    try {
  //     // const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
  //     // // console.log("UserRequest", info);
  //     // console.log("info",info);
  //     // console.log("tokens",tokens)
  //     let info = {
  //       "id": 39509,
  //       "uuid": "fafdb4f8-4aa0-4325-9283-3299e35d4910",
  //       "userName": "tenant123@gmail.com",
  //       "name": "sdfg",
  //       "mobileNumber": "9999999999",
  //       "emailId": "tenant123@gmail.com",
  //       "locale": null,
  //       "type": "EMPLOYEE",
  //       "roles": [
  //           {
  //               "name": "Super User",
  //               "code": "SUPERUSER",
  //               "tenantId": "SDFG"
  //           }
  //       ],
  //       "active": true,
  //       "tenantId": "SDFG",
  //       "permanentCity": null
  //   }

    
  //   let tokens = {
  //     "access_token": "af2d65de-0b24-44b5-8f97-fbdbb3656e35",
  //     "token_type": "bearer",
  //     "refresh_token": "70584cad-b3a7-4fe8-b091-c1f322f570c8",
  //     "expires_in": 596251,
  //     "scope": "read",
  //     "ResponseInfo": {
  //         "api_id": "",
  //         "ver": "",
  //         "ts": "",
  //         "res_msg_id": "",
  //         "msg_id": "",
  //         "status": "Access Token generated successfully"
  //     }
  // }

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
  // };

  const redirectToHome = () => {
  if (!userDetails || userDetails.length === 0 || !keycloak.token || !keycloak.refreshToken) {
    console.error("User details or Keycloak tokens are not available!");
    return;
  }

  try {
    const userDetail = userDetails[0]; // Assuming userDetails is an array, get the first user
    const info = {
      id: 35089,
      uuid: userDetail.id, // Use appropriate mapping for UUID if available in userDetails
      userName: userDetail.username,
      name: `${userDetail.firstName} ${userDetail.lastName}`, // Combine first and last name
      mobileNumber: userDetail.attributes.mobileNumber?.[0] || "N/A", // Use mobile number if available
      emailId: userDetail.email,
      locale: null,
      type: "EMPLOYEE",
      roles: [
        {
          name: "Super User", // Update role details if dynamic role mapping is needed
          code: "SUPERUSER",
          tenantId: "SDFG",
        },
      ],
      active: true,
      tenantId: "SDFG",
      permanentCity: null,
    };

    const tokens = {
      access_token: keycloak.token, // Get access token from Keycloak
      refresh_token: keycloak.refreshToken, // Get refresh token from Keycloak
      expires_in: keycloak.tokenParsed.exp - Math.floor(Date.now() / 1000), // Calculate remaining expiry time in seconds
      scope: "read",
      ResponseInfo: {
        api_id: "",
        ver: "",
        ts: "",
        res_msg_id: "",
        msg_id: "",
        status: "Access Token generated successfully",
      },
    };

    Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
    setUser({ info, ...tokens });
  } catch (err) {
    console.error("Error setting user details:", err);
  }
};


  return (
    <div className="SuccessPage">
      <h1>Login Successful!</h1>
      <p>Your Username: <strong>{username}</strong></p>
      <p>Your Access Token:</p>
      <Card>
        <p style={{ wordBreak: "break-all" }}>{keycloak.token || "No token available"}</p>
      </Card>
      <div style={{ marginTop: "16px" }}>
        <Button
          label="Fetch User Details"
          onClick={fetchUserDetails} // Fetch user details on click
          className="primary-btn"
        />
      </div>
      {userDetails && (
        <Card style={{ marginTop: "16px" }}>
          <h2>User Details:</h2>
          <pre>{JSON.stringify(userDetails, null, 2)}</pre>
        </Card>
      )}
      <div style={{ marginTop: "16px" }}>
        <Button
          label="Go to Homepage"
          onClick={redirectToHome}
          className="primary-btn"
        />
      </div>
    </div>
  );
};

export default SuccessPage;
