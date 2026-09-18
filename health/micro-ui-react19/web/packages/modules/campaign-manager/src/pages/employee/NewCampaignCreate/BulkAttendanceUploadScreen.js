import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FormComposerV2,
  Loader,
  Toast,
} from "@egovernments/digit-ui-components";
import { mapAttendeesConfig } from "../../../configs/mapAttendeesConfig";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
const BULK_TEMPLATE_TYPE = "attendanceRegisterUserBulkMapping";
const BulkAttendanceUploadScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignName = searchParams.get("campaignName");
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [loader, setLoader] = useState(false);
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ATTENDANCE_ATTENDEE_DATA", {});
  const campaignReqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: { CampaignDetails: { tenantId, campaignNumber } },
    config: {
      enabled: !!campaignNumber,
      select: (data) => data?.CampaignDetails?.[0],
      staleTime: 0,
      cacheTime: 0,
    },
  };
  const { data: campaignData, isLoading: isCampaignLoading } = Digit.Hooks.useCustomAPIHook(campaignReqCriteria);
  const registerResourceCriteria = {
    url: `/project-factory/v1/resource-details/_search`,
    body: {
      ResourceDetailsCriteria: {
        tenantId,
        campaignId: campaignData?.id,
        type: ["attendanceRegister"],
        isActive: true,
      },
    },
    config: {
      enabled: !!campaignData?.id,
      select: (data) => data?.ResourceDetails || [],
      staleTime: 0,
      cacheTime: 0,
    },
    changeQueryName: `bulkAttendanceRegisterResource_${campaignData?.id || "none"}`,
  };
  const { data: registerResourceDetails = [], isLoading: isRegisterResourceLoading } = Digit.Hooks.useCustomAPIHook(registerResourceCriteria);
  const localityCodeFromRegisterResource =
    registerResourceDetails?.find((item) => item?.localityCode)?.localityCode ||
    registerResourceDetails?.find((item) => item?.additionalDetails?.localityCode)?.additionalDetails?.localityCode;
  const attendanceSearchCriteria = {
    url: `/attendance/v1/_search`,
    params: {
      tenantId,
      campaignNumber,
      limit: 10,
      offset: 0,
    },
    body: {},
    config: {
      enabled: !!campaignNumber && !localityCodeFromRegisterResource,
      select: (data) => data?.attendanceRegister || [],
      staleTime: 0,
      cacheTime: 0,
    },
    changeQueryName: `bulkAttendanceLocality_${campaignNumber || "none"}`,
  };
  const { data: attendanceRegisters = [], isLoading: isAttendanceSearchLoading } = Digit.Hooks.useCustomAPIHook(attendanceSearchCriteria);
  const localityCodeFromAttendance = localityCodeFromRegisterResource || attendanceRegisters?.[0]?.localityCode;
  const resolvedBulkLocalityCode =
    localityCodeFromAttendance ||
    searchParams.get("localityCode") ||
    searchParams.get("boundaryCode") ||
    campaignData?.additionalDetails?.localityCode ||
    campaignData?.additionalDetails?.boundaryCode ||
    campaignData?.boundaryCode;
  const registerStatuses = registerResourceDetails
    ?.map((item) => item?.status)
    ?.filter(Boolean);
  const hasFailedRegister = registerStatuses?.some((status) => status === "failed");
  const hasInProgressRegister = registerStatuses?.some((status) => status === "creating" || status === "toCreate");
  const registerCreationStatus = hasFailedRegister ? "failed" : hasInProgressRegister ? "creating" : undefined;
  const isBulkRegisterCreationReady = !hasFailedRegister && !hasInProgressRegister;
  useEffect(() => {
    if (!registerCreationStatus) return;
    if (registerCreationStatus === "creating" || registerCreationStatus === "toCreate") {
      setShowToast({ key: "warning", label: t("HCM_REGISTER_CREATION_IN_PROGRESS") });
    } else if (registerCreationStatus === "failed") {
      setShowToast({ key: "error", label: t("HCM_REGISTER_CREATION_FAILED") });
    }
  }, [registerCreationStatus]);
  const resourceDetails = [];
  const enrichedCampaignData = useMemo(() => campaignData, [campaignData]);
  const formConfig = useMemo(
    () => mapAttendeesConfig({ totalFormData: params, campaignData: enrichedCampaignData, resourceDetails }),
    [params, enrichedCampaignData, resourceDetails]
  );
  const bulkFormConfig = useMemo(() => {
    return formConfig?.map((section) => ({
      ...section,
      form: section?.form?.map((step) => ({
        ...step,
        body: step?.body?.map((field) => {
          if (field?.component === "DataUploadWrapper") {
            return {
              ...field,
              customProps: {
                ...field?.customProps,
                bulkTemplateType: BULK_TEMPLATE_TYPE,
                bulkRegisterCreationReady: isBulkRegisterCreationReady,
                bulkRegisterCreationStatus: registerCreationStatus,
                bulkAttendanceLocalityCode: resolvedBulkLocalityCode,
              },
            };
          }
          return field;
        }),
      })),
    }));
  }, [formConfig]);
  const reqUpdate = {
    url: `/project-factory/v1/resource-details/_create`,
    params: {},
    body: {},
    config: { enabled: false },
  };
  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);
  const showErrorToast = (messageKeyOrText) => {
    setShowToast({ key: "error", label: messageKeyOrText });
    setTimeout(() => setShowToast(null), 3000);
  };
  const onSubmit = async (formData) => {
    const uploadedData =
      formData?.HCM_CAMPAIGN_UPLOAD_ATTENDEE_DATA?.uploadAttendanceRegisterAttendee ||
      formData?.uploadAttendanceRegisterAttendee;
    if (!uploadedData?.uploadedFile?.length) {
      return showErrorToast(t(I18N_KEYS.CAMPAIGN_CREATE.PLEASE_UPLOAD_FILE));
    }
    if (uploadedData?.isError || uploadedData?.apiError) {
      const toastKey = uploadedData?.validationStatus?.toastLabel;
      return showErrorToast(toastKey ? t(toastKey) : t(I18N_KEYS.CAMPAIGN_CREATE.ENTER_VALID_FILE));
    }
    const filestoreId = uploadedData?.uploadedFile?.[0]?.filestoreId || uploadedData?.uploadedFile?.[0]?.fileStoreId;
    if (!filestoreId) {
      return showErrorToast(t(I18N_KEYS.CAMPAIGN_CREATE.PLEASE_UPLOAD_FILE));
    }
    const resourcePayload = {
      tenantId: campaignData?.tenantId,
      campaignId: campaignData?.id,
      type: BULK_TEMPLATE_TYPE,
      fileStoreId: filestoreId,
      filename: uploadedData?.uploadedFile?.[0]?.filename,
      hierarchyType:
        searchParams.get("hierarchyType") ||
        params?.hierarchyType ||
        campaignData?.hierarchyType ||
        "ADMIN",
      parentResourceId: null,
    };
    setLoader(true);
    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/resource-details/_create`,
        body: { ResourceDetails: resourcePayload },
        config: { enable: true },
      },
      {
        onSuccess: () => {
          setLoader(false);
          setParams({});
          navigate(`/${window.contextPath}/employee/campaign/response?isSuccess=true`, {
            state: {
              message: t(I18N_KEYS.PAGES.HCM_ATTENDEE_MAPPING_SUCCESS),
              text: t(I18N_KEYS.PAGES.HCM_ATTENDEE_MAPPING_SUCCESS_TEXT),
              actionLabel: "HCM_BACK_TO_SETUP_ATTENDANCE",
              primaryActionIcon: "ArrowBack",
              actionLink: `/${window.contextPath}/employee/campaign/setup-attendance?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
              isPrimaryIconSuffix: false,
              primaryActionVariation: "primary",
            },
          });
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.Errors?.[0]?.description || t(I18N_KEYS.COMMON.HCM_ERROR_IN_CAMPAIGN_CREATION));
          setLoader(false);
        },
      }
    );
  };
  const goBackToMapUsers = () => {
    navigate(
      `/${window.contextPath}/employee/campaign/map-users-to-registers?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
    );
  };
  if (loader || isCampaignLoading || isRegisterResourceLoading || isAttendanceSearchLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", width: "100%" }}>
        <Loader page={true} variant={loader ? "OverlayLoader" : undefined} loaderText={t(I18N_KEYS.COMMON.PLEASE_WAIT_WHILE_UPDATING)} />
      </div>
    );
  }
  return (
    <>
      <FormComposerV2
        config={bulkFormConfig?.[0]?.form.map((cfg) => ({ ...cfg, body: cfg?.body.filter((a) => !a.hideInEmployee) }))}
        onSubmit={onSubmit}
        defaultValues={params || {}}
        showSecondaryLabel={true}
        secondaryLabel={t(I18N_KEYS.COMMON.HCM_BACK)}
        actionClassName={"actionBarClass"}
        noCardStyle={true}
        onSecondayActionClick={goBackToMapUsers}
        label={t(I18N_KEYS.COMMON.HCM_SUBMIT)}
        secondaryActionIcon={"ArrowBack"}
      />
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          type={
            showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"
          }
          label={showToast?.label}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </>
  );
};
export default BulkAttendanceUploadScreen;