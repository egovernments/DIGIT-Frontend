import React, { useState, Fragment, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PanelCard, Footer, Button } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

const Response = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryStrings = Digit.Hooks.useQueryParams();
  const [campaignId, setCampaignId] = useState(queryStrings?.campaignId);
  const [isResponseSuccess, setIsResponseSuccess] = useState(
    queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
  );
  const { state } = useLocation();
  const isMobile = window.Digit.Utils.browser.isMobile();

  const navigation = (link) => {
    navigate(link ? link : `/${window.contextPath}/employee/`);
  };

  useEffect(() => {
    if (state?.actionLabel === "HCM_CONFIGURE_APP_RESPONSE_ACTION" && queryStrings?.isSuccess === "true") {
      const timer = setTimeout(() => {
        navigation(state?.actionLink || `/${window.contextPath}/employee/`);
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
          state?.actionLabel && (
            <Button
              icon={state?.primaryActionIcon || "ArrowForward"}
              isSuffix={state?.isPrimaryIconSuffix === false ? false : true}
              label={t(state?.actionLabel)}
              title={t(state?.actionLabel)}
              onClick={() => navigation(state?.actionLink)}
              type="button"
              variation={state?.primaryActionVariation || "secondary"}
            />
          ),
          state?.secondaryActionLabel && (
            <Button
              label={
                state?.secondaryActionLabel
                  ? t(state?.secondaryActionLabel)
                  : t(I18N_KEYS.PAGES.ES_CAMPAIGN_RESPONSE_ACTION)
              }
              title={
                state?.secondaryActionLabel
                  ? t(state?.secondaryActionLabel)
                  : t(I18N_KEYS.PAGES.ES_CAMPAIGN_RESPONSE_ACTION)
              }
              isSuffix={state?.isSecondaryIconSuffix || false}
              icon={state?.secondaryActionIcon}
              onClick={() => navigation(state?.secondaryActionLink)}
              type="button"
              variation={state?.secondaryActionVariation || "secondary"}
            />
          ),
        ]}
        className={state?.footerClassName || ""}
        maxActionFieldsAllowed={5}
        setactionFieldsToRight
        sortActionFields
        style={{}}
      />
    </>
  );
};

export default Response;
