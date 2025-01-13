import { Button, Card, Loader } from "@egovernments/digit-ui-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Background from "../../../components/Background";
import keycloak from "./keycloak";

const LanguageSelection = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { t } = useTranslation();
  const { stateInfo } = storeData || {};

  useEffect(() => {
    // If the user is already authenticated, redirect them to the success page
    if (keycloak.authenticated) {
      window.location.href = "http://localhost:3000/sandbox-ui/A/employee/user/success";
    }
  }, []);

  // Function to call the Keycloak API and trigger login
  const handleLogin = async () => {
    try {
      if (!keycloak.authenticated) {
        // Trigger login if the user is not authenticated
        await keycloak.login({
          redirectUri: "http://localhost:3000/sandbox-ui/A/employee/user/success", // Redirect after login
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
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
