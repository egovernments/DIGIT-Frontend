import React, { useEffect } from "react";
import { Button, Card, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import Background from "../../../components/Background";
import UserService from "./keycloak";  // Importing the UserService

const LanguageSelection = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { t } = useTranslation();
  const { stateInfo } = storeData || {};

  useEffect(() => {
    // Initialize Keycloak and check if the user is authenticated
    UserService.initKeycloak(() => {
      if (UserService.isLoggedIn()) {
        window.location.href = "http://localhost:3000/sandbox-ui/A/employee/user/success";
      }
    });
  }, []);

  console.log("kjghh",UserService);

  const handleLogin = async () => {
    try {
      if (!UserService.isLoggedIn()) {
        // Trigger login if the user is not authenticated
        await UserService.doLogin({
          redirectUri: "http://localhost:3000/sandbox-ui/A/employee/user/success",
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
