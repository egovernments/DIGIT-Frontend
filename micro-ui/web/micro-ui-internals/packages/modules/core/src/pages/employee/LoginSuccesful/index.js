import React, { useEffect, useState } from "react";
import { Card } from "@egovernments/digit-ui-components";
import { Button } from "@egovernments/digit-ui-components";
import jwt_decode from "jwt-decode"; // Ensure this is installed: npm install jwt-decode
import { useKeycloak } from "../../../context/Keycloakprovider";
import { useHistory } from "react-router-dom";

const setEmployeeDetail = (userObject, token) => {
  // if (Digit.Utils.getMultiRootTenant()) {
  //   return;
  // }
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
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const { stateInfo } = storeData || {};
  const tenantId = stateInfo?.code;
  // const [userDetails, setUserDetails] = useState(null); // To store user API response
  const isLogin =false;
  const [newToken, setNewToken] = useState(null);

  // Extract username from the token
  // useEffect(() => {
  //   if (keycloak.token) {
  //     const decodedToken = jwt_decode(keycloak.token);
  //     setUsername(decodedToken?.preferred_username || "Unknown User");
  //     fetchUserDetails();
  //   }
  // }, [keycloak.token]);

  useEffect(() => {
    if (keycloak.token ) {
      const decodedToken = jwt_decode(keycloak.token);
      setUsername(decodedToken?.preferred_username || "Unknown User");
    }
  }, [keycloak.token, tenantId]); 
  
  useEffect(() => {
    if (keycloak.token ) {
      fetchnewttoken();
    }
  }, [keycloak.token,tenantId]);// This depends on keycloak.token
  
  // useEffect(() => {
  //   if (username !== "Unknown User") {
  //     fetchUserDetails(); // This depends on the username being set
  //   }
  // }, [username]); 

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

  const fetchnewttoken = async () => {
    if ( !keycloak.token ) {
      console.error("Username or access token not available!");
      return;
    }

    const url = `https://digit-lts.digit.org/keycloak-test/realms/${tenantId}/protocol/openid-connect/token`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${keycloak.token}`, // Pass the token in the Authorization header
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
          audience: "auth-server",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response of new token :", data);
      setNewToken(data); // Set the new access token from the response
      localStorage.setItem("newAccessToken", data?.access_token); // Store the new token in localStorage
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };


  // Fetch user details using the username and token
  // const fetchUserDetails = async () => {
  //   if (!username || !keycloak.token) {
  //     console.error("Username or access token not available!");
  //     return;
  //   }

  //   const url = `http://localhost:8081/admin/realms/SDFG/users?username=${username}`;
  //   try {
  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${keycloak.token}`, // Pass the token in the Authorization header
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     console.log("User Details API Response:", data);
  //     setUserDetails(data); // Store the response
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //   }
  // };

  const redirectToHome = () => {
  if ( !newToken) {
    console.error("User details or Keycloak tokens are not available!");
    return;
  }

  try {
    const decodedToken = jwt_decode(newToken.access_token);
      const info = {
        uuid: decodedToken.sub,
        userName: decodedToken.preferred_username,
        name: decodedToken.name || "N/A",
        emailId: decodedToken.email || "N/A",
          roles: [
        {
          name: "Super User", // Update role details if dynamic role mapping is needed
          code: "SUPERUSER",
          tenantId: "SDFG",
        },
      ],
        // roles: decodedToken.realm_access?.roles.map((role) => ({
        //   name: role,
        //   code: role.toUpperCase(),
        //   tenantId: "SDFG",
        // })) || [],
        active: true,
        tenantId: "SDFG",
      };
    // const userDetail = userDetails[0]; // Assuming userDetails is an array, get the first user
    // const info = {
    //   id: 35089,
    //   uuid: userDetail.id, // Use appropriate mapping for UUID if available in userDetails
    //   userName: userDetail.username,
    //   name: `${userDetail.firstName} ${userDetail.lastName}`, // Combine first and last name
    //   mobileNumber: userDetail.attributes.mobileNumber?.[0] || "N/A", // Use mobile number if available
    //   emailId: userDetail.email,
    //   locale: null,
    //   type: "EMPLOYEE",
    //   roles: [
    //     {
    //       name: "Super User", // Update role details if dynamic role mapping is needed
    //       code: "SUPERUSER",
    //       tenantId: "SDFG",
    //     },
    //   ],
    //   active: true,
    //   tenantId: "SDFG",
    //   permanentCity: null,
    // };
    console.log("token check",newToken.expires_in)
    const tokens = {
      access_token: newToken.access_token, // Get access token from Keycloak
      refresh_token: newToken.refresh_token, // Get refresh token from Keycloak
      expires_in: newToken.expires_in, // Calculate remaining expiry time in seconds
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
      {/* <div style={{ marginTop: "16px" }}>
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
      )} */}
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
