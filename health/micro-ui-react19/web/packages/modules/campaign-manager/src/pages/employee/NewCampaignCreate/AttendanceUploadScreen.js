import { FormComposerV2, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceUploadConfig } from "../../../configs/attendanceUploadConfig";

const AttendanceUploadScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [totalFormData, setTotalFormData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ATTENDANCE_UPLOAD_DATA", {});

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
    const uploadedData = formData?.HCM_CAMPAIGN_UPLOAD_ATTENDANCE_DATA?.uploadAttendance || formData?.uploadAttendance;

    if (!uploadedData?.uploadedFile?.length) {
      return showErrorToast(t("PLEASE_UPLOAD_FILE"));
    }

    // Mock submit - just save to session storage and navigate back
    setParams({
      HCM_CAMPAIGN_UPLOAD_ATTENDANCE_DATA: {
        uploadAttendance: uploadedData,
      },
    });

    setShowToast({ key: "success", label: t("HCM_ATTENDANCE_UPLOAD_SUCCESS") });
    setTimeout(() => {
      navigate(
        `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
      );
    }, 1000);
  };

  const onSecondayActionClick = () => {
    navigate(
      `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
    );
  };

  const closeToast = () => setShowToast(null);

  return (
    <>
      <FormComposerV2
        config={config?.[0]?.form.map((cfg) => ({ ...cfg, body: cfg?.body.filter((a) => !a.hideInEmployee) }))}
        onSubmit={onSubmit}
        defaultValues={params}
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

export default AttendanceUploadScreen;
