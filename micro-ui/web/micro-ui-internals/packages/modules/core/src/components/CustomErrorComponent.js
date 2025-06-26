import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Background from "./Background";
import { Button, Card, CardHeader, CardText } from "@egovernments/digit-ui-components";
import Header from "./Header";

const CustomErrorComponent = (props) => {
  const { state = {} } = useLocation();
  // const module = state?.module;
  const { t } = useTranslation();
  const stateInfo = props.stateInfo;

  const navigate = useNavigate();
  const ModuleBasedErrorConfig = {
    sandbox: {
      imgUrl: `https://s3.ap-south-1.amazonaws.com/egov-qa-assets/error-image.png`,
      infoHeader: "WRONG_TENANT_SIGN_UP",
      infoMessage: "WRONG_TENANT_SIGN_UP_MESSAGE",
      buttonInfo: "WRONG_TENANT_SIGN_UP_BUTTON",
      action: () => {
        navigate(`/${window.globalPath}/`);
      },
    },
  };
  const config = ModuleBasedErrorConfig["sandbox"];

  return (
    <Background>
      <Card className={`digit-employee-card customError`}>
        <Header showTenant={false} />
        <CardHeader className={"center"}>{t(config.infoHeader)}</CardHeader>
        <CardText className={"center"}>{t(config.infoMessage)}</CardText>
        <Button
          className="customErrorButton"
          label={t(config?.buttonInfo)}
          variation={"primary"}
          isSuffix={true}
          onClick={(e) => {
            e.preventDefault();
            config?.action();
          }}
        />
      </Card>
    </Background>
  );
};

export default CustomErrorComponent;
