import { Button, Card, Loader } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";

const LanguageSelection = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { t } = useTranslation();
  const history = useHistory();
  const { stateInfo } = storeData || {};

  // Function to call the Keycloak API and redirect
  const handleLogin = async (loginType) => {
    try {
      // console.log("LoginType being passed:", loginType);
      history.push({
        pathname: `/${window?.contextPath}/employee/user/login`,
        state: { loginMethod: loginType },
      });
    } catch (error) {
      console.error(`Error during ${loginType} login:`, error);
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
        <div className="button-container" style={{ display: "flex", justifyContent: "space-around", marginBottom: "24px" }}>
          <Button label="Login by password" onClick={() => handleLogin("direct")} />
          <Button label="MFA with sms" onClick={() => handleLogin("2fa")} />
          <Button label="Login by otp" onClick={() => handleLogin("otp")} />
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
        />{" "}
      </div>
    </Background>
  );
};

export default LanguageSelection;
