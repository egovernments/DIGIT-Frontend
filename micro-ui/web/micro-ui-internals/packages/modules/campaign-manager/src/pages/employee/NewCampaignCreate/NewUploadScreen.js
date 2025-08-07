import { FormComposerV2, Loader, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { uploadConfig } from "../../../configs/uploadConfig";
import { transformCreateData } from "../../../utils/transformCreateData";

import { CONSOLE_MDMS_MODULENAME } from "../../../Module";



const NewUploadScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [totalFormData, setTotalFormData] = useState({});
  const [showToast, setShowToast] = useState(false);
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

  const hirechyType = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID")?.hierarchyType || null;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  //const id = searchParams.get("id");
  const id = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_DATA")?.id;
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const updateUrlParams = (params) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  };

  const { data: baseTimeOut } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "baseTimeout" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.baseTimeout` }
  );


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
  const { mutate: updateMapping } = Digit.Hooks.campaign.useUpdateAndUploadExcel(tenantId);

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

  // INFO:: To autometically close the toast message after 3 seconds
  const showErrorToast = (messageKey) => {
    setShowToast({ key: "error", label: messageKey });

    setTimeout(() => {
      setShowToast(false); // Close the toast
    }, 3000); // adjust the time as needed
  };


  useEffect(() => {
    setfilteredConfig(filterUploadConfig(config, currentKey, summaryErrors));
  }, [config, currentKey, summaryErrors]);

  const latestConfig = filteredConfig?.[0];

  // const restructureData = (params, apiResources, formData) => {
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
    const type = filteredConfig?.[0]?.form?.[0]?.body?.[0]?.customProps?.type;

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
        showErrorToast(t("TARGET_DETAILS_ERROR"));
        return;
      }
      if (isFacilityError) {
        showErrorToast(t("FACILITY_DETAILS_ERROR"));
        return;
      }
      if (isUserError) {
        showErrorToast(t("USER_DETAILS_ERROR"));
        return;
      }
      setShowToast(null);
      navigate(
        `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
      );
    }
    else if (name === "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA_MAPPING" && formData?.uploadFacilityMapping?.data?.length > 0) {

      setLoader(true);

      const isAnyFacilityActive = formData?.uploadFacilityMapping?.data?.some(
        item => item.HCM_ADMIN_CONSOLE_FACILITY_USAGE === "Active"
      );

      if (!isAnyFacilityActive) {
        setLoader(false);
        showErrorToast(t("ONE_FACILITY_ATLEAST_SHOULD_BE_ACTIVE"))
        //setShowToast({ key: "error", label: t("ONE_FACILITY_ATLEAST_SHOULD_BE_ACTIVE") });
        return;
      }

      const schemas = formData?.uploadFacilityMapping?.schemas;
      const checkValid = formData?.uploadFacilityMapping?.data?.some(
        (item) =>
          item?.[(schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active" &&
          (!item?.[(schemas?.find((i) => i.description === "Boundary Code")?.name)] ||
            item?.[(schemas?.find((i) => i.description === "Boundary Code")?.name)]?.length === 0)
      );
      if (checkValid) {
        setLoader(false);
        showErrorToast(t("NO_BOUNDARY_SELECTED_FOR_ACTIVE_FACILITY"));
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
            showErrorToast(error);
          },
          onSuccess: async (data) => {
            try {

              const useProcess = await Digit.Hooks.campaign.useProcessData(
                [{ filestoreId: data }],
                hirechyType,
                `${type}Validation`,
                tenantId,
                id,
                baseTimeOut?.[CONSOLE_MDMS_MODULENAME]
              );


              const campaignDetails = {
                ...campaignData, "resources": [
                  {
                    "type": type,
                    "filename": params?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile[0].filename,
                    "filestoreId": data
                  }
                ]
              }

              const responseTemp = await Digit.CustomService.getResponse({
                url: "/project-factory/v1/project-type/update",
                body: {
                  CampaignDetails: campaignDetails,
                },
              });


              const secondApiResponse = await Digit.CustomService.getResponse({
                url: `/project-factory/v1/data/_search`,
                body: {
                  SearchCriteria: {
                    tenantId: tenantId,
                    id: [useProcess?.id],
                    type: useProcess?.type
                  },
                },
              });


              const temp = totalFormData?.["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]?.uploadFacility?.uploadedFile?.[0];
              const restructureTemp = {
                ...temp,
                resourceId: useProcess?.id,
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


              setParams({
                ...params,
                ["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]: {
                  uploadFacility: {
                    ...params?.["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]?.uploadFacility,
                    uploadedFile: [
                      {
                        ...params?.["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]?.uploadFacility?.uploadedFile?.[0],
                        filestoreId: data,
                      },
                    ],
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

              if (!filteredConfig?.[0]?.form?.[0]?.isLast && !filteredConfig[0].form[0].body[0].mandatoryOnAPI) {
                setCurrentKey(currentKey + 1);
              }


              return;
            } catch (error) {

              if (error?.response?.data?.Errors?.[0]?.description) {
                showErrorToast(error?.response?.data?.Errors?.[0]?.description);
                setLoader(false);
                return;
              } else {
                showErrorToast(t("UPLOAD_MAPPING_ERROR"));
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


      const isAnyUserActive = formData?.uploadUserMapping?.data?.some(
        item => item.HCM_ADMIN_CONSOLE_USER_USAGE === "Active"
      );

      if (!isAnyUserActive) {
        setLoader(false);
        showErrorToast(t("ONE_USER_ATLEAST_SHOULD_BE_ACTIVE"))

        return;
      }

      const schemas = formData?.uploadUserMapping?.schemas;
      const checkValid = formData?.uploadUserMapping?.data?.some(
        (item) =>
          item?.[(schemas?.find((i) => i.description === "User Usage")?.name)] === "Active" &&
          (!item?.[(schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)] ||
            item?.[(schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)]?.length === 0)
      );

      if (checkValid) {
        setLoader(false);
        showErrorToast(t("NO_BOUNDARY_SELECTED_FOR_ACTIVE_USER"));
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
            showErrorToast(error);
          },
          onSuccess: async (data) => {

            try {

              const useProcess = await Digit.Hooks.campaign.useProcessData(
                [{ filestoreId: data }],
                hirechyType,
                `${type}Validation`,
                tenantId,
                id,
                baseTimeOut?.[CONSOLE_MDMS_MODULENAME]
              );


              const campaignDetails = {
                ...campaignData, "resources": [
                  {
                    "type": type,
                    "filename": params?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile[0].filename,
                    "filestoreId": data
                  }
                ]
              }

              const responseTemp = await Digit.CustomService.getResponse({
                url: "/project-factory/v1/project-type/update",
                body: {
                  CampaignDetails: campaignDetails,
                },
              });


              const secondApiResponse = await Digit.CustomService.getResponse({
                url: `/project-factory/v1/data/_search`,
                body: {
                  SearchCriteria: {
                    tenantId: tenantId,
                    id: [useProcess?.id],
                    type: useProcess?.type
                  },
                },
              });


              const temp = totalFormData?.["HCM_CAMPAIGN_UPLOAD_USER_DATA"]?.uploadUser?.uploadedFile?.[0];
              const restructureTemp = {
                ...temp,
                resourceId: useProcess?.id,
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


              setParams({
                ...params,
                ["HCM_CAMPAIGN_UPLOAD_USER_DATA"]: {
                  uploadUser: {
                    ...params?.["HCM_CAMPAIGN_UPLOAD_USER_DATA"]?.uploadUser,
                    uploadedFile: [
                      {
                        ...params?.["HCM_CAMPAIGN_UPLOAD_USER_DATA"]?.uploadUser?.uploadedFile?.[0],
                        filestoreId: data,
                      },
                    ],
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

              if (!filteredConfig?.[0]?.form?.[0]?.isLast && !filteredConfig[0].form[0].body[0].mandatoryOnAPI) {
                setCurrentKey(currentKey + 1);
              }

              return;
            } catch (error) {

              if (error?.response?.data?.Errors?.[0]?.description) {
                showErrorToast(error?.response?.data?.Errors?.[0]?.description);
                setLoader(false);
                return;
              } else {
                showErrorToast(t("UPLOAD_MAPPING_ERROR"));
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
      showErrorToast(t("ENTER_VALID_FILE"));
      return;
    }

    if (latestConfig?.form?.[0]?.last) {
      navigate(
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


      const CampaignDetails = {
        ...payload.CampaignDetails,
        "additionalDetails": campaignData?.additionalDetails
      }

      await mutationUpdate.mutate(
        {
          url: url,
          body: { CampaignDetails },
          config: { enable: true },
        },
        {
          onSuccess: async (result) => {
            setLoader(false);
            setCurrentKey(currentKey + 1);
          },
          onError: () => {
            showErrorToast(t("HCM_ERROR_IN_CAMPAIGN_CREATION"));
            setLoader(false);
          },
        }
      );
    }
  };

  const onSecondayActionClick = async () => {
    if (currentKey == 1) {
      navigate(
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
