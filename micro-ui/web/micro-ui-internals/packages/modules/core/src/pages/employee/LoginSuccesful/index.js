import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import UserService from "../LanguageSelection/keycloak";  // Importing the UserService
import { Card, Button } from "@egovernments/digit-ui-components";

const LoginSuccessPage = () => {
  const [token, setToken] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // If the user is authenticated, get the token
    if (UserService.isLoggedIn()) {
      setToken(UserService.getToken());
    }
  }, []);
  console.log("teri",UserService)

  const handleLogout = () => {
    UserService.doLogout({
      redirectUri: "http://localhost:3000/sandbox-ui/A/employee/user/language-selection", // Redirect after logout
    });
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
              <p>{UserService.getToken}</p>
            </div>
          )}
          <Button
            label="Go to login method screen"
            onClick={handleProceed}
            style={{ marginTop: "30px" }}
          />
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
