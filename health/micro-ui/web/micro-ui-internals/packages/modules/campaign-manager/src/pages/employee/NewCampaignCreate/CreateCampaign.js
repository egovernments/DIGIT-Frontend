import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { CampaignCreateConfig } from "../../../configs/CampaignCreateConfig";
import { Stepper, Toast, Button, Footer, Loader , FormComposerV2} from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { transformCreateData } from "../../../utils/transformCreateData";
import { handleCreateValidate } from "../../../utils/handleCreateValidate";
import { transformUpdateData } from "../../../utils/transformUpdateDats";
const CreateCampaign = ({ hierarchyType, hierarchyData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [totalFormData, setTotalFormData] = useState({});
  const [isDataCreating, setIsDataCreating] = useState(false);
  const [campaignConfig, setCampaignConfig] = useState(CampaignCreateConfig(totalFormData));
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ADMIN_CONSOLE_DATA", {});
  const [loader, setLoader] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const skip = searchParams.get("skip");
  const id = searchParams.get("id");
  const [currentKey, setCurrentKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });

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

  const [filteredConfig, setFilteredConfig] = useState(filterCampaignConfig(campaignConfig, currentKey));

  useEffect(() => {
    setFilteredConfig(filterCampaignConfig(campaignConfig, currentKey));
  }, [campaignConfig, currentKey]);

  const config = filteredConfig?.[0];

  const reqCreateCreate = {
    url: `/project-factory/v1/project-type/create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const reqCreateUpdate = {
    url: `/project-factory/v1/project-type/update`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };


  const mutationCreate = Digit.Hooks.useCustomAPIMutationHook(reqCreateCreate);

  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqCreateUpdate);

  const onSubmit = async (formData) => {
    const isLast = filteredConfig?.[0]?.form?.[0]?.isLast;
    const isMandatory = filteredConfig?.[0]?.form?.[0]?.callAPI;
    const projectType = formData?.CampaignType?.code;

    const validDates = handleCreateValidate(formData);
    if (validDates?.label) {
      setShowToast({ key: "error", label: t(validDates.label) });
      return;
    }
    const name = filteredConfig?.[0]?.form?.[0]?.name;
    setTotalFormData((prevData) => ({
      ...prevData,
      [name]: formData,
    }));

    if (typeof params?.CampaignName === "object" || !params?.CampaignName) {
      const formattedDate = new Date()
        .toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })
        .replace(/ /g, "_")
        .toLowerCase();

      const campaignName = `${projectType}_${formattedDate}`;

      setParams({ ...params, ...formData ,CampaignName: campaignName });
    } else {
      setParams({ ...params, ...formData });
    }

    const updatedTotalFormData = {
      ...totalFormData,
      [name]: formData,
      ...(formData?.DateSelection && !totalFormData?.HCM_CAMPAIGN_DATE ? { HCM_CAMPAIGN_DATE: { DateSelection: formData.DateSelection } } : {}),
      ...(formData?.CampaignName && !totalFormData?.HCM_CAMPAIGN_NAME ? { HCM_CAMPAIGN_NAME: { CampaignName: formData.CampaignName } } : {}),
    };

    if(isMandatory && !skip){
      setIsDataCreating(true);
      await mutationCreate.mutate(
            {
              url: `/project-factory/v1/project-type/create`,
              body: transformCreateData({ totalFormData: updatedTotalFormData, hierarchyType }),
              config: {
                enable: true,
              },
            },
            {
              onSuccess: async (result) => {
                updateUrlParams({ skip: true , id: result?.CampaignDetails?.id});
                setCurrentKey(currentKey + 1);
              },
              onError: (error, result) => {
                const errorCode = error?.response?.data?.Errors?.[0]?.code;
                setShowToast({ key: "error", label: t(errorCode) });
              },
              onSettled: () => {
                // This will always run after the mutation completes
                setIsDataCreating(false);
                // Final function logic here
              },
            }
          );
    }
    else if(currentKey == 1){
      setCurrentKey(currentKey + 1);
    }
    else{
      setIsDataCreating(true);
      await mutationUpdate.mutate(
        {
          url: `/project-factory/v1/project-type/update`,
          body: transformUpdateData({ totalFormData: updatedTotalFormData, hierarchyType , id }),
          config: {
            enable: true,
          },
        },
        {
          onSuccess: async (result) => {
            if(currentKey == 3){
            setShowToast({ key: "success", label: t("HCM_DRAFT_SUCCESS") });
            history.push(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${result?.CampaignDetails?.campaignNumber}&tenantId=${result?.CampaignDetails?.tenantId}`);
            }
            else{
              setCurrentKey(currentKey + 1);
            }
          },
          onError: (error, result) => {
            const errorCode = error?.response?.data?.Errors?.[0]?.code;
            setShowToast({ key: "error", label: t(errorCode) });
          },
          onSettled: () => {
            // This will always run after the mutation completes
            setIsDataCreating(false);
            // Final function logic here
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
      {loader && <Loader page={true} variant={"PageLoader"} loaderText={t("PLEASE_WAIT_WHILE_UPDATING")} />}
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
        label={filteredConfig?.[0]?.form?.[0]?.isLast === true ? t("HCM_SUBMIT") : t("HCM_NEXT")}
      />
      {showToast && (
        <Toast
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
