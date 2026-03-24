import { FormComposerV2, Loader, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mapAttendeesConfig } from "../../../configs/mapAttendeesConfig";

const MapAttendeesScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [loader, setLoader] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignName = searchParams.get("campaignName");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const registerId = searchParams.get("registerId");
  const registerNumber = searchParams.get("registerNumber");
  const registerName = searchParams.get("registerName");
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ATTENDANCE_ATTENDEE_DATA", {});

  const reqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: { CampaignDetails: { tenantId, campaignNumber } },
    config: {
      enabled: !!campaignNumber,
      select: (data) => data?.CampaignDetails?.[0],
      staleTime: 0,
      cacheTime: 0,
    },
  };
  const { data: campaignData } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // Enrich campaignData with registerId as id so NewUploadData uses it as referenceId
  const enrichedCampaignData = useMemo(
    () => (campaignData ? { ...campaignData, id: registerId } : null),
    [campaignData, registerId]
  );

  const reqUpdate = {
    url: `/project-factory/v1/resource-details/_create`,
    params: {},
    body: {},
    config: { enabled: false },
  };
  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);

  const config = useMemo(
    () => mapAttendeesConfig({ totalFormData: params, campaignData: enrichedCampaignData }),
    [params, enrichedCampaignData]
  );

  const showErrorToast = (messageKey) => {
    setShowToast({ key: "error", label: messageKey });
    setTimeout(() => setShowToast(false), 3000);
  };

  const onSubmit = async (formData) => {
    const uploadedData =
      formData?.HCM_CAMPAIGN_UPLOAD_ATTENDEE_DATA?.uploadAttendanceRegisterAttendee ||
      formData?.uploadAttendanceRegisterAttendee;

    if (!uploadedData?.uploadedFile?.length) {
      return showErrorToast(t("PLEASE_UPLOAD_FILE"));
    }

    if (uploadedData?.isError || uploadedData?.apiError) {
      return showErrorToast(t("ENTER_VALID_FILE"));
    }

    const filestoreId = uploadedData?.uploadedFile?.[0]?.filestoreId || uploadedData?.uploadedFile?.[0]?.fileStoreId;

    if (!filestoreId) {
      return showErrorToast(t("PLEASE_UPLOAD_FILE"));
    }

    const resourceDetails = {
      tenantId: campaignData?.tenantId,
      campaignId: campaignData?.id,
      type: "attendanceRegisterAttendee",
      fileStoreId: filestoreId,
      filename: uploadedData?.uploadedFile?.[0]?.filename,
      parentResourceId: registerId,
    };

    setLoader(true);
    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/resource-details/_create`,
        body: { ResourceDetails: resourceDetails },
        config: { enable: true },
      },
      {
        onSuccess: () => {
          setLoader(false);
          setParams({});
          navigate(
            `/${window.contextPath}/employee/campaign/response?isSuccess=true`,
            {
              state: {
                message: t("HCM_ATTENDEE_MAPPING_SUCCESS"),
                text: t("HCM_ATTENDEE_MAPPING_SUCCESS_TEXT"),
                actionLabel: "HCM_BACK_TO_SETUP_ATTENDANCE",
                actionLink: `/${window.contextPath}/employee/campaign/setup-attendance?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
              },
            }
          );
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.Errors?.[0]?.description || t("HCM_ERROR_IN_CAMPAIGN_CREATION"));
          setLoader(false);
        },
      }
    );
  };

  const onSecondayActionClick = () => {
    navigate(
      `/${window.contextPath}/employee/campaign/register-details?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}&registerId=${registerId}&registerNumber=${registerNumber}&registerName=${encodeURIComponent(registerName || "")}`
    );
  };

  if (loader)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", width: "100%" }}>
        <Loader page={true} variant={"OverlayLoader"} loaderText={t("PLEASE_WAIT_WHILE_UPDATING")} />
      </div>
    );

  const closeToast = () => setShowToast(null);

  return (
    <>
      <FormComposerV2
        config={config?.[0]?.form.map((cfg) => ({ ...cfg, body: cfg?.body.filter((a) => !a.hideInEmployee) }))}
        onSubmit={onSubmit}
        defaultValues={params || {}}
        showSecondaryLabel={true}
        secondaryLabel={t("HCM_BACK")}
        actionClassName={"actionBarClass"}
        noCardStyle={true}
        onSecondayActionClick={onSecondayActionClick}
        label={t("HCM_SUBMIT")}
        secondaryActionIcon={"ArrowBack"}
      />
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          type={
            showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"
          }
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default MapAttendeesScreen;
