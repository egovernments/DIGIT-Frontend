import React, { useState, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PanelCard, Footer } from "@egovernments/digit-ui-components";
import { ReposeScreenType } from "../../constants/enums";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

const ResponseScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { state } = useLocation();
  const back = state?.back ? state?.back : I18N_KEYS.PAGES_RESPONSE.BACK;

  return (
    <>
      <PanelCard
        showAsSvg={true}
        cardClassName=""
        cardStyles={{}}
        className=""
        customIcon=""
        description={t(state?.description)}
        footerChildren={
          state.isCampaign === ReposeScreenType.EDIT_USER ||
          state.isCampaign === ReposeScreenType.EDIT_USER_ERROR ||
          state.isCampaign === ReposeScreenType.EDIT_ASSIGNED_CAMPAIGN_ERROR
            ? []
            : [
                <Button
                  label={t(back)}
                  onClick={() => {
                    navigate(`/${window.contextPath}/employee/`);
                  }}
                  variation="teritiary"
                  icon="ArrowForward"
                  isSuffix
                />,
              ]
        }
        footerStyles={{}}
        iconFill=""
        info={t(state?.info)}
        maxFooterButtonsAllowed={5}
        message={t(state?.message)}
        multipleResponses={[]}
        props={{}}
        response={t(state?.fileName?.user?.userName)}
        sortFooterButtons
        style={{}}
        type={state?.state}
      ></PanelCard>
      <Footer
        className="mc_back"
        setactionFieldsToRight={true}
        actionFields={[
          <Button
            key="back"
            // style={{ margin: "0.5rem", marginLeft: "6rem", width: "25%" }}
            variation="primary"
            label={state.isCampaign == ReposeScreenType.CREAT_EUSER ? t(I18N_KEYS.PAGES_RESPONSE.CORE_COMMON_CONTINUE_CAMPAIGN_ASSIGNMENTS) : t(back)}
            icon={"ArrowForward"}
            isSuffix
            onClick={() => {
              const backlink =
                state.isCampaign == ReposeScreenType.CREAT_EUSER
                  ? `/${window.contextPath}/employee/hrms/assign-campaign/${state?.fileName?.code}`
                  : `/${window.contextPath}/employee/`;
              navigate(backlink);
            }}
          />,
        ]}
      />
    </>
  );
};

export default ResponseScreen;
