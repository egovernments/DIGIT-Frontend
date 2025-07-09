import React, { useState, Fragment, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PanelCard, Footer, Button } from "@egovernments/digit-ui-components";

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

  useEffect(() => {
    if (state?.actionLabel === "HCM_CONFIGURE_APP_RESPONSE_ACTION" && queryStrings?.isSuccess === "true") {
      const timer = setTimeout(() => {
        navigate(state?.actionLink || `/${window.contextPath}/employee/`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state?.actionLabel, state?.actionLink]);

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
        info={t(state?.info)}
        footerChildren={[]}
        children={children}
        showAsSvg={true}
      />
      <Footer
        actionFields={[
          state?.secondaryActionLabel && (
            <Button
              label={state?.secondaryActionLabel ? t(state?.secondaryActionLabel) : t("ES_CAMPAIGN_RESPONSE_ACTION")}
              onClick={() => navigate(state?.secondaryActionLink)}
              type="button"
              variation="secondary"
            />
          ),
          <Button
            icon="ArrowForward"
            isSuffix
            label={state?.actionLabel ? t(state?.actionLabel) : t("ES_CAMPAIGN_RESPONSE_ACTION")}
            onClick={() => navigate(state?.actionLink)}
            type="button"
          />,
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
