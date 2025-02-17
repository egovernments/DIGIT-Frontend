import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar, SubmitBar, ArrowLeft, ArrowForward } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
import { PanelCard } from "@egovernments/digit-ui-components";

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
        cardClassName=""
        cardStyles={{}}
        className=""
        customIcon=""
        description={t(state?.description)}
        footerChildren={[
          <Button
            label={t(`HCM_AM_VIEW_ANOTHER_REGISTER`)}
            onClick={() => {
              history.push(`/${window.contextPath}/employee/`);
            }}
            variation="teritiary"
            icon="ArrowForward"
            isSuffix
          />,
        ]}
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
          label={t(back)}
          icon={"ArrowBack"}
          onClick={() => {

           const backlink = state.isCampaign?`/${window.contextPath}/employee/` :`/${window.contextPath}/employee/hrms/assign-campaign/${state?.fileName?.code}`;

            history.push(backlink);
          }}
        />
      </ActionBar>
    </>
  );
};

export default ResponseScreen;
