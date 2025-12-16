import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PanelCard, Footer, Button } from "@egovernments/digit-ui-components";

const Response = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryStrings = Digit.Hooks.useQueryParams();
  const isResponseSuccess = queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true;
  const { state } = useLocation();

  const goToHome = () => {
    navigate(`/${window.contextPath}/employee/`);
  };

  const children = [
    <div style={{ display: "flex" }} key="response-text">
      {state?.boldText ? (
        <p style={{ margin: "0rem" }}>
          {t(state?.preText)}
          <b> {t(state?.boldText)} </b>
          {t(state?.postText)}
        </p>
      ) : (
        t(state?.text)
      )}
    </div>,
  ];

  return (
    <>
      <PanelCard
        type={isResponseSuccess ? "success" : "error"}
        message={t(state?.message)}
        info={t(state?.info)}
        footerChildren={[]}
        children={children}
        showAsSvg={true}
      />
      <Footer
        actionFields={[
          <Button
            icon="ArrowBack"
            label={t("GO_BACK_TO_HOME")}
            onClick={goToHome}
            type="button"
            variation="primary"
          />
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
