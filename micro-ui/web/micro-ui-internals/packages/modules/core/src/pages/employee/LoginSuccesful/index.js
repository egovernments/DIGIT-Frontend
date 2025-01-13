import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import { Card, Button } from "@egovernments/digit-ui-components";

const LoginSuccessPage = () => {
  const [token, setToken] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      // Exchange the authorization code for a token
      exchangeAuthorizationCodeForToken(authorizationCode);
    }
  }, []);

  // Function to exchange authorization code for access token
  const exchangeAuthorizationCodeForToken = async (code) => {
    const clientId = "sandbox-ui-client";
    const clientSecret = "your-client-secret"; // If needed
    const redirectUri = "http://localhost:3000/sandbox-ui/A/employee/user/success";
    const tokenUrl = "http://localhost:8081/realms/2fa/protocol/openid-connect/token";

    const formData = new URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("redirect_uri", redirectUri);
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret); // Include only if client secret is required

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Token exchange failed");
      }

      const data = await response.json();
      setToken(data.access_token);
    } catch (error) {
      console.error("Error exchanging authorization code:", error);
    }
  };

  // Handle logout logic
  const handleLogout = () => {
    // Clear token from localStorage or sessionStorage if necessary
    localStorage.removeItem("keycloakToken");  // Example, modify based on your storage choice
  
    // Clear token state in React
    setToken(null);
  
    // Keycloak logout URL
    const logoutUrl = "http://localhost:8081/realms/2fa/protocol/openid-connect/logout";
  
    // The redirect URL you want the user to be sent to after logging out
    const redirectUri = "http://localhost:3000/sandbox-ui/A/employee/user/language-selection";
  
    // Make sure to encode the redirectUri
    const encodedRedirectUri = encodeURIComponent(redirectUri);
  
    // Redirect to Keycloak logout URL with the encoded redirect_uri
    window.location.href = `${logoutUrl}?redirect_uri=${encodedRedirectUri}`;
  };
  
  

  const handleProceed = () => {
    history.push(`/${window?.contextPath}/employee/user/language-selection`);
  };

  return (
    <Background>
      <Card className={"bannerCard removeBottomMargin languageSelection"}>
        <div className="bannerHeader">
          <img
            className="bannerLogo"
            src={window?.globalConfigs?.getConfig?.("STATE_LOGO_URL")}
            alt="Digit"
          />
          <p>Login Successful</p>
        </div>
        <div
          className="button-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <p>You have been successfully logged in!</p>
          {token && (
            <div
              style={{
                wordBreak: "break-word",
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              <strong>JWT Token:</strong>
              <p>{token}</p>
            </div>
          )}
          <Button
            label="Go to login method screen"
            onClick={handleProceed}
            style={{ marginTop: "30px" }}
          />
          {/* Logout Button */}
          <Button
            label="Logout"
            onClick={handleLogout}
            style={{ marginTop: "20px" }}
          />
        </div>
      </Card>
      <div className="EmployeeLoginFooter">
        <img
          alt="Powered by DIGIT"
          src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
          }}
        />
      </div>
    </Background>
  );
};

export default LoginSuccessPage;
