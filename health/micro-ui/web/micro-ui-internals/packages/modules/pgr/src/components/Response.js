import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar, SubmitBar, ArrowLeft, ArrowForward } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
import { PanelCard } from "@egovernments/digit-ui-components";

const Response = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryStrings = Digit.Hooks.useQueryParams();
  const { state } = useLocation();
  const back = state?.back ? state?.back : "BACK";

  return (
    <>
      <PanelCard
        showAsSvg={true}
        cardClassName=""
        cardStyles={{}}
        className=""
        customIcon=""
        description={t(state?.description)}
        footerChildren={[]}
        footerStyles={{}}
        iconFill=""
        info={t(state?.info)}
        maxFooterButtonsAllowed={5}
        message={t(state?.message)}
        multipleResponses={[]}
        props={{}}
        response={t(state?.fileName ? state?.fileName : state?.responseId ? state?.responseId : "")}
        sortFooterButtons
        style={{}}
        type={state?.state}
      ></PanelCard>
      <ActionBar
        className="pgr-response-actionbar"
        style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%", gap: "2.5rem", paddingRight: "1.5rem" }}
      >
        <Button
          className="pgr-response-btn create-complaint-btn"
          variation="secondary"
          label={t(`PGR_CREATE_ANOTHER_COMPLAIN`)}
          icon={"Add"}
          onClick={() => {
            history.push(`/${window.contextPath}/employee/pgr/create-complaint`);
          }}
        />
        <Button
          className="pgr-response-btn back-btn"
          variation="primary"
          label={t("PGR_SEARCH_COMPLAINT")}
          icon={"ExitToApp"}
          onClick={() => {
            const backlink = state?.backlink || `/${window.contextPath}/employee/`;
            history.push(backlink);
          }}
        />
      </ActionBar>
    </>
  );
};

export default Response;
