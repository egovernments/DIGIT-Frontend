import React from "react";
import { Card } from "@egovernments/digit-ui-components";
import { Button } from "@egovernments/digit-ui-components";
// import { useKeycloak } from "../LanguageSelection/KeycloakProvider";
import { useKeycloak } from "../../../context/Keycloakprovider";
import { useHistory } from "react-router-dom";

const SuccessPage = () => {
  const { keycloak } = useKeycloak();
  const history = useHistory();

  console.log("succes page",keycloak);

  const redirectToHome = () => {
    history.push(`/${window?.contextPath}/employee/user/language-selection`); // Use history to navigate
  };

  return (
    <div className="SuccessPage">
      <h1>Login Successful!</h1>
      <p>Your Access Token:</p>
      <Card>
        <p style={{ wordBreak: "break-all" }}>{keycloak.token || "No token available"}</p>
      </Card>
      <div style={{ marginTop: "16px" }}>
        <Button
          label="Go to Homepage"
          onClick={redirectToHome} // Use history for navigation
          className="primary-btn"
        />
      </div>
    </div>
  );
};

export default SuccessPage;
