import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Banner, Card, LinkLabel, AddFileFilled, ArrowLeftWhite, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import { PanelCard } from "@egovernments/digit-ui-components";

const buttonStyle = {
  wrapper: { display: "flex" },
  linkLabel: { display: "flex", marginRight: "3rem" },
  arrow: { marginRight: "8px", marginTop: "3px" },
};

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

  const children = (
    <div style={buttonStyle?.wrapper}>
      <LinkLabel style={buttonStyle?.linkLabel} onClick={() => navigate("home")}>
        <ArrowLeftWhite fill="#F47738" style={buttonStyle?.arrow} />
        {t("CORE_COMMON_GO_TO_HOME")}
      </LinkLabel>
    </div>
  );

  return (
    <>
      <PanelCard
        type={isResponseSuccess ? "success" : "error"}
        message={t(state?.message || "SUCCESS")}
        response={`${state?.showID ? t("CONTRACTS_WO_ID") : ""}`}
        footerChildren={[]}
        children={children}
      />
      <ActionBar>
        <Link to={`/${window.contextPath}/employee`}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </>
  );
};

export default Response;
