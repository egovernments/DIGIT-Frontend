import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignCreateConfig } from "../../../configs/CampaignCreateConfig";
import { Stepper, Toast, Button, Footer, Loader, FormComposerV2 } from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { transformCreateData } from "../../../utils/transformCreateData";
import { handleCreateValidate } from "../../../utils/handleCreateValidate";
const CreateCampaign = ({ hierarchyType, hierarchyData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [totalFormData, setTotalFormData] = useState({});
  const [isDataCreating, setIsDataCreating] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const editName = searchParams.get("editName");
  const [campaignConfig, setCampaignConfig] = useState(CampaignCreateConfig(totalFormData, editName));
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ADMIN_CONSOLE_DATA", {});
  const [loader, setLoader] = useState(null);
  const skip = searchParams.get("skip");
  const id = searchParams.get("id");
  const isDraft = searchParams.get("draft");
  const campaignNumber = searchParams.get("campaignNumber");
  const [currentKey, setCurrentKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [isValidatingName, setIsValidatingName] = useState(false);

  const updateUrlParams = (params) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onSecondayActionClick = () => {
    if (currentKey > 1) {
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
    };
    return restructureFormData;
  };

  useEffect(() => {
    if (draftLoading) return;
    // if (Object.keys(params).length !== 0) return;
    // if (!draftData) return;
    const restructureFormData = transformDraftDataToFormData(draftData);
    setParams({ ...restructureFormData });
  }, [draftData]);

  useEffect(() => {
    setTotalFormData(params);
  }, [params]);

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

  const onSubmit = async (formData) => {
    const projectType = formData?.CampaignType?.code;

    const validDates = handleCreateValidate(formData);
    if (validDates?.label) {
      setShowToast({ key: "error", label: t(validDates.label) });
      return;
    }
    const name = filteredCreateConfig?.[0]?.form?.[0]?.name;
    setTotalFormData((prevData) => ({
      ...prevData,
      [name]: formData,
    }));

    if (formData?.CampaignName && !editName) {
      if (formData?.CampaignName?.length > 30) {
        setShowToast({ key: "error", label: "CAMPAIGN_NAME_LONG_ERROR" });
        return;
      }
      setIsValidatingName(true);
      let temp = await fetchValidCampaignName(tenantId, formData);
      if (temp.length != 0) {
        setShowToast({ key: "error", label: t("CAMPAIGN_NAME_ALREADY_EXIST") });
        setIsValidatingName(false);
        return;
      }
      setIsValidatingName(false);
    }

    if (typeof params?.CampaignName === "object" || !params?.CampaignName) {
      const formattedDate = new Date()
        .toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })
        .replace(/ /g, "_")
        .toLowerCase();

      const campaignName = `${projectType}_${formattedDate}`;

      setParams({ ...params, ...formData, CampaignName: campaignName });
    } else {
      setParams({ ...params, ...formData });
    }

    if (!filteredCreateConfig?.[0]?.form?.[0]?.last) {
      setCurrentKey(currentKey + 1);
    } else {
      setLoader(true);
      const isEdit = editName;
      const mutation = isEdit ? mutationUpdate : mutationCreate;
      const url = isEdit ? `/project-factory/v1/project-type/update` : `/project-factory/v1/project-type/create`;
      const payload = transformCreateData({
        totalFormData,
        hierarchyType,
        params,
        formData,
        ...(isEdit ? { id } : {}),
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
              label: t(editName ? "HCM_UPDATE_SUCCESS" : "HCM_DRAFT_SUCCESS"),
            });
            setTimeout(() => {
              // history.replace(
              //   `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${result?.CampaignDetails?.campaignNumber}&tenantId=${result?.CampaignDetails?.tenantId}&draft=${isDraft}`
              // );
              if (isDraft === "true") {
                navigate(
                  `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${result?.CampaignDetails?.campaignNumber}&tenantId=${result?.CampaignDetails?.tenantId}&draft=${isDraft}`
                );
              } else {
                navigate(
                  `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${result?.CampaignDetails?.campaignNumber}&tenantId=${result?.CampaignDetails?.tenantId}`
                );
              }
              setLoader(false);
            }, 2000);
          },
          onError: () => {
            setShowToast({ key: "error", label: t("HCM_ERROR_IN_CAMPAIGN_CREATION") });
            setLoader(false);
          },
        }
      );
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
          loaderText={isValidatingName ? t("VALIDATING_CAMPAIGN_NAME") : t("PLEASE_WAIT_WHILE_UPDATING")}
        />
      )}
      <Stepper
        customSteps={["HCM_CAMPAIGN_TYPE_DETAILS", "HCM_CAMPAIGN_NAME_DETAILS", "HCM_CAMPAIGN_DATE_DETAILS"]}
        currentStep={currentKey}
        onStepClick={onStepperClick}
        activeSteps={currentKey}
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
        secondaryLabel={t("HCM_BACK")}
        actionClassName={"actionBarClass"}
        className="setup-campaign"
        noCardStyle={currentKey === 3}
        onSecondayActionClick={onSecondayActionClick}
        isDisabled={isDataCreating}
        label={filteredCreateConfig?.[0]?.form?.[0]?.last === true ? t("HCM_SUBMIT") : t("HCM_NEXT")}
        // secondaryActionIcon={"ArrowBack"}
        // primaryActionIconAsSuffix={true}
        // primaryActionIcon={"ArrowDirection"}
      />
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )}
    </React.Fragment>
  );
};

export default CreateCampaign;
