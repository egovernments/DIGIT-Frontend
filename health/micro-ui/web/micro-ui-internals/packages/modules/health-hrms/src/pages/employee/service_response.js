import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar, SubmitBar, ArrowLeft, ArrowForward } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
import { PanelCard } from "@egovernments/digit-ui-components";
import { ReposeScreenType } from "../../constants/enums";

const ResponseScreen = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { state } = useLocation();
  const back = state?.back ? state?.back : "BACK";

  return (
    <>
      <PanelCard
        animationProps={{
          loop: false,
          noAutoplay: false,
        }}
        children={[]}
        cardClassName=""
        cardStyles={{}}
        className=""
        customIcon=""
        description={t(state?.description)}
        footerChildren={
          state.isCampaign == ReposeScreenType.EDIT_USER || state.isCampaign == ReposeScreenType.EDIT_USER_ERROR
            ? []
            : [
                <Button
                  label={t(back)}
                  onClick={() => {
                    history.push(`/${window.contextPath}/employee/`);
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
        response={t(state?.fileName?.user?.name)}
        sortFooterButtons
        style={{}}
        type={state?.state}
      ></PanelCard>
      <ActionBar className="mc_back">
        <Button
          style={{ margin: "0.5rem", marginLeft: "6rem", minWidth: "16rem" }}
          variation="primary"
          label={state.isCampaign == ReposeScreenType.CREAT_EUSER ? t("CORE_COMMON_CONTINUE_CAMPAIGN_ASSIGNMENTS") : t(back)}
          icon={"ArrowBack"}
          onClick={() => {
            const backlink =
              state.isCampaign == ReposeScreenType.CREAT_EUSER
                ? `/${window.contextPath}/employee/hrms/assign-campaign/${state?.fileName?.code}`
                : `/${window.contextPath}/employee/`;
            history.push(backlink);
          }}
        />
      </ActionBar>
    </>
  );
};

export default ResponseScreen;
