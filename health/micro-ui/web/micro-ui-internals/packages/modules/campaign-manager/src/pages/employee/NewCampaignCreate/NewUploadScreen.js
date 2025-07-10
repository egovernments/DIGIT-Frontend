import { FormComposerV2, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { uploadConfig } from "../../../configs/uploadConfig";
import { transformCreateData } from "../../../utils/transformCreateData";

const NewUploadScreen = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [totalFormData, setTotalFormData] = useState({});
  const [showToast, setShowToast] = useState(null);
  const [loader, setLoader] = useState(false);
  const [config, setUploadConfig] = useState(uploadConfig(totalFormData));
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ADMIN_CONSOLE_UPLOAD_DATA", {});
  const [currentKey, setCurrentKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const updateUrlParams = (params) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  };

  const reqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        campaignNumber: campaignNumber,
      },
    },
    config: {
      enabled: !!campaignNumber,
      select: (data) => {
        return data?.CampaignDetails?.[0];
      },
    },
  };

  const { isLoading, data: campaignData, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  const reqUpdate = {
    url: `/project-factory/v1/project-type/update`,
    params: {},
    body: {},
    config: {
      enabled: false,
    },
  };

  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);

  useEffect(() => {
    setTotalFormData(params);
  }, [params]);

  useEffect(() => {
    setUploadConfig(uploadConfig({ totalFormData, campaignData }));
  }, [campaignData, totalFormData]);

  useEffect(() => {
    updateUrlParams({ key: currentKey });
  }, [currentKey]);

  const filterUploadConfig = (config, currentKey) => {
    return config
      .map((config) => {
        return {
          ...config,
          form: config?.form.filter((step) => parseInt(step.key) === currentKey),
        };
      })
      .filter((config) => config.form.length > 0);
  };

  const [filteredConfig, setfilteredConfig] = useState(filterUploadConfig(config, currentKey));

  useEffect(() => {
    setfilteredConfig(filterUploadConfig(config, currentKey));
  }, [config, currentKey]);

  const latestConfig = filteredConfig?.[0];

  const restructureData = (params, apiResources, formData) => {

    const payload = {
      resources: [],
      campaignNumber: campaignData?.campaignNumber,
      CampaignName: campaignData?.campaignName,
      CampaignType: campaignData?.projectType,
      boundaries: campaignData?.boundaries,
      deliveryRules: campaignData?.deliveryRules,
    };

    const mappings = {
      HCM_CAMPAIGN_UPLOAD_FACILITY_DATA: "facility",
      HCM_CAMPAIGN_UPLOAD_USER_DATA: "user",
      HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA: "boundary",
    };

    Object.keys(mappings).forEach((key) => {
      const paramSection = params?.[key];
      if (!paramSection) return;

      const innerKey = Object.keys(paramSection)?.[0]; // e.g., "uploadBoundary"
      if (!innerKey) return;

      // Prefer formData if it contains this key
      const data = formData?.[innerKey] || paramSection[innerKey];

      if (Array.isArray(data?.uploadedFile)) {
        data.uploadedFile.forEach((file) => {
          payload.resources.push({
            type: mappings[key],
            filename: file.filename,
            filestoreId: file.filestoreId,
          });
        });
      }
    });

    return payload;
  };

  const onSubmit = async (formData) => {
    if (latestConfig?.form?.[0]?.last) {
      history.push(
        `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
      );
    }
    const name = latestConfig?.form?.[0]?.name;

    setTotalFormData((prevData) => ({
      ...prevData,
      [name]: formData,
    }));
    setParams((prevData) => ({
      ...prevData,
      [name]: formData,
    }));
    if (formData?.uploadBoundary) {
      setParams((prevData) => ({
        ...prevData,
        [name]: formData,
        HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA: formData,
      }));
    }
    {
      setLoader(true);
      const url = `/project-factory/v1/project-type/update`;
      const payload = transformCreateData({
        totalFormData,
        hierarchyType: campaignData?.hierarchyType,
        params: restructureData(params, campaignData?.resources, formData, totalFormData),
        formData,
        id: campaignData?.id,
      });

      await mutationUpdate.mutate(
        {
          url: url,
          body: payload,
          config: { enable: true },
        },
        {
          onSuccess: async (result) => {
            setLoader(false);
            setCurrentKey(currentKey + 1);
          },
          onError: () => {
            setShowToast({ key: "error", label: t("HCM_ERROR_IN_CAMPAIGN_CREATION") });
            setLoader(false);
          },
        }
      );
    }
  };

  const onSecondayActionClick = async () => {
    if (currentKey == 1) {
      history.push(
        `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
      );
    } else {
      setCurrentKey(currentKey - 1);
    }
  };

  if (loader) {
    return <Loader page={true} variant={"OverlayLoader"} loaderText={t("PLEASE_WAIT_WHILE_UPDATING")} />;
  }

  return (
    <FormComposerV2
      config={latestConfig?.form.map((config) => {
        return {
          ...config,
          body: config?.body.filter((a) => !a.hideInEmployee),
        };
      })}
      onSubmit={onSubmit}
      defaultValues={params}
      showSecondaryLabel={true}
      secondaryLabel={t("HCM_BACK")}
      actionClassName={"actionBarClass"}
      // className="setup-campaign"
      noCardStyle={true}
      onSecondayActionClick={onSecondayActionClick}
      // isDisabled={isDataCreating}
      label={config?.[0]?.form?.[0]?.last === true ? t("HCM_SUBMIT") : t("HCM_NEXT")}
      secondaryActionIcon={"ArrowBack"}
      primaryActionIconAsSuffix={true}
      primaryActionIcon={"ArrowDirection"}
    />
  );
};

export default NewUploadScreen;
