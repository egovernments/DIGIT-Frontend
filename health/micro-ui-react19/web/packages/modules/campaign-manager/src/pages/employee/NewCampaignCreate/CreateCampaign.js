import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CampaignCreateConfig } from "../../../configs/CampaignCreateConfig";
import { Stepper, Toast, Button, Footer, Loader, FormComposerV2, PopUp, CardText } from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { transformCreateData } from "../../../utils/transformCreateData";
import { handleCreateValidate } from "../../../utils/handleCreateValidate";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
const CreateCampaign = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [totalFormData, setTotalFormData] = useState({});
  const [isDataCreating, setIsDataCreating] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const editName = searchParams.get("editName");
  const fromTemplate = searchParams.get("fromTemplate");
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ADMIN_CONSOLE_DATA", {});
  const [campaignConfig, setCampaignConfig] = useState(CampaignCreateConfig(totalFormData, editName, fromTemplate));
  const [loader, setLoader] = useState(null);
  const skip = searchParams.get("skip");
  const storedInfo = JSON.parse(sessionStorage.getItem("HCM_CAMPAIGN_NUMBER") || "{}");
  const id = searchParams.get("id") || storedInfo?.id;
  const isDraft = searchParams.get("draft");
  const campaignNumber = searchParams.get("campaignNumber") || storedInfo?.campaignNumber;
  const [currentKey, setCurrentKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [isValidatingName, setIsValidatingName] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const prevProjectTypeRef = useRef();
  const hasLoadedDraft = useRef(false);
  const queryClient = useQueryClient();

  const updateUrlParams = (params) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  };

  const normalizeDate = (date) => {
    if (!date) return "";
    if (typeof date === "number") {
      return Digit.DateUtils.ConvertEpochToDate(date)?.split("/")?.reverse()?.join("-");
    }
    return date;
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onSecondayActionClick = () => {
  if (currentKey > 1) {
    // Clear campaign name when going back to step 1 (only for new campaigns, not edit/clone)
    if (currentKey === 2 && !editName && !campaignNumber) {
      setParams((prev) => {
        const { CampaignName, ...rest } = prev;
        return rest;
      });
      // Reset project type reference for proper change detection
      prevProjectTypeRef.current = null;
    }
    setCurrentKey(currentKey - 1);
  }
};

  const { isLoading: draftLoading, data: draftData, error: draftError, refetch: draftRefetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
      // campaignNumber: campaignNumber
    },
    config: {
      enabled: id || campaignNumber ? true : false,
      select: (data) => {
        return data?.[0];
      },
    },
  });
  const transformDraftDataToFormData = (draftData) => {
    const restructureFormData = {
      ...draftData,
      CampaignType: typeof draftData?.projectType === "string" ? { code: draftData.projectType } : draftData?.projectType,
      CampaignName: draftData?.campaignName,
      DateSelection: {
        startDate: draftData?.startDate ? Digit.DateUtils.ConvertEpochToDate(draftData?.startDate)?.split("/")?.reverse()?.join("-") : "",
        endDate: draftData?.endDate ? Digit.DateUtils.ConvertEpochToDate(draftData?.endDate)?.split("/")?.reverse()?.join("-") : "",
      },
      SelectHierarchy: draftData?.hierarchyType
        ? { hierarchy: Digit.SessionStorage.get("HCM_CAMPAIGN_SELECTED_HIERARCHY")?.name === draftData.hierarchyType
            ? Digit.SessionStorage.get("HCM_CAMPAIGN_SELECTED_HIERARCHY")
            : { name: draftData.hierarchyType } }
        : undefined,
    };
    return restructureFormData;
  };

  useEffect(() => {
    if (draftLoading) return;
    if (fromTemplate) return;
    if (hasLoadedDraft.current) return;
    if (!draftData) return;
    hasLoadedDraft.current = true;
    const restructureFormData = transformDraftDataToFormData(draftData);
    setParams({ ...restructureFormData });
  }, [draftData]);

  useEffect(() => {
    setTotalFormData(params);
  }, [params]);

  useEffect(() => {
    if (!id) {
      Digit.SessionStorage.del("HCM_CAMPAIGN_SELECTED_HIERARCHY");
      Digit.SessionStorage.del("HCM_CAMPAIGN_SELECTED_HIERARCHY_CODE");
    }
  }, []);

  useEffect(() => {
    updateUrlParams({ key: currentKey });
  }, [currentKey]);

  const filterCampaignConfig = (campaignConfig, currentKey) => {
    return campaignConfig
      .map((config) => {
        return {
          ...config,
          form: config?.form.filter((step) => parseInt(step.key) === currentKey),
        };
      })
      .filter((config) => config.form.length > 0);
  };

  const [filteredCreateConfig, setfilteredCreateConfig] = useState(filterCampaignConfig(campaignConfig, currentKey));

  useEffect(() => {
    setfilteredCreateConfig(filterCampaignConfig(campaignConfig, currentKey, editName));
  }, [campaignConfig, currentKey]);

  const config = filteredCreateConfig?.[0];

  const reqCreate = {
    url: `/project-factory/v1/project-type/create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const reqUpdate = {
    url: `/project-factory/v1/project-type/update`,
    params: {},
    body: {},
    config: {
      enabled: false,
    },
  };

  const mutationCreate = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);

  const fetchValidCampaignName = async (tenantId, formData) => {
    const res = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/project-type/search`,
      body: {
        CampaignDetails: {
          tenantId: tenantId,
          campaignName: formData?.CampaignName,
        },
      },
    });
    return res?.CampaignDetails;
  };

  const fetchLatestCampaignData = async () => {
    if (!id) return null;
    const res = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/project-type/search`,
      body: {
        CampaignDetails: {
          tenantId: tenantId,
          ids: [id],
        },
      },
    });
    return res?.CampaignDetails?.[0];
  };

  const cleanupSessionAndNavigate = (campNumber, campTenantId) => {
    Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_DATA");
    Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
    Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
    Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_SET_UP");
    Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
    Digit.SessionStorage.del("CAMPAIGN_NAME_INFO_VISIBLE");
    Digit.SessionStorage.del("HCM_CAMPAIGN_SELECTED_HIERARCHY");
    Digit.SessionStorage.del("HCM_CAMPAIGN_SELECTED_HIERARCHY_CODE");
    const baseUrl = `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campNumber}&tenantId=${campTenantId}`;
    navigate(isDraft === "true" ? `${baseUrl}&draft=true` : baseUrl);
  };

  const handleCampaignMutation = async (formData, hasDateChanged = false) => {
    const sessionHierarchy = Digit.SessionStorage.get("HCM_CAMPAIGN_SELECTED_HIERARCHY");
    const hierarchyType = sessionHierarchy?.name || formData?.SelectHierarchy?.hierarchy?.name || params?.SelectHierarchy?.hierarchy?.name;
    const isEdit = !!(editName || campaignNumber || id);
    const hierarchyChanged = !!(params?.hierarchyType && hierarchyType && params.hierarchyType !== hierarchyType);

    // For edit campaigns with no hierarchy change, skip the update call entirely
    if (isEdit && !hierarchyChanged) {
      setShowToast({ key: "success", label: t(I18N_KEYS.PAGES.HCM_UPDATE_SUCCESS) });
      queryClient.invalidateQueries({ queryKey: ["SEARCH_CAMPAIGN"] });
      setTimeout(() => {
        cleanupSessionAndNavigate(campaignNumber || params?.campaignNumber, tenantId);
      }, 2000);
      return;
    }

    setLoader(true);

    // For edit campaigns with hierarchy change, fetch fresh campaign data from server
    // to avoid using stale params (e.g. after a recent date update)
    let effectiveParams = params;
    if (isEdit && hierarchyChanged && id) {
      try {
        const freshData = await fetchLatestCampaignData();
        if (freshData) {
          effectiveParams = transformDraftDataToFormData(freshData);
        }
      } catch (e) {
        // Fall back to params if fetch fails
      }
    }

    const mutation = isEdit ? mutationUpdate : mutationCreate;
    const url = isEdit ? `/project-factory/v1/project-type/update` : `/project-factory/v1/project-type/create`;

    const payload = transformCreateData({
      totalFormData,
      hierarchyType,
      params: effectiveParams,
      formData,
      ...(isEdit ? { id } : {}),
      hasDateChanged,
      hierarchyChanged,
    });

    await mutation.mutate(
      {
        url: url,
        body: payload,
        config: { enable: true },
      },
      {
        onSuccess: async (result) => {
          setShowToast({
            key: "success",
            label: t(editName ? I18N_KEYS.PAGES.HCM_UPDATE_SUCCESS : I18N_KEYS.PAGES.HCM_DRAFT_SUCCESS),
          });
          queryClient.invalidateQueries({ queryKey: ["SEARCH_CAMPAIGN"] });
          setTimeout(() => {
            cleanupSessionAndNavigate(result?.CampaignDetails?.campaignNumber, result?.CampaignDetails?.tenantId);
            setLoader(false);
          }, 2000);
        },
        onError: () => {
          setShowToast({ key: "error", label: t(I18N_KEYS.COMMON.HCM_ERROR_IN_CAMPAIGN_CREATION) });
          setLoader(false);
        },
      }
    );
  };

  const handleDateUpdateOnPopup = async () => {
    setShowPopUp(false);
    if (!pendingFormData) return;

    setLoader(true);

    const newDates = pendingFormData?.campaignDates || pendingFormData?.DateSelection;

    const updatedParams = {
      ...params,
      ...pendingFormData,
      CampaignName: params?.CampaignName,
      CampaignType: params?.CampaignType,
      DateSelection: newDates
        ? { startDate: newDates.startDate, endDate: newDates.endDate }
        : params?.DateSelection,
    };

    const sessionHierarchy = Digit.SessionStorage.get("HCM_CAMPAIGN_SELECTED_HIERARCHY");
    const hierarchyType = sessionHierarchy?.name || updatedParams?.SelectHierarchy?.hierarchy?.name || updatedParams?.hierarchyType;

    const payload = transformCreateData({
      totalFormData,
      hierarchyType,
      params: updatedParams,
      formData: pendingFormData,
      id,
      hasDateChanged: true,
      hierarchyChanged: false,
    });

    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/project-type/update`,
        body: payload,
        config: { enable: true },
      },
      {
        onSuccess: async (result) => {
          setShowToast({ key: "success", label: t(I18N_KEYS.PAGES.HCM_UPDATE_SUCCESS) });
          const updatedCampaign = result?.CampaignDetails;
          if (updatedCampaign) {
            const restructuredData = transformDraftDataToFormData(updatedCampaign);
            setParams({ ...restructuredData });
          }
          setLoader(false);
          setPendingFormData(null);
          setCurrentKey(currentKey + 1);
        },
        onError: (error) => {
          setShowToast({ key: "error", label: t(I18N_KEYS.COMMON.HCM_ERROR_IN_CAMPAIGN_CREATION) });
          setLoader(false);
          setPendingFormData(null);
        },
      }
    );
  };

  const onSubmit = async (formData) => {
    const projectType = formData?.CampaignType?.code || params?.CampaignType?.code;
    const name = filteredCreateConfig?.[0]?.form?.[0]?.name;

    // Check if project type changed early - before other validations
    const prevProjectType = prevProjectTypeRef.current;
    const isProjectTypeChanged = prevProjectType && prevProjectType !== projectType;

    const validDates = handleCreateValidate(formData);
    if (validDates?.label) {
      setShowToast({ key: "error", label: t(validDates.label) });
      return;
    }

    setTotalFormData((prevData) => ({
      ...prevData,
      [name]: formData,
    }));

    // Skip campaign name validation if project type changed (name will be reset)
    if (formData?.CampaignName && !editName && !campaignNumber && !isProjectTypeChanged) {
      const campaignNamePattern = /^(?!.*[ _-]{2})(?!^[\s_-])(?!.*[\s_-]$)(?=^[A-Za-z][A-Za-z0-9 _\-\(\)]{4,29}$)^.*$/;
      if (!campaignNamePattern.test(formData?.CampaignName)) {
        setShowToast({ key: "error", label: t(I18N_KEYS.CAMPAIGN_CREATE.CAMPAIGN_NAME_INVALID_FORMAT) });
        return;
      }
      if (formData?.CampaignName?.length > 30) {
        setShowToast({ key: "error", label: "CAMPAIGN_NAME_LONG_ERROR" });
        return;
      } else {
        setShowToast(null);
      }
      setIsValidatingName(true);
      let temp = await fetchValidCampaignName(tenantId, formData);
      if (temp.length != 0) {
        setShowToast({ key: "error", label: t(I18N_KEYS.COMMON.CAMPAIGN_NAME_ALREADY_EXIST) });
        setIsValidatingName(false);
        return;
      } else {
        setShowToast(null);
      }
      setIsValidatingName(false);
    }
    // Date validation checks - only on HCM_CAMPAIGN_DATE step
    if (name === "HCM_CAMPAIGN_DATE" && formData?.DateSelection) {
      const { startDate, endDate } = formData.DateSelection;
      if (!startDate || !endDate) {
        setShowToast({ key: "error", label: t(I18N_KEYS.COMMON.HCM_CAMPAIGN_DATE_MISSING) });
        return;
      }
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      if (start >= end) {
        setShowToast({ key: "error", label: t(I18N_KEYS.COMMON.HCM_CAMPAIGN_END_DATE_BEFORE_START_DATE) });
        return;
      }
    }

    // Sync campaignDates (from CampaignDates component) to DateSelection so downstream code reads correct dates
    const dateSync = formData?.campaignDates
      ? { DateSelection: { startDate: formData.campaignDates.startDate, endDate: formData.campaignDates.endDate } }
      : {};

    const isCampaignNameMissing = typeof params?.CampaignName === "object" || !params?.CampaignName;

    if ((isCampaignNameMissing || isProjectTypeChanged) && !editName && !campaignNumber) {
      const formattedDate = new Date()
        .toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })
        .replace(/ /g, "_")
        .toLowerCase();

      const campaignName = `${projectType}_${formattedDate}`;

      setParams({ ...params, ...formData, ...dateSync, CampaignName: campaignName });

      // Update the formData itself if needed
      setTotalFormData((prevData) => ({
        ...prevData,
        [name]: {
          ...formData,
          CampaignName: campaignName,
        },
      }));
    } else {
      setParams({ ...params, ...formData, ...dateSync });
    }

    prevProjectTypeRef.current = projectType;

    const oldStartDate = normalizeDate(params?.startDate);
    const oldEndDate = normalizeDate(params?.endDate);
    const newStartDate = formData?.campaignDates?.startDate ?? formData?.DateSelection?.startDate ?? params?.DateSelection?.startDate;
    const newEndDate = formData?.campaignDates?.endDate ?? formData?.DateSelection?.endDate ?? params?.DateSelection?.endDate;

    const hasDateChanged = oldStartDate !== newStartDate || oldEndDate !== newEndDate;

    if (!filteredCreateConfig?.[0]?.form?.[0]?.last) {
      if (name === "HCM_CAMPAIGN_DATE" && hasDateChanged) {
        // Only clear cycle data / show popup when there's existing data to clear (edit campaigns)
        const hasExistingData = params?.deliveryRules?.length > 0 || params?.additionalDetails?.cycleData?.cycleData?.length > 0;
        if (hasExistingData) {
          setParams((prev) => ({
            ...prev,
            ...dateSync,
            additionalDetails: {
              ...(prev?.additionalDetails || {}),
              cycleData: [],
              cycleConfgureDate: undefined,
            },
          }));
          if (params?.deliveryRules?.length > 0) {
            setPendingFormData(formData);
            setShowPopUp(true);
            return;
          }
        }
      }
      setShowToast(null);
      setCurrentKey(currentKey + 1);
    } else {
      const sessionHierarchy = Digit.SessionStorage.get("HCM_CAMPAIGN_SELECTED_HIERARCHY");
      const hierarchySelected = sessionHierarchy || formData?.SelectHierarchy?.hierarchy || params?.SelectHierarchy?.hierarchy;
      if (!hierarchySelected) {
        setShowToast({ key: "error", label: t("HCM_SELECT_HIERARCHY_REQUIRED") });
        return;
      }
      const isBoundaryLoading = formData?.SelectHierarchy?.isBoundaryLoading ?? params?.SelectHierarchy?.isBoundaryLoading;
      if (isBoundaryLoading) {
        setShowToast({ key: "info", label: t("HCM_BOUNDARY_DATA_LOADING") });
        return;
      }
      const hasBoundaryData = formData?.SelectHierarchy?.hasBoundaryData ?? params?.SelectHierarchy?.hasBoundaryData;
      if (!hasBoundaryData) {
        setShowToast({ key: "error", label: t("HCM_NO_BOUNDARY_DATA_FOR_HIERARCHY") });
        return;
      }
      handleCampaignMutation(formData, hasDateChanged);
    }
  };
  const onStepperClick = (step) => {
    const filteredSteps = campaignConfig[0].form.filter((item) => item.stepCount === String(step + 1));

    const key = parseInt(filteredSteps[0].key);
    const name = filteredSteps?.[0]?.name;
    if (Object.keys(totalFormData).includes(name)) {
      setCurrentKey(step + 1);
    } else return;
  };
  return (
    <React.Fragment>
      {(loader || isValidatingName) && (
        <Loader
          page={true}
          variant={"OverlayLoader"}
          loaderText={isValidatingName ? t(I18N_KEYS.COMMON.VALIDATING_CAMPAIGN_NAME) : t(I18N_KEYS.COMMON.PLEASE_WAIT_WHILE_UPDATING)}
        />
      )}
      <Stepper
        customSteps={["HCM_CAMPAIGN_TYPE_DETAILS", "HCM_CAMPAIGN_NAME_DETAILS", "HCM_CAMPAIGN_DATE_DETAILS", "HCM_CAMPAIGN_HIERARCHY_DETAILS"]}
        currentStep={currentKey}
        onStepClick={onStepperClick}
        activeSteps={currentKey}
        className={"campaign-stepper"}
      />
      <FormComposerV2
        config={config?.form.map((config) => {
          return {
            ...config,
            body: config?.body.filter((a) => !a.hideInEmployee),
          };
        })}
        onSubmit={onSubmit}
        defaultValues={params}
        showSecondaryLabel={currentKey > 1 ? true : false}
        secondaryLabel={t(I18N_KEYS.COMMON.HCM_BACK)}
        actionClassName={"actionBarClass"}
        className="setup-campaign"
        noCardStyle={currentKey === 3 || currentKey === 4}
        onSecondayActionClick={onSecondayActionClick}
        isDisabled={isDataCreating}
        label={filteredCreateConfig?.[0]?.form?.[0]?.last === true ? t(I18N_KEYS.COMMON.HCM_SUBMIT) : t(I18N_KEYS.COMMON.HCM_NEXT)}
        noBreakLine={true}
        secondaryActionIcon={"ArrowBack"}
        primaryActionIconAsSuffix={true}
        primaryActionIcon={"ArrowForward"}
      />
      {showPopUp && (
        <PopUp
          className={"deliveries-pop-module"}
          type={"warning"}
          heading={t(I18N_KEYS.CAMPAIGN_CREATE.ES_CAMPAIGN_UPDATE_DELIVERY_DETAILS)}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>
                {t("ES_CAMPAIGN_DATE_CHANGE_DESCRIPTION") !== "ES_CAMPAIGN_DATE_CHANGE_DESCRIPTION"
                  ? t("ES_CAMPAIGN_DATE_CHANGE_DESCRIPTION")
                  : "Updating the campaign dates will clear all existing delivery rules and cycle configurations. You will need to reconfigure them after the update."}
              </CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t(I18N_KEYS.CAMPAIGN_CREATE.ES_CAMPAIGN_DELIVERY_BACK)}
              title={t(I18N_KEYS.CAMPAIGN_CREATE.ES_CAMPAIGN_DELIVERY_BACK)}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t(I18N_KEYS.CAMPAIGN_CREATE.ES_CAMPAIGN_DELIVERY_SUBMIT)}
              title={t(I18N_KEYS.CAMPAIGN_CREATE.ES_CAMPAIGN_DELIVERY_SUBMIT)}
              onClick={handleDateUpdateOnPopup}
            />,
          ]}
          sortFooterChildren={true}
        ></PopUp>
      )}
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
    </React.Fragment>
  );
};

export default CreateCampaign;
