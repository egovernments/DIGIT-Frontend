import React, { useState, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PanelCard, Footer } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const Response = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryStrings = Digit.Hooks.useQueryParams();
  const { state } = useLocation();
  const back = state?.back ? state?.back : "BACK";

  return (
    <>
      <PanelCard
        showAsSvg={true}
        children={<div dangerouslySetInnerHTML={{ __html: state?.description }} />}
        animationProps={{
          loop: false,
          noAutoplay: false,
        }}
        cardClassName=""
        cardStyles={{}}
        className=""
        customIcon=""
        //description={t(state?.description)}
        footerChildren={
          state?.showFooter === false
            ? []
            : [
                <Button
                  key="view-another-register"
                  label={t(I18N_KEYS.COMPONENTS_MISC.HCM_AM_VIEW_ANOTHER_REGISTER)}
                  onClick={() => {
                    navigate(`/${window.contextPath}/employee/payments/registers-inbox`);
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
        response={t(state?.fileName ? state?.fileName : state?.responseId ? state?.responseId : "")}
        sortFooterButtons
        style={{}}
        type={state?.state}
      ></PanelCard>
      <Footer
        setactionFieldsToRight={true}
        actionFields={[
          <Button
            style={{ margin: "0.5rem", marginLeft: "6rem", minWidth: "16rem" }}
            variation="primary"
            label={t(back)}
            icon={"ExitToApp"}
            onClick={() => {
              const backlink = state?.backlink || `/${window.contextPath}/employee/`;
              navigate(backlink);
            }}
          />
        ]}
      />
    </>
  );
};

export default Response;
