import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignCreateConfig } from "../../../configs/CampaignCreateConfig";
import { Stepper, Toast, Button, Footer, Loader, FormComposerV2, PopUp, CardText } from "@egovernments/digit-ui-components";
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
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ADMIN_CONSOLE_DATA", {});
  const [campaignConfig, setCampaignConfig] = useState(CampaignCreateConfig(totalFormData, editName));
  const [loader, setLoader] = useState(null);
  const skip = searchParams.get("skip");
  const storedInfo = JSON.parse(sessionStorage.getItem("HCM_CAMPAIGN_NUMBER") || "{}");
  const id = searchParams.get("id");
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

  const handleCampaignMutation = async (formData, hasDateChanged = false) => {
    setLoader(true);
    const isEdit = editName || campaignNumber;
    const mutation = isEdit ? mutationUpdate : mutationCreate;
    const url = isEdit ? `/project-factory/v1/project-type/update` : `/project-factory/v1/project-type/create`;
    const payload = transformCreateData({
      totalFormData,
      hierarchyType,
      params,
      formData,
      ...(isEdit ? { id } : {}),
      hasDateChanged,
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
            const baseUrl = `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${result?.CampaignDetails?.campaignNumber}&tenantId=${result?.CampaignDetails?.tenantId}`;
            navigate(isDraft === "true" ? `${baseUrl}&draft=true` : baseUrl);
            setLoader(false);
          }, 2000);
        },
        onError: () => {
          setShowToast({ key: "error", label: t("HCM_ERROR_IN_CAMPAIGN_CREATION") });
          setLoader(false);
        },
      }
    );
  };

  const onSubmit = async (formData) => {
    const projectType = formData?.CampaignType?.code || params?.CampaignType?.code;

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

    if (formData?.CampaignName && !editName && !campaignNumber) {
      if (formData?.CampaignName?.length > 30) {
        setShowToast({ key: "error", label: "CAMPAIGN_NAME_LONG_ERROR" });
        return;
      } else {
        setShowToast(null);
      }
      setIsValidatingName(true);
      let temp = await fetchValidCampaignName(tenantId, formData);
      if (temp.length != 0) {
        setShowToast({ key: "error", label: t("CAMPAIGN_NAME_ALREADY_EXIST") });
        setIsValidatingName(false);
        return;
      } else {
        setShowToast(null);
      }
      setIsValidatingName(false);
    }

    const prevProjectType = prevProjectTypeRef.current;

    const isProjectTypeChanged = prevProjectType && prevProjectType !== projectType;
    const isCampaignNameMissing = typeof params?.CampaignName === "object" || !params?.CampaignName;

    if (isCampaignNameMissing || isProjectTypeChanged) {
      const formattedDate = new Date()
        .toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })
        .replace(/ /g, "_")
        .toLowerCase();

      const campaignName = `${projectType}_${formattedDate}`;

      setParams({ ...params, ...formData, CampaignName: campaignName });

      // Update the formData itself if needed
      setTotalFormData((prevData) => ({
        ...prevData,
        [name]: {
          ...formData,
          CampaignName: campaignName,
        },
      }));
    } else {
      setParams({ ...params, ...formData });
    }

    prevProjectTypeRef.current = projectType;

    const oldStartDate = normalizeDate(params?.startDate);
    const oldEndDate = normalizeDate(params?.endDate);
    const newStartDate = formData?.DateSelection?.startDate;
    const newEndDate = formData?.DateSelection?.endDate;

    const hasDateChanged = oldStartDate !== newStartDate || oldEndDate !== newEndDate;

    if (!filteredCreateConfig?.[0]?.form?.[0]?.last) {
      setShowToast(null);
      setCurrentKey(currentKey + 1);
    } else {
      if (hasDateChanged && params?.deliveryRules) {
        setParams((prev) => ({
          ...prev,
          additionalDetails: {
            ...(prev?.additionalDetails || {}),
            cycleData: [],
            cycleConfgureDate: undefined,
          },
        }));
        setPendingFormData(formData);
        setShowPopUp(true);
        return;
      }
      handleCampaignMutation(formData);
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
        secondaryLabel={t("HCM_BACK")}
        actionClassName={"actionBarClass"}
        className="setup-campaign"
        noCardStyle={currentKey === 3}
        onSecondayActionClick={onSecondayActionClick}
        isDisabled={isDataCreating}
        label={filteredCreateConfig?.[0]?.form?.[0]?.last === true ? t("HCM_SUBMIT") : t("HCM_NEXT")}
        noBreakLine={true}
        // secondaryActionIcon={"ArrowBack"}
        // primaryActionIconAsSuffix={true}
        // primaryActionIcon={"ArrowDirection"}
      />
      {showPopUp && (
        <PopUp
          className={"deliveries-pop-module"}
          type={"warning"}
          heading={t("ES_CAMPAIGN_UPDATE_DELIVERY_DETAILS")}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t("ES_CAMPAIGN_UPDATE_TYPE_MODAL_TEXT") + " "}</CardText>
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
              label={t("ES_CAMPAIGN_DELIVERY_BACK")}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("ES_CAMPAIGN_DELIVERY_SUBMIT")}
              onClick={() => {
                setShowPopUp(false);
                if (pendingFormData) {
                  handleCampaignMutation(pendingFormData, true);
                }
              }}
            />,
          ]}
          sortFooterChildren={true}
        ></PopUp>
      )}
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
