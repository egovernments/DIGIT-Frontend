import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, EditIcon, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";

const CampaignDetailsSummary = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const noAction = searchParams.get("action");
  const [showToast, setShowToast] = useState(null);
  const handleRedirect = (step, activeCycle) => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    urlParams.set("key", step);
    urlParams.set("preview", false);
    if (activeCycle) {
      urlParams.set("activeCycle", activeCycle);
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.push(newUrl);
  };

  const { isLoading, data, error, refetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
    },
    config: {
      select: (data) => {
        return {
          cards: [
            {
                sections: [
                  {
                    type: "DATA",
                    cardHeader: { value: t("CAMPAIGN_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                    cardSecondaryAction: noAction !== "false" && (
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                        <span>{t(`CAMPAIGN_EDIT`)}</span>
                        <EditIcon />
                      </div>
                    ),
                    values: [
                      {
                        key: "CAMPAIGN_TYPE",
                        value: data?.[0]?.projectType ? t(`CAMPAIGN_PROJECT_${data?.[0]?.projectType?.toUpperCase()}`) : t("CAMPAIGN_SUMMARY_NA"),
                      },
                      {
                        key: "CAMPAIGN_NAME",
                        value: data?.[0]?.campaignName || t("CAMPAIGN_SUMMARY_NA"),
                      },
                      {
                        key: "CAMPAIGN_START_DATE",
                        value: Digit.Utils.date.convertEpochToDate(data?.[0]?.startDate) || t("CAMPAIGN_SUMMARY_NA"),
                      },
                      {
                        key: "CAMPAIGN_END_DATE",
                        value: Digit.Utils.date.convertEpochToDate(data?.[0]?.endDate) || t("CAMPAIGN_SUMMARY_NA"),
                      },
                    ],
                  },
                ],
              },
          ],
          
          error: data?.[0]?.additionalDetails?.error,
          data: data?.[0],
          status: data?.[0]?.status,
        };
      },
      enabled: id ? true : false,
      staleTime: 0,
      cacheTime: 0,
    },
  });

  if (isLoading) {
    return <Loader />;
  }
  const closeToast = () => {
    setShowToast(null);
  };
  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);
  useEffect(() => {
    if (data?.status === "failed" && data?.error) {
      setShowToast({ label: data?.error, key: "error" });
    }
    if (data?.status === "creating") {
      setShowToast({ label: "CAMPAIGN_STATUS_CREATING_MESSAGE", key: "info" });
    }
    if (data?.status === "created" && data?.userGenerationSuccess?.length > 0) {
      setShowToast({ label: "CAMPAIGN_USER_GENERATION_SUCCESS", key: "success" });
    }
  }, [data]);

  const updatedObject = { ...data };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header className="summary-header">{t("HCM_CAMPAIGN_DETAILS_SUMMARY")}</Header>
      </div>
      <div className="campaign-summary-container">
        <ViewComposer data={updatedObject}  />
        {showToast && (
          <Toast
            type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : "success"}
            label={t(showToast?.label)}
            onClose={closeToast}
          />
        )}
      </div>
    </>
  );
};

export default CampaignDetailsSummary;
