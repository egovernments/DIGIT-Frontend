import React from "react";
import { BackLink, Button, Card, CardHeader, CardText, FieldV1, SVG } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory, useLocation } from "react-router-dom";
import Background from "../../../components/Background";

const ViewUrl = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { email , otp , tenantCode } = location.state || {};
  const history = useHistory();

  const onButtonClick = () => {
    history.push({
      pathname: `/${window?.contextPath}/employee`,
    });
  };

  return (
    <Background>
      <div className="employeeBackbuttonAlign">
        <BackLink />
      </div>
      <Card className="card-sandbox">
        <SVG.TickMark />
        <CardHeader className="cardHeader-sandbox">{t("SANDBOX_HEADER")}</CardHeader>
        <CardText  className="cardText-sandbox">
        {t("SAMDBOX_URL_SUB")}
        </CardText>
        <FieldV1
          className = "field-sandbox"
          withoutLabel={false}
          label={t("SANDBOX_URL")}
          type="text"
          nonEditable={true}
          value={email}
          placeholder={t("SANDBOX_URL_PLACEHOLDER")}
          populators={{}}
        />
        <div>{t("SANDBOX_URL_FOOT")}</div>
        <Button onClick={onButtonClick} label={t("SIGN_IN")} ></Button>
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

export default ViewUrl;


