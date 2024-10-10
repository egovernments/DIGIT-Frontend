import React, { useRef } from "react";
import { BackLink, Button, Card, CardHeader, CardLabel, CardText, FieldV1, SVG, TextInput } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory, useLocation } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";

const ViewUrl = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { tenant } = location.state || {};
  const history = useHistory();
  const ref = useRef(null);
  const userScreensExempted = ["/user/landing","user/profile", "user/error"];


  const onButtonClick = () => {
    window.location.href = `/${window?.globalPath}/${tenant}/employee/user/landing`;
    // history.push({
    // pathname: `/${window?.globalPath}/${tenant}/employee`,
    // });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(ref.current.value);
  };

  return (
    <Background>
      <div className="employeeBackbuttonAlign">
      <BackLink onClick={() => window.history.back()}/>
      </div>
      <Card className="card-sandbox">
        <Header showTenant={false} />
        <div className="sandbox-success-signup">
          <SVG.TickMark fill={"#fff"} height={30} width={70} />
        </div>
        <CardHeader className="cardHeader-sandbox" styles={{ color: "#00703c" }}>
          {t("SANDBOX_HEADER")}
        </CardHeader>
        <CardText className="cardText-sandbox">{t("SAMDBOX_URL_SUB")}</CardText>
        <CardLabel> {t("SANDBOX_URL")} </CardLabel>
        <div className="sandbox-url-wrapper">
          <TextInput
            inputRef={ref}
            className={"urlInputText"}
            onChange={() => {}}
            nonEditable={true}
            value={`${window.location.host}/${window?.globalPath}/${tenant}/employee`}
          />
          <Button className="copyButton" variation={"secondary"} onClick={() => handleCopyUrl()} label={t("COPY_URL")}></Button>
        </div>
        <div className="sandbox-url-footer">{t("SANDBOX_URL_FOOT")}</div>
        <Button onClick={onButtonClick} label={t("SIGN_IN")}></Button>
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

export default ViewUrl;
