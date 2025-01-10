import React from "react";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import { Card, Button } from "@egovernments/digit-ui-components";

const LoginSuccessPage = ({ token }) => {
  const history = useHistory();

  const handleProceed = () => {
    // Redirect to the employee dashboard or any other page
    history.push(`/${window?.contextPath}/employee/user/language-selection`);
  };

  return (
    <Background>
      <Card className={"bannerCard removeBottomMargin languageSelection"}>
        <div className="bannerHeader">
          <img className="bannerLogo" src={window?.globalConfigs?.getConfig?.("STATE_LOGO_URL")} alt="Digit" />
          <p>Login Successful</p>
        </div>
        <div className="button-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
          <p>You have been successfully logged in!</p>
          {token && (
            <div style={{ wordBreak: "break-word", marginTop: "20px", textAlign: "center" }}>
              <strong>JWT Token:</strong>
              <p>{token}</p>
            </div>
          )}
          <Button
            label="Go to login method screen"
            onClick={handleProceed}
            style={{ marginTop: "30px" }}
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
