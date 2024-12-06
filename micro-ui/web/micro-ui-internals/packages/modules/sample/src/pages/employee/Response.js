import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {  } from "@egovernments/digit-ui-react-components";
import { PanelCard ,ActionBar,Button} from "@egovernments/digit-ui-components";

const Response = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryStrings = Digit.Hooks.useQueryParams();
  const [campaignId, setCampaignId] = useState(queryStrings?.campaignId);
  const [isResponseSuccess, setIsResponseSuccess] = useState(
    queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
  );
  const { state } = useLocation();
  const isMobile = window.Digit.Utils.browser.isMobile();

  const navigate = (link) => {
        history.push(link ? link : `/${window.contextPath}/employee/`);
      
  };
  const description="The notification along with your complaint number is sent to your complainant’s mobile number. Complainant can track the complaint status using mobile or web app.";


  const children = [
    <div style={{ display: "flex" }} key="response-text">
      {state?.boldText ? (
        <p style={{ margin: "0rem" }}>
          {t(state?.preText)}
          <b> {t(state?.boldText)} </b>
          {t(state?.postText)}
        </p>
      ) : (
        t(state?.text, { CAMPAIGN_ID: campaignId })
      )}
    </div>,
  ];

  return (
    <>
      <PanelCard
        type={isResponseSuccess ? "success" : "error"}
        message={t(state?.message)}
        response={campaignId}
        info={"Complaint Number"}
        description={description}
        footerChildren={[]}
        children={children}
      />
      {/* {isMobile ? (
        <Link to={state?.actionLink ? state?.actionLink : `/${window.contextPath}/employee/`}>
          <SubmitBar label={state?.actionLabel ? t(state?.actionLabel) : t("ES_CAMPAIGN_RESPONSE_ACTION")} />
        </Link>
      ) : (
        <ActionBar>
          <Link to={state?.actionLink ? state?.actionLink : `/${window.contextPath}/employee/`}>
            <SubmitBar label={state?.actionLabel ? t(state?.actionLabel) : t("ES_CAMPAIGN_RESPONSE_ACTION")} />
          </Link>
        </ActionBar>
      )} */}
      <ActionBar
  actionFields={[
      <Button icon="ArrowForward" isSuffix label={state?.actionLabel ? t(state?.actionLabel) : t("Go Back To Home")} onClick={()=>navigate(state?.actionLink)} type="button"/>
  ]}
  className=""
  maxActionFieldsAllowed={5}
  setactionFieldsToRight
  sortActionFields
  style={{}}
/>
    </>
  );
};

export default Response;