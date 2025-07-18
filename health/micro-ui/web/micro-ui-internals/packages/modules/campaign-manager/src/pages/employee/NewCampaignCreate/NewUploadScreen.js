import { FormComposerV2, Loader, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, Fragment } from "react";
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
  const [summaryErrors, setSummaryErrors] = useState({});
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ADMIN_CONSOLE_UPLOAD_DATA", {});
  const [currentKey, setCurrentKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { mutate: updateMapping } = Digit.Hooks.campaign.useUpdateAndUploadExcel(tenantId);

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
    setUploadConfig(uploadConfig({ totalFormData, campaignData, summaryErrors }));
  }, [campaignData, totalFormData, summaryErrors]);

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
    setfilteredConfig(filterUploadConfig(config, currentKey, summaryErrors));
  }, [config, currentKey, summaryErrors]);

  const latestConfig = filteredConfig?.[0];

  // const restructureData = (params, apiResources, formData) => {
  //   console.log("params" , params , formData )
  //   const payload = {
  //     resources: [],
  //     campaignNumber: campaignData?.campaignNumber,
  //     CampaignName: campaignData?.campaignName,
  //     CampaignType: campaignData?.projectType,
  //     boundaries: campaignData?.boundaries,
  //     deliveryRules: campaignData?.deliveryRules,
  //   };

  //   const mappings = {
  //     HCM_CAMPAIGN_UPLOAD_FACILITY_DATA: "facility",
  //     HCM_CAMPAIGN_UPLOAD_USER_DATA: "user",
  //     HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA: "boundary",
  //   };

  //   Object.keys(mappings).forEach((key) => {
  //     const paramSection = params?.[key];
  //     if (!paramSection) return;

  //     const innerKey = Object.keys(paramSection)?.[0]; // e.g., "uploadBoundary"
  //     if (!innerKey) return;

  //     // Prefer formData if it contains this key
  //     const data = formData?.[innerKey] || paramSection[innerKey];

  //     if (Array.isArray(data?.uploadedFile)) {
  //       data.uploadedFile.forEach((file) => {
  //         payload.resources.push({
  //           type: mappings[key],
  //           filename: file.filename,
  //           filestoreId: file.filestoreId,
  //         });
  //       });
  //     }
  //   });

  //   console.log("payload" ,payload , formData);

  //   return payload;
  // };

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

    Object.entries(mappings).forEach(([key, type]) => {
      const paramSection = params?.[key];
      const innerKey = paramSection ? Object.keys(paramSection)[0] : null;

      // Try to get data from formData first (if innerKey is known)
      const formDataSection = innerKey ? formData?.[innerKey] : null;

      // If no innerKey from params, try to infer from formData directly
      const fallbackInnerKey = Object.keys(formData || {}).find((k) => formData[k]?.uploadedFile?.[0]?.type === type);
      const fallbackFormDataSection = formData?.[fallbackInnerKey];

      const data = formDataSection || fallbackFormDataSection || (innerKey && paramSection?.[innerKey]);

      if (Array.isArray(data?.uploadedFile)) {
        data.uploadedFile.forEach((file) => {
          payload.resources.push({
            type,
            filename: file.filename,
            filestoreId: file.filestoreId,
          });
        });
      }
    });

    return payload;
  };

  const onSubmit = async (formData) => {
    const key = Object.keys(formData)?.[0];
    const name = filteredConfig?.[0]?.form?.[0]?.name;

    console.log("formData", formData);

    if (key === "DataUploadSummary") {
      const isTargetError = totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0]?.filestoreId
        ? false
        : (setSummaryErrors((prev) => {
          return {
            ...prev,
            target: [
              {
                name: `target`,
                error: t(`TARGET_FILE_MISSING`),
              },
            ],
          };
        }),
          true);

      const isFacilityError = totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0]?.filestoreId
        ? false
        : (setSummaryErrors((prev) => {
          return {
            ...prev,
            facility: [
              {
                name: `facility`,
                error: t(`FACILITY_FILE_MISSING`),
              },
            ],
          };
        }),
          true);
      const isUserError = totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]?.filestoreId
        ? false
        : (setSummaryErrors((prev) => {
          return {
            ...prev,
            user: [
              {
                name: `user`,
                error: t(`USER_FILE_MISSING`),
              },
            ],
          };
        }),
          true);

      if (isTargetError) {
        setShowToast({ key: "error", label: "TARGET_DETAILS_ERROR" });
        return;
      }
      if (isFacilityError) {
        setShowToast({ key: "error", label: "FACILITY_DETAILS_ERROR" });
        return;
      }
      if (isUserError) {
        setShowToast({ key: "error", label: "USER_DETAILS_ERROR" });
        return;
      }
      setShowToast(null);
      history.push(
        `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
      );
    }

    else if (name === "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA_MAPPING" && formData?.uploadFacilityMapping?.data?.length > 0) {
      setLoader(true);
      const schemas = formData?.uploadFacilityMapping?.schemas;
      const checkValid = formData?.uploadFacilityMapping?.data?.some(
        (item) =>
          item?.[(schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active" &&
          (!item?.[(schemas?.find((i) => i.description === "Boundary Code")?.name)] ||
            item?.[(schemas?.find((i) => i.description === "Boundary Code")?.name)]?.length === 0)
      );

      if (checkValid) {
        setLoader(false);
        setShowToast({ key: "error", label: "NO_BOUNDARY_SELECTED_FOR_ACTIVE_FACILITY" });
        return;
      }
      await updateMapping(
        {
          arrayBuffer: formData?.uploadFacilityMapping?.arrayBuffer,
          updatedData: formData?.uploadFacilityMapping?.data,
          tenantId: tenantId,
          sheetNameToUpdate: "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES",
          schemas: schemas,
          t: t,
        },
        {
          onError: (error, variables) => {
            setLoader(false);
            setShowToast({ key: "error", label: error });
          },
          onSuccess: async (data) => {
            try {
              
              const responseTemp = await Digit.CustomService.getResponse({
                url: "/project-factory/v1/data/_create",
                body: {
                  ResourceDetails: {
                    type: "facility",
                    hierarchyType: campaignData?.hierarchyType,
                    tenantId: Digit.ULBService.getCurrentTenantId(),
                    fileStoreId: data,
                    action: "validate",
                    campaignId: id,
                    additionalDetails: {},
                  },
                },
              });

              const callSecondApiUntilComplete = async () => {
                let secondApiResponse;
                let isCompleted = false;
                let isError = false;
                while (!isCompleted && !isError) {
                  secondApiResponse = await Digit.CustomService.getResponse({
                    url: `/project-factory/v1/data/_search`,
                    body: {
                      SearchCriteria: {
                        tenantId: tenantId,
                        id: [responseTemp?.ResourceDetails?.id],
                      },
                    },
                  });

                  // Check if the response has the expected data to continue
                  if (secondApiResponse && secondApiResponse?.ResourceDetails?.[0]?.status === "completed") {
                    // Replace `someCondition` with your own condition to determine if it's complete
                    isCompleted = true;
                  } else if (secondApiResponse && secondApiResponse?.ResourceDetails?.[0]?.status === "failed") {
                    // Replace `someCondition` with your own condition to determine if it's complete
                    isError = true;
                  } else {
                    // Optionally, add a delay before retrying
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second before retrying
                  }
                }

                return secondApiResponse;
              };
              const reqCriteriaResource = await callSecondApiUntilComplete();
              if (reqCriteriaResource?.ResourceDetails?.[0]?.status === "failed") {
                setLoader(false);
                setShowToast({ key: "error", label: JSON.parse(reqCriteriaResource?.ResourceDetails?.[0]?.additionalDetails?.error)?.description });
                return;
              }
              const temp = totalFormData?.["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]?.uploadFacility?.uploadedFile?.[0];
              const restructureTemp = {
                ...temp,
                resourceId: reqCriteriaResource?.ResourceDetails?.[0]?.id,
                filestoreId: data,
              };
              setTotalFormData((prevData) => ({
                ...prevData,
                ["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]: {
                  uploadFacility: {
                    ...prevData?.["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]?.uploadFacility,
                    uploadedFile: [restructureTemp],
                  },
                },
              }));
              //to set the data in the local storage
              setParams({
                ...params,
                ["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]: {
                  uploadFacility: {
                    ...params?.["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]?.uploadFacility,
                    uploadedFile: [restructureTemp],
                  },
                },
              });
              setLoader(false);
              if (
                filteredConfig?.[0]?.form?.[0]?.isLast ||
                !filteredConfig[0].form[0].body[0].skipAPICall ||
                (filteredConfig[0].form[0].body[0].skipAPICall && id)
              ) {
                setShouldUpdate(true);
              }
              if (isChangeDates === "true" && currentKey == 6) {
                setCurrentKey(16);
              }
              if (!filteredConfig?.[0]?.form?.[0]?.isLast && !filteredConfig[0].form[0].body[0].mandatoryOnAPI) {
                setCurrentKey(currentKey + 1);
              }
              if (isDraft === "true" && isSkip !== "false") {
                updateUrlParams({ skip: "false" });
              }
              return;
            } catch (error) {
              if (error?.response?.data?.Errors?.[0]?.description) {
                setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.description });
                setLoader(false);
                return;
              } else {
                setShowToast({ key: "error", label: `UPLOAD_MAPPING_ERROR` });
                setLoader(false);
                return;
              }
            }
          },
        }
      );
      return;
    } else if (name === "HCM_CAMPAIGN_UPLOAD_USER_DATA_MAPPING" && formData?.uploadUserMapping?.data?.length > 0) {
      setLoader(true);
      const schemas = formData?.uploadUserMapping?.schemas;
      const checkValid = formData?.uploadUserMapping?.data?.some(
        (item) =>
          item?.[t(schemas?.find((i) => i.description === "User Usage")?.name)] === "Active" &&
          (!item?.[t(schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)] ||
            item?.[t(schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)]?.length === 0)
      );

      if (checkValid) {
        setLoader(false);
        setShowToast({ key: "error", label: "NO_BOUNDARY_SELECTED_FOR_ACTIVE_USER" });
        return;
      }
      await updateMapping(
        {
          arrayBuffer: formData?.uploadUserMapping?.arrayBuffer,
          updatedData: formData?.uploadUserMapping?.data,
          tenantId: tenantId,
          sheetNameToUpdate: "HCM_ADMIN_CONSOLE_USER_LIST",
          schemas,
          t: t,
        },
        {
          onError: (error, variables) => {
            setLoader(false);
            setShowToast({ key: "error", label: error });
          },
          onSuccess: async (data) => {
            try {
              const responseTemp = await Digit.CustomService.getResponse({
                url: "/project-factory/v1/data/_create",
                body: {
                  ResourceDetails: {
                    type: "user",
                    hierarchyType: campaignData?.hierarchyType,
                    tenantId: Digit.ULBService.getCurrentTenantId(),
                    fileStoreId: data,
                    action: "validate",
                    campaignId: id,
                    additionalDetails: {},
                  },
                },
              });

              const callSecondApiUntilComplete = async () => {
                let secondApiResponse;
                let isCompleted = false;
                let isError = false;
                while (!isCompleted && !isError) {
                  secondApiResponse = await Digit.CustomService.getResponse({
                    url: `/project-factory/v1/data/_search`,
                    body: {
                      SearchCriteria: {
                        tenantId: tenantId,
                        id: [responseTemp?.ResourceDetails?.id],
                      },
                    },
                  });

                  // Check if the response has the expected data to continue
                  if (secondApiResponse && secondApiResponse?.ResourceDetails?.[0]?.status === "completed") {
                    // Replace `someCondition` with your own condition to determine if it's complete
                    isCompleted = true;
                  } else if (secondApiResponse && secondApiResponse?.ResourceDetails?.[0]?.status === "failed") {
                    // Replace `someCondition` with your own condition to determine if it's complete
                    isError = true;
                  } else {
                    // Optionally, add a delay before retrying
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second before retrying
                  }
                }

                return secondApiResponse;
              };
              const reqCriteriaResource = await callSecondApiUntilComplete();
              if (reqCriteriaResource?.ResourceDetails?.[0]?.status === "failed") {
                setLoader(false);
                setShowToast({ key: "error", label: JSON.parse(reqCriteriaResource?.ResourceDetails?.[0]?.additionalDetails?.error)?.description });
                return;
              }
              const temp = totalFormData?.["HCM_CAMPAIGN_UPLOAD_USER_DATA"]?.uploadUser?.uploadedFile?.[0];
              const restructureTemp = {
                ...temp,
                resourceId: reqCriteriaResource?.ResourceDetails?.[0]?.id,
                filestoreId: data,
              };
              setTotalFormData((prevData) => ({
                ...prevData,
                ["HCM_CAMPAIGN_UPLOAD_USER_DATA"]: {
                  uploadUser: {
                    ...prevData?.["HCM_CAMPAIGN_UPLOAD_USER_DATA"]?.uploadUser,
                    uploadedFile: [restructureTemp],
                  },
                },
              }));
              //to set the data in the local storage
              setParams({
                ...params,
                ["HCM_CAMPAIGN_UPLOAD_USER_DATA"]: {
                  uploadUser: {
                    ...params?.["HCM_CAMPAIGN_UPLOAD_USER_DATA"]?.uploadUser,
                    uploadedFile: [restructureTemp],
                  },
                },
              });
              setLoader(false);
              if (
                filteredConfig?.[0]?.form?.[0]?.isLast ||
                !filteredConfig[0].form[0].body[0].skipAPICall ||
                (filteredConfig[0].form[0].body[0].skipAPICall && id)
              ) {
                setShouldUpdate(true);
              }
              if (isChangeDates === "true" && currentKey == 6) {
                setCurrentKey(16);
              }

              if (!filteredConfig?.[0]?.form?.[0]?.isLast && !filteredConfig[0].form[0].body[0].mandatoryOnAPI) {
                setCurrentKey(currentKey + 1);
              }
              if (isDraft === "true" && isSkip !== "false") {
                updateUrlParams({ skip: "false" });
              }
              return;
            } catch (error) {
              if (error?.response?.data?.Errors?.[0]?.description) {
                setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.description });
                setLoader(false);
                return;
              } else {
                setShowToast({ key: "error", label: `UPLOAD_MAPPING_ERROR` });
                setLoader(false);
                return;
              }
            }
          },
        }
      );
      return;
    }
    const { uploadFacility, uploadUser, uploadBoundary } = formData || {};

    if (
      (uploadFacility?.uploadedFile?.length !== 0 && uploadFacility?.isError === true) ||
      (uploadUser?.uploadedFile?.length !== 0 && uploadUser?.isError === true) ||
      (uploadBoundary?.uploadedFile?.length !== 0 && uploadBoundary?.isError === true)
    ) {
      setShowToast({ key: "error", label: "ENTER_VALID_FILE" });
      return;
    }

    if (latestConfig?.form?.[0]?.last) {
      history.push(
        `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
      );
    }
   

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
      setShowToast(null);
      setCurrentKey(currentKey - 1);
    }
  };

  if (loader) {
    return <Loader page={true} variant={"OverlayLoader"} loaderText={t("PLEASE_WAIT_WHILE_UPDATING")} />;
  }

  const closeToast = () => {
    setShowToast(null);
  };

  return (
    <>
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
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default NewUploadScreen;
