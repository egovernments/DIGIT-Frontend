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
  const [campaignId, setCampaignId] = useState(queryStrings?.campaignId);
  const [isResponseSuccess, setIsResponseSuccess] = useState(
    queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
  );
  const { state } = useLocation();
  const back = state?.back ? state?.back : "BACK";

  return (
    <>
      <PanelCard
        animationProps={{
          loop: false,
          noAutoplay: false,
        }}
        cardClassName=""
        cardStyles={{}}
        className=""
        customIcon=""
        description={t(state?.description || "")}
        footerChildren={state?.showDraftDownload ? [
          <Button
            key="download-draft-button"
            style={{ margin: "0.5rem", marginLeft: "6rem" }}
            className="microplan-response-button"
            variation="secondary"
            label={t(state?.actionLabel)}
            icon={"FileDownload"}
            onClick={() => {
              // TODO: Replace with actual download logic (e.g., downloadDraftFile())
            }}
        />
        ]:[]}
        footerStyles={{}}
        iconFill=""
        info={t(state?.info || "")}
        maxFooterButtonsAllowed={5}
        message={t(state?.message || "")}
        multipleResponses={[]}
        props={{}}
        response={t(state?.fileName ? state?.fileName : state?.responseId ? state?.responseId : "")}
        sortFooterButtons
        style={{}}
        type="success"
      ></PanelCard>
      <ActionBar className="mc_back">
        <Button
          style={{ margin: "0.5rem", marginLeft: "6rem" }}
          className="microplan-response-button"
          variation="secondary"
          label={t(back)}
          icon={"ArrowBack"}
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
