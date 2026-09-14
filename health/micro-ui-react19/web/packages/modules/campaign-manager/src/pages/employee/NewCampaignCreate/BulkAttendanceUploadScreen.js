import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardLabel,
  FormComposerV2,
  HeaderComponent,
  Loader,
  Toast,
} from "@egovernments/digit-ui-components";
import { mapAttendeesConfig } from "../../../configs/mapAttendeesConfig";
import useCampaignStore from "../../../hooks/useCampaignStore";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const BulkAttendanceUploadScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignName = searchParams.get("campaignName");
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();
  const registerIdFromQuery = searchParams.get("registerId");
  const registerNumberFromQuery = searchParams.get("registerNumber");

  const attendanceContextPath =
    window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") ||
    "health-attendance";

  const [showToast, setShowToast] = useState(null);
  const [loader, setLoader] = useState(false);
  const [selectedRegister, setSelectedRegister] = useState(null);
  const [params, setParams] = useCampaignStore("HCM_ATTENDANCE_ATTENDEE_DATA", {});

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

  const registerReqCriteria = {
    url: `/${attendanceContextPath}/v1/_search`,
    params: {
      tenantId,
      campaignNumber,
      limit: 1000,
      offset: 0,
    },
    body: {},
    config: {
      enabled: !!campaignNumber,
      select: (data) => data?.attendanceRegister || [],
      staleTime: 0,
      cacheTime: 0,
    },
    changeQueryName: `bulkAttendanceRegisters_${campaignNumber}`,
  };

  const {
    data: registerList = [],
    isLoading: isRegisterLoading,
  } = Digit.Hooks.useCustomAPIHook(registerReqCriteria);

  useEffect(() => {
    if (!registerList?.length) return;

    if (selectedRegister?.id) {
      const stillExists = registerList.some((item) => item?.id === selectedRegister.id);
      if (stillExists) return;
    }

    const fromId = registerIdFromQuery
      ? registerList.find((item) => item?.id === registerIdFromQuery)
      : null;

    const fromNumber = registerNumberFromQuery
      ? registerList.find((item) => item?.registerNumber === registerNumberFromQuery)
      : null;

    if (fromId) {
      setSelectedRegister(fromId);
      return;
    }

    if (fromNumber) {
      setSelectedRegister(fromNumber);
      return;
    }

    if (registerList.length === 1) {
      setSelectedRegister(registerList[0]);
    }
  }, [registerList, registerIdFromQuery, registerNumberFromQuery, selectedRegister?.id]);

  const attendeeResourceCriteria = {
    url: `/project-factory/v1/resource-details/_search`,
    body: {
      ResourceDetailsCriteria: {
        tenantId,
        campaignId: campaignData?.id,
        type: ["attendanceRegisterAttendee"],
        parentResourceId: selectedRegister?.id,
        isActive: true,
      },
    },
    config: {
      enabled: !!campaignData?.id && !!selectedRegister?.id,
      select: (data) => data?.ResourceDetails || [],
      staleTime: 0,
      cacheTime: 0,
    },
    changeQueryName: `attendanceResource_${selectedRegister?.id || "none"}`,
  };

  const { data: resourceDetails = [] } = Digit.Hooks.useCustomAPIHook(attendeeResourceCriteria);

  const enrichedCampaignData = useMemo(
    () => (campaignData ? { ...campaignData, registerId: selectedRegister?.id } : null),
    [campaignData, selectedRegister?.id]
  );

  const formConfig = useMemo(
    () => mapAttendeesConfig({ totalFormData: params, campaignData: enrichedCampaignData, resourceDetails }),
    [params, enrichedCampaignData, resourceDetails]
  );

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
    if (!selectedRegister?.id) {
      showErrorToast(t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_ID_LABEL));
      return;
    }

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
      type: "attendanceRegisterAttendee",
      fileStoreId: filestoreId,
      filename: uploadedData?.uploadedFile?.[0]?.filename,
      parentResourceId: selectedRegister.id,
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

  if (loader || isCampaignLoading || isRegisterLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", width: "100%" }}>
        <Loader page={true} variant={loader ? "OverlayLoader" : undefined} loaderText={t(I18N_KEYS.COMMON.PLEASE_WAIT_WHILE_UPDATING)} />
      </div>
    );
  }

  return (
    <>

      {selectedRegister ? (
        <FormComposerV2
          config={formConfig?.[0]?.form.map((cfg) => ({ ...cfg, body: cfg?.body.filter((a) => !a.hideInEmployee) }))}
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
      ) : (
        <Card>
          <p className="info-text" style={{ margin: 0 }}>
            {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_ATTENDANCE_REGISTER_ATTENDEE_MESSAGE)}
          </p>
        </Card>
      )}

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