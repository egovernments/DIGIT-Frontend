import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Button, Card, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import Background from "../../../components/Background";
// import { useKeycloak } from "./KeycloakProvider";
import { useKeycloak } from "../../../context/Keycloakprovider";

const LanguageSelection = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { t } = useTranslation();
  const { stateInfo } = storeData || {};
  const { keycloak } = useKeycloak();
  const [infoMessage, setInfoMessage] = useState("");
  // const navigate = useNavigate();

  // useEffect(() => {
  //   // Redirect to success page if authenticated
  //   if (keycloak.authenticated) {
  //     navigate("/success");
  //   }
  // }, [keycloak, navigate]);

  console.log("language-sel",keycloak);

  const handleLogin = () => {
    keycloak.login({
      redirectUri: window.location.origin + "/workbench-ui/employee/user/success", // Redirect after login
    });
  };

  const handleShowAccessToken = () => {
    setInfoMessage(keycloak.token || "No token available");
  };

  if (isLoading) return <Loader />;

  return (
    <Background>
      <Card className={"bannerCard removeBottomMargin languageSelection"}>
        <div className="bannerHeader">
          <img className="bannerLogo" src={stateInfo?.logoUrl} alt="Digit" />
          <p>{t(`TENANT_TENANTS_${stateInfo?.code?.toUpperCase()}`)}</p>
        </div>
        <div className="button-container" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <Button label="Login by password" onClick={handleLogin} />
          <Button label="Show Access Token" onClick={handleShowAccessToken} />
          <Card>
            <p>{infoMessage}</p>
          </Card>
        </div>
      </Card>
    </Background>
  );
};

export default LanguageSelection;
