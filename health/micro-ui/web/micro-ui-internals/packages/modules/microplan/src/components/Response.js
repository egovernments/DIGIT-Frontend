import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar, SubmitBar, ArrowLeft, ArrowForward } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
import { PanelCard } from "@egovernments/digit-ui-components";
import { Toast } from "@egovernments/digit-ui-components";

const Response = ({ useWindowState = false }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const queryStrings = Digit.Hooks.useQueryParams();
  const [campaignId, setCampaignId] = useState(queryStrings?.campaignId);
  const [isResponseSuccess, setIsResponseSuccess] = useState(
    queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
  );
  const [showToast, setShowToast] = useState(false);
  const state = useWindowState ? window?.history?.state : location?.state;
  const back = state?.back ? state?.back : "BACK";

  const downloadDraftFile = () => {
    if (state?.planObject) {
      const toastObject = Digit.Utils.microplanv1.validatePlanConfigForDraftDownload(state?.planObject);
      if (!toastObject) {
        setShowToast({ label: t("Draft_Validations_Failed"), type: "error" });
        return;
      } else {
        if (state?.planObject?.files?.length > 0) {
          // Find the file with templateIdentifier === "DraftComplete"
          const draftFile = state?.planObject.files.find((file) => file.templateIdentifier === "DraftComplete");
          if (draftFile) {
            Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: draftFile?.filestoreId, customName: `${state?.responseId}_Draft` });
          } else {
            setShowToast({ label: t("NO_DRAFT_FILE_FOUND"), type: "error" });
          }
        }
      }
    }
  };

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
        footerChildren={[]}
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
      >{
        state?.showDraftDownload ? 
          <Button
            key="download-draft-button"
            style={{marginLeft: "auto" }}
            variation="secondary"
            label={t(state?.actionLabel)}
            icon={"FileDownload"}
            onClick={() => {
              downloadDraftFile();
            }}
        />
        : null
      }</PanelCard>
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
      {showToast && (
        <Toast
          type={showToast?.type}
          label={showToast?.label}
          transitionTime={showToast?.transitionTime || 5000}
          onClose={() => {
            setShowToast(false);
          }}
        />
      )}
    </>
  );
};

export default Response;
