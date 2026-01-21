import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Banner, Card, LinkLabel, AddFileFilled, ArrowLeftWhite, ActionBar, SubmitBar, ArrowRightInbox } from "@egovernments/digit-ui-react-components";
import { useParams } from "react-router-dom";

const ResponseEmployee = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { state } = useLocation();
  const {businessService, consumerCode, tenantId} = useParams();
  const [isResponseSuccess, setIsResponseSuccess] = useState(
    state?.isSuccess || false
  );

  const navigate = (page) => {
    switch (page) {
      case "home": {
        history.push(`/${window.contextPath}/employee`);
      }
      case "view": {
        history.push(state.redirectionUrl);
      }
    }
  };

  return (
    <Card>
      <Banner
        successful={isResponseSuccess || state?.iSuccess}
        message={t(state?.message || "PAYMENT_SUCCESS")}
        info={`${isResponseSuccess ? t("COMMON_APPLICATION_ID") : ""}`}
        whichSvg={`${isResponseSuccess ? "tick" : null}`}
        applicationNumber={state?.applicationNumber}
      />
      <div style={{ display: "flex" }}>
        <LinkLabel style={{ display: "flex", marginRight: "3rem" }} onClick={() => navigate("view")}>
          <ArrowRightInbox fill="#F47738" style={{ marginRight: "8px", marginTop: "3px" }} />
          {t(`${businessService.toUpperCase()}_VIEW_APPLICATION`)}
        </LinkLabel>
      </div>
      <ActionBar>
        <Link to={`/${window.contextPath}/employee`}>
          <SubmitBar label={t(`${businessService.toUpperCase()}_GO_TO_HOME`)} />
        </Link>
      </ActionBar>
    </Card>
  );
};

export default ResponseEmployee;
