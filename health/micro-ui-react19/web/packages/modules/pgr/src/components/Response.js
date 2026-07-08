import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PanelCard, Footer, Button } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const Response = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const panelType = pathname?.includes("complaint-success") ? "success" : "error";

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
        type={panelType}
      />
      <Footer
        actionFields={[
          <Button
            key="create-another"
            variation="secondary"
            label={t(I18N_KEYS.COMPONENTS.PGR_CREATE_ANOTHER_COMPLAIN)}
            icon={"Add"}
            onClick={() => navigate(`/${window.contextPath}/employee/pgr/create-complaint`)}
            type="button"
          />,
          <Button
            key="go-to-inbox"
            variation="primary"
            label={t(I18N_KEYS.COMPONENTS.PGR_SEARCH_COMPLAINT)}
            icon={"ExitToApp"}
            isSuffix={true}
            onClick={() => navigate(state?.backlink || `/${window.contextPath}/employee/`)}
            type="button"
          />,
        ]}
        maxActionFieldsAllowed={5}
        setactionFieldsToRight
        sortActionFields
        style={{}}
      />
    </>
  );
};

export default Response;
