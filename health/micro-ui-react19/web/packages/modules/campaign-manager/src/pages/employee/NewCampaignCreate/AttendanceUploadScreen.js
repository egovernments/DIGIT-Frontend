import { FormComposerV2, Loader, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceUploadConfig } from "../../../configs/attendanceUploadConfig";
import useCampaignStore from "../../../hooks/useCampaignStore";

const AttendanceUploadScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [totalFormData, setTotalFormData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [loader, setLoader] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [params, setParams] = useCampaignStore("HCM_ATTENDANCE_REGISTER_DATA", {});

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

  const reqUpdate = {
    url: `/project-factory/v1/project-type/add-resources`,
    params: {},
    body: {},
    config: { enabled: false },
  };
  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);

  useEffect(() => setTotalFormData(params), [params]);

  const [config, setUploadConfig] = useState(attendanceUploadConfig({ totalFormData, campaignData }));

  useEffect(() => {
    setUploadConfig(attendanceUploadConfig({ totalFormData, campaignData }));
  }, [campaignData, totalFormData]);

  const showErrorToast = (messageKey) => {
    setShowToast({ key: "error", label: messageKey });
    setTimeout(() => setShowToast(false), 3000);
  };

  const onSubmit = async (formData) => {
    const uploadedData =
      formData?.HCM_CAMPAIGN_UPLOAD_ATTENDANCE_REGISTER_DATA?.uploadAttendanceRegister ||
      formData?.uploadAttendanceRegister;

    if (!uploadedData?.uploadedFile?.length) {
      return showErrorToast(t(I18N_KEYS.CAMPAIGN_CREATE.PLEASE_UPLOAD_FILE));
    }

    if (uploadedData?.isError || uploadedData?.apiError) {
      // Reshow the same message NewUploadData already showed for this outcome, as a reminder.
      // toastLabel is the exact key NewUploadData showed in its own toast for this outcome.
      const toastKey = uploadedData?.validationStatus?.toastLabel;
      return showErrorToast(toastKey ? t(toastKey) : t(I18N_KEYS.CAMPAIGN_CREATE.ENTER_VALID_FILE));
    }

    const filestoreId = uploadedData?.uploadedFile?.[0]?.filestoreId || uploadedData?.uploadedFile?.[0]?.fileStoreId;

    if (!filestoreId) {
      return showErrorToast(t(I18N_KEYS.CAMPAIGN_CREATE.PLEASE_UPLOAD_FILE));
    }

    const newResource = {
      type: "attendanceRegister",
      filename: uploadedData?.uploadedFile?.[0]?.filename,
      filestoreId: filestoreId,
    };

    // Preserve existing resources, only replace the attendanceRegister type
    // const existingResources = campaignData?.resources?.filter((r) => r.type !== "attendanceRegister") || [];
    // const resources = [...existingResources, newResource];

    setLoader(true);
    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/project-type/add-resources`,
        body: { CampaignDetails: { id: campaignData?.id, tenantId: campaignData?.tenantId, resources: [newResource] } },
        config: { enable: true },
      },
      {
        onSuccess: () => {
          setLoader(false);
          setParams({
            HCM_ATTENDANCE_REGISTER_DATA: {
              uploadAttendanceRegister: uploadedData,
            },
          });
          navigate(
            `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
          );
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.Errors?.[0]?.description || t(I18N_KEYS.COMMON.HCM_ERROR_IN_CAMPAIGN_CREATION));
          setLoader(false);
        },
      }
    );
  };

  const onSecondayActionClick = () => {
    navigate(
      `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
    );
  };

  if (loader) return <Loader page={true} variant={"OverlayLoader"} loaderText={t(I18N_KEYS.COMMON.PLEASE_WAIT_WHILE_UPDATING)} />;

  const closeToast = () => setShowToast(null);

  return (
    <>
      <FormComposerV2
        config={config?.[0]?.form.map((cfg) => ({ ...cfg, body: cfg?.body.filter((a) => !a.hideInEmployee) }))}
        onSubmit={onSubmit}
        defaultValues={params}
        showSecondaryLabel={true}
        secondaryLabel={t(I18N_KEYS.COMMON.HCM_BACK)}
        actionClassName={"actionBarClass"}
        noCardStyle={true}
        onSecondayActionClick={onSecondayActionClick}
        label={t(I18N_KEYS.COMMON.HCM_SUBMIT)}
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

export default AttendanceUploadScreen;