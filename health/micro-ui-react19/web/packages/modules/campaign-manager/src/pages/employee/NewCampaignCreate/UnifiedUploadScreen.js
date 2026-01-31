import { FormComposerV2, Loader, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { unifiedUploadConfig } from "../../../configs/unifiedUploadConfig";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";

const UnifiedUploadScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [totalFormData, setTotalFormData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [loader, setLoader] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ADMIN_CONSOLE_UNIFIED_UPLOAD_DATA", {});

  const hirechyType = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID")?.hierarchyType || null;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const id = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_DATA")?.id;

  const { data: baseTimeOut } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "baseTimeout" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.baseTimeout` }
  );

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
    url: `/project-factory/v1/project-type/update`,
    params: {},
    body: {},
    config: { enabled: false },
  };
  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);

  useEffect(() => setTotalFormData(params), [params]);

  const [config, setUploadConfig] = useState(unifiedUploadConfig({ totalFormData, campaignData }));

  useEffect(() => {
    setUploadConfig(unifiedUploadConfig({ totalFormData, campaignData }));
  }, [campaignData, totalFormData]);

  const showErrorToast = (messageKey) => {
    setShowToast({ key: "error", label: messageKey });
    setTimeout(() => setShowToast(false), 3000);
  };

  const onSubmit = async (formData) => {
    const uploadedData = formData?.HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA?.uploadUnified || formData?.uploadUnified;

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

    // Build resource for unified data
    const resources = [
      {
        type: "unified-console-resources",
        filename: uploadedData?.uploadedFile?.[0]?.filename,
        filestoreId: filestoreId,
      },
    ];

    // // Also include existing resources from campaign (filter out both old and new unified type names)
    // const existingResources = campaignData?.resources || [];
    // const otherResources = existingResources.filter((r) => r.type !== "unified-console" && r.type !== "unified-console-resources");
    // const allResources = [...otherResources, ...resources];

    // When unified-console is used, only send unified resources (remove facility/user/boundary)
    // Unified and normal upload flows are mutually exclusive
    const allResources = resources;

    setLoader(true);
    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/project-type/update`,
        body: { CampaignDetails: { ...campaignData, resources: allResources } },
        config: { enable: true },
      },
      {
        onSuccess: () => {
          setLoader(false);
          // Save to session storage
          setParams({
            HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA: {
              uploadUnified: uploadedData,
            },
          });
          // Navigate back to view details
          navigate(
            `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
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
      `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
    );
  };

  if (loader) return <Loader page={true} variant={"OverlayLoader"} loaderText={t("PLEASE_WAIT_WHILE_UPDATING")} />;

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

export default UnifiedUploadScreen;
