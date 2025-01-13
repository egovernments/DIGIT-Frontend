import { Button, Card, Loader } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Background from "../../../components/Background";

const LanguageSelection = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { t } = useTranslation();
  const { stateInfo } = storeData || [];
  const [loading, setLoading] = useState(false);

  // Function to trigger Keycloak login
  const handleLogin = () => {
    const clientId = "sandbox-ui-client";
    const realm = "2fa";
    const redirectUri = "http://localhost:3000/sandbox-ui/A/employee/user/success";
    const keycloakUrl = "http://localhost:8081/realms/2fa/protocol/openid-connect/auth";

    // Redirect to Keycloak login page with necessary params
    window.location.href = `${keycloakUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;
  };

  if (isLoading) return <Loader />;

  return (
    <Background>
      <Card className={"bannerCard removeBottomMargin languageSelection"}>
        <div className="bannerHeader">
          <img className="bannerLogo" src={stateInfo?.logoUrl} alt="Digit" />
          <p>{t(`TENANT_TENANTS_${stateInfo?.code?.toUpperCase()}`)}</p>
        </div>
        <div
          className="button-container"
          style={{ display: "flex", justifyContent: "space-around", marginBottom: "24px" }}
        >
          <Button label="Login by password" onClick={handleLogin} />
        </div>
      </Card>
    </Background>
  );
};

export default LanguageSelection;
