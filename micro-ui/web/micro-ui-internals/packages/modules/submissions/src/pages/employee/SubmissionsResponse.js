import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Banner, Card, LinkLabel, AddFileFilled, ArrowLeftWhite, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";

const buttonStyle={wrapper:{ display: "flex" },linkLabel:{ display: "flex", marginRight: "3rem" },arrow:{ marginRight: "8px", marginTop: "3px" }}

const Response = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryStrings = Digit.Hooks.useQueryParams();
  const [isResponseSuccess, setIsResponseSuccess] = useState(
    queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
  );
  const { state } = useLocation();

  const navigate = (page) => {
    switch (page) {
      case "home": {
        history.push(`/${window.contextPath}/employee`);
      }
    }
  };

  return (
    <Card>
      <Banner
        successful={isResponseSuccess}
        message={t(state?.message || "SUCCESS")}
        info={`${state?.showID ? t("CONTRACTS_WO_ID") : ""}`}
        whichSvg={`${isResponseSuccess ? "tick" : null}`}
      />
      <div style={buttonStyle?.wrapper}>
        <LinkLabel style={buttonStyle?.linkLabel} onClick={() => navigate("home")}>
          <ArrowLeftWhite fill="#F47738" style={buttonStyle?.arrow} />
          {t("CORE_COMMON_GO_TO_HOME")}
        </LinkLabel>
      </div>
      <ActionBar>
        <Link to={`/${window.contextPath}/employee`}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </Card>
  );
};

export default Response;
