import { FormComposerV2, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CampaignConfig } from "../../configs/CampaignConfig";
import { Stepper, Toast, Button, Footer, Loader } from "@egovernments/digit-ui-components";
import {
  updateUrlParams,
  transformDraftDataToFormData,
  compareIdentical,
  resourceData,
  restructureData,
  filterCampaignConfig,
  findHighestStepCount,
} from "../../utils/setupCampaignHelpers";
import { handleValidate } from "../../utils/setupCampaignValidators";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";

/**
 * The `SetupCampaign` function in JavaScript handles the setup and management of campaign details,
 * including form data handling, validation, and submission.
 * @returns The `SetupCampaign` component is being returned. It consists of a form setup for creating
 * or updating a campaign with multiple steps like campaign details, delivery details, boundary
 * details, targets, facility details, user details, and review details. The form data is validated at
 * each step, and the user can navigate between steps using a stepper component. The form submission
 * triggers API calls to create or update the campaign
 */

const SetupCampaign = ({ hierarchyType, hierarchyData }) => {
  const resourceDatas = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_SET_UP");
  Digit.SessionStorage.set("HCM_ADMIN_CONSOLE_SET_UP", resourceDatas);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalFormData, setTotalFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignConfig, setCampaignConfig] = useState(CampaignConfig(totalFormData, null, isSubmitting));
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("HCM_CAMPAIGN_MANAGER_FORM_DATA", {});
  const [dataParams, setDataParams] = Digit.Hooks.useSessionStorage("HCM_CAMPAIGN_MANAGER_UPLOAD_ID", {});
  const [showToast, setShowToast] = useState(null);
  const [summaryErrors, setSummaryErrors] = useState({});
  const { mutate } = Digit.Hooks.campaign.useCreateCampaign(tenantId);
  const [isDataCreating, setIsDataCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { mutate: updateCampaign } = Digit.Hooks.campaign.useUpdateCampaign(tenantId);
  const { mutate: updateMapping } = Digit.Hooks.campaign.useUpdateAndUploadExcel(tenantId);
  const [loader, setLoader] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const isPreview = searchParams.get("preview");
  const isSubmit = searchParams.get("submit");
  const isSummary = searchParams.get("summary");
  const noAction = searchParams.get("action");
  const isDraft = searchParams.get("draft");
  const isSkip = searchParams.get("skip");
  const isDateRestricted = searchParams.get("date");
  const isChangeDates = searchParams.get("changeDates");
  const actionBar = searchParams.get("actionBar");
  const source = searchParams.get("source");
  const microplanName = searchParams.get("microName");
  const campaignNumber = searchParams.get("campaignNumber");
  const [isDraftCreated, setIsDraftCreated] = useState(false);
  const [currentKey, setCurrentKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [displayMenu, setDisplayMenu] = useState(null);
  const [fetchBoundary, setFetchBoundary] = useState(() => Boolean(searchParams.get("fetchBoundary")));
  const [fetchUpload, setFetchUpload] = useState(false);
  const [active, setActive] = useState(0);
  const { data: HierarchySchema } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "HierarchySchema",
        filter: `[?(@.type=='${window?.Digit?.Utils?.campaign?.getModuleName()}')]`,
      },
    ],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.HierarchySchema` }
  );
  const lowestHierarchy = useMemo(() => {
    return HierarchySchema?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.lowestHierarchy;
  }, [HierarchySchema]);

  const { data: DeliveryConfig } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    {
      select: (data) => {
        return data?.["HCM-PROJECT-TYPES"]?.projectTypes;
      },
    },
    { schemaCode: `${"HCM-PROJECT-TYPES"}.projectTypes` }
  );

  const reqCriteria = useMemo(() => {
    return {
      url: `/boundary-service/boundary-hierarchy-definition/_search`,
      changeQueryName: `${hierarchyType}`,
      body: {
        BoundaryTypeHierarchySearchCriteria: {
          tenantId: tenantId,
          limit: 2,
          offset: 0,
          hierarchyType: hierarchyType,
        },
      },
    };
  }, [tenantId, hierarchyType]);

  const { data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  const { isLoading: draftLoading, data: draftData, error: draftError, refetch: draftRefetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
    },
    config: {
      enabled: id ? true : false,
      select: (data) => {
        return data?.[0];
      },
    },
  });

  useEffect(() => {
    if (isPreview === "true") {
      setIsDraftCreated(true);
      setCurrentKey(16);
    } else if (isDraft === "true") {
      setIsDraftCreated(true);
      if (isSkip === "false") {
        if (currentKey === 1) setCurrentKey(1);
        //if user comes from set up microplan
      } else if (source === "microplan") {
        setCurrentKey(2);
        //if the campaign is in draft and the start date is passed
      } else if (isDateRestricted === "true") {
        setCurrentKey(3);
      } else {
        if (draftData?.additionalDetails?.key === 7 || draftData?.additionalDetails?.key === 8) {
          setCurrentKey(6);
        }
        //  else {
        //   setCurrentKey(draftData?.additionalDetails?.key);
        // }
      }
    }
  }, [isPreview, isDraft, draftData]);

  const getCurrentKey = () => {
    const key = Number((/key=([^&]+)/.exec(location.search) || [])[1]);
    setCurrentKey(key);
  };

  useEffect(() => {
    window.addEventListener("checking", getCurrentKey);

    return () => {
      window.removeEventListener("checking", getCurrentKey);
    };
  }, []);

  const { isLoading, data: projectType } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${"HCM-PROJECT-TYPES"}.projectTypes` }
  );

  useEffect(() => {
    if (fetchUpload) {
      setFetchUpload(false);
    }
    if (fetchBoundary && currentKey > 5) {
      setFetchBoundary(false);
    }
  }, [fetchUpload, fetchBoundary]);

  useEffect(() => {
    setTotalFormData(params);
  }, [params]);

  //DATA STRUCTURE
  useEffect(() => {
    // if (isLoading) return;
    // if (Object.keys(params).length !== 0) return;
    if (!draftData) return;
    const restructureFormData = transformDraftDataToFormData(draftData, projectType);
    setParams({ ...restructureFormData });
  }, [draftData]);

  useEffect(() => {
    if (draftData?.additionalDetails?.facilityId && draftData?.additionalDetails?.targetId && draftData?.additionalDetails?.userId) {
      setDataParams({
        ...dataParams,
        boundaryId: draftData?.additionalDetails?.targetId,
        facilityId: draftData?.additionalDetails?.facilityId,
        userId: draftData?.additionalDetails?.userId,
        hierarchyType: hierarchyType,
        hierarchy: hierarchyDefinition?.BoundaryHierarchy?.[0],
      });
    }
  }, [hierarchyDefinition?.BoundaryHierarchy?.[0], draftData]); // Only run if dataParams changes

  useEffect(() => {
    if (hierarchyDefinition?.BoundaryHierarchy?.[0]) {
      setDataParams({
        ...dataParams,
        hierarchyType: hierarchyType,
        hierarchy: hierarchyDefinition?.BoundaryHierarchy?.[0],
      });
    }
  }, [hierarchyDefinition?.BoundaryHierarchy?.[0], draftData]);
  useEffect(() => {
    setCampaignConfig(CampaignConfig(totalFormData, dataParams, isSubmitting, summaryErrors, hierarchyData));
  }, [totalFormData, dataParams, isSubmitting, summaryErrors, hierarchyData]);

  useEffect(() => {
    setIsSubmitting(false);
    if (currentKey === 16 && isSummary !== "true") {
      updateUrlParams({ key: currentKey, summary: true });
    } else if (currentKey !== 16) {
      updateUrlParams({ key: currentKey, summary: false });
      // setSummaryErrors(null);
    }
  }, [currentKey]);

  //API CALL
  useEffect(() => {
    async function handleUpdate() {
      if (shouldUpdate === true) {
        if (isChangeDates === "true") {
          const reqCreate = async () => {
            let payloadData = { ...draftData };
            payloadData.hierarchyType = hierarchyType;
            if (totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate) {
              payloadData.startDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate
                ? Digit.Utils.date.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate)
                : null;
            }
            if (totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate) {
              payloadData.endDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate
                ? Digit.Utils.date.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate)
                : null;
            }
            payloadData.tenantId = tenantId;
            payloadData.action = "changeDates";
            if (totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure) {
              payloadData.additionalDetails.cycleData = totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
            } else {
              payloadData.additionalDetails.cycleData = {};
            }
            if (totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule) {
              const temp = restructureData(
                totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule,
                totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure,
                DeliveryConfig
              );
              payloadData.deliveryRules = [temp?.[0]];
              // payloadData.deliveryRules = totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
            } else {
              payloadData.deliveryRules = [];
            }
            if (!payloadData?.startDate && !payloadData?.endDate) {
              delete payloadData?.startDate;
              delete payloadData?.endDate;
            }
            if (compareIdentical(draftData, payloadData) === false) {
              await updateCampaign(payloadData, {
                onError: (error, variables) => {
                  if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.mandatoryOnAPI) {
                    setShowToast({ key: "error", label: error?.message ? error?.message : error });
                  }
                },
                onSuccess: async (data) => {
                  updateUrlParams({ id: data?.CampaignDetails?.id });
                  draftRefetch();
                  if (currentKey == 6) {
                    setCurrentKey(16);
                  } else {
                    setCurrentKey(currentKey + 1);
                  }
                },
              });
            } else {
              if (currentKey == 6) {
                setCurrentKey(16);
              } else {
                setCurrentKey(currentKey + 1);
              }
            }
          };

          reqCreate();
        } else if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.skipAPICall && !id) {
          return;
        }
        // else if (filteredConfig?.[0]?.form?.[0]?.isLast) {
        //   const reqCreate = async () => {
        //     let payloadData = { ...draftData };
        //     payloadData.hierarchyType = hierarchyType;
        //     payloadData.startDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate
        //       ? Digit.Utils.pt.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate, "daystart")
        //       : null;
        //     payloadData.endDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate
        //       ? Digit.Utils.pt.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate)
        //       : null;
        //     payloadData.tenantId = tenantId;
        //     payloadData.action = "create";
        //     payloadData.parentId = null;
        //     payloadData.campaignName = totalFormData?.HCM_CAMPAIGN_NAME?.campaignName;
        //     if (totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData) {
        //       payloadData.boundaries = totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData;
        //     }
        //     const temp = resourceData(
        //       totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0],
        //       totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0],
        //       totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]
        //     );
        //     payloadData.resources = temp;
        //     payloadData.projectType = totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code;
        //     payloadData.additionalDetails = {
        //       beneficiaryType: totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType,
        //       key: currentKey,
        //       targetId: dataParams?.boundaryId,
        //       facilityId: dataParams?.facilityId,
        //       userId: dataParams?.userId,
        //     };
        //     if (totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure) {
        //       payloadData.additionalDetails.cycleData = totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
        //     } else {
        //       payloadData.additionalDetails.cycleData = {};
        //     }
        //     if (totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule) {
        //       const temp = restructureData(
        //         totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule,
        //         totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure,
        //         DeliveryConfig,
        //         totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code,
        //         "create"
        //       );
        //       payloadData.deliveryRules = [temp?.[0]];
        //       // payloadData.deliveryRules = totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
        //     }
        //     if (compareIdentical(draftData, payloadData) === false) {
        //       setIsDataCreating(true);

        //       await updateCampaign(payloadData, {
        //         onError: (error, variables) => {
        //           setShowToast({ key: "error", label: error?.message ? error?.message : error });
        //         },
        //         onSuccess: async (data) => {
        //           draftRefetch();
        //           history.push(
        //             `/${window.contextPath}/employee/campaign/response?campaignId=${data?.CampaignDetails?.campaignNumber}&isSuccess=${true}`,
        //             {
        //               message: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE"),
        //               text: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE_TEXT"),
        //               info: t("ES_CAMPAIGN_SUCCESS_INFO_TEXT"),
        //               actionLabel: "HCM_CONFIGURE_APP_RESPONSE_ACTION",
        //               actionLink: `/${window.contextPath}/employee/campaign/checklist/search?name=${data?.CampaignDetails?.campaignName}&campaignId=${data?.CampaignDetails?.id}&projectType=${data?.CampaignDetails?.projectType}`,
        //               secondaryActionLabel: "MY_CAMPAIGN",
        //               secondaryActionLink: `/${window?.contextPath}/employee/campaign/my-campaign`,
        //               name: data?.CampaignDetails?.campaignName,
        //               projectId: data?.CampaignDetails?.projectId,
        //               data: data,
        //             }
        //           );
        //           Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
        //         },
        //         onSettled: () => {
        //           // This will always run after the mutation completes
        //           setIsDataCreating(false);
        //           // Final function logic here
        //         },
        //       });
        //     }
        //   };

        //   reqCreate();
        // }
        else if (!isDraftCreated && !id) {
          const reqCreate = async () => {
            let payloadData = {};
            payloadData.hierarchyType = hierarchyType;
            if (totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate) {
              payloadData.startDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate
                ? Digit.Utils.pt.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate, "daystart")
                : null;
            }
            if (totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate) {
              payloadData.endDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate
                ? Digit.Utils.pt.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate)
                : null;
            }
            payloadData.tenantId = tenantId;
            payloadData.action = "draft";
            payloadData.parentId = null;
            payloadData.campaignName = totalFormData?.HCM_CAMPAIGN_NAME?.campaignName;
            if (totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData) {
              payloadData.boundaries = totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData;
            }

            const temp = resourceData(
              resourceDatas?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0],
              resourceDatas?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0],
              resourceDatas?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0],
              resourceDatas?.HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA?.uploadUnified?.uploadedFile?.[0]
            );

            payloadData.resources = temp;
            payloadData.projectType = totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code || draftData?.projectType;
            // Preserve existing additionalDetails (including isUnifiedCampaign) from draftData, then override with new values
            const sessionIsUnifiedCampaign = totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.isUnifiedCampaign;
            payloadData.additionalDetails = {
              ...draftData?.additionalDetails,
              beneficiaryType: totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType,
              key: currentKey,
              targetId: dataParams?.boundaryId,
              facilityId: dataParams?.facilityId,
              userId: dataParams?.userId,
              // Only override isUnifiedCampaign if session has it explicitly set; otherwise draftData value is already preserved from spread above
              ...(sessionIsUnifiedCampaign !== undefined && { isUnifiedCampaign: sessionIsUnifiedCampaign }),
            };
            if (totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure) {
              payloadData.additionalDetails.cycleData = totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
            } else {
              payloadData.additionalDetails.cycleData = {};
            }
            if (totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule) {
              const temp = restructureData(
                totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule,
                totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure,
                DeliveryConfig,
                totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code || draftData?.projectType,
                "draft"
              );
              payloadData.deliveryRules = temp?.[0];
              // payloadData.deliveryRules = totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
            }
            setIsDataCreating(true);
            await mutate(payloadData, {
              onError: (error, variables) => {
                if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.mandatoryOnAPI) {
                  setShowToast({ key: "error", label: error?.message ? error?.message : error });
                }
              },
              onSuccess: async (data) => {
                updateUrlParams({ id: data?.CampaignDetails?.id });
                setIsDraftCreated(true);
                draftRefetch();
                if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.mandatoryOnAPI) {
                  setCurrentKey(currentKey + 1);
                }
              },
              onSettled: () => {
                // This will always run after the mutation completes
                setIsDataCreating(false);
                // Final function logic here
              },
            });
          };

          reqCreate();
        } else {
          const reqCreate = async () => {
            let payloadData = { ...draftData };
            payloadData.hierarchyType = hierarchyType;
            if (totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate) {
              payloadData.startDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate
                ? Digit.Utils.pt.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate, "daystart")
                : null;
            }
            if (totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate) {
              payloadData.endDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate
                ? Digit.Utils.pt.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate)
                : null;
            }
            payloadData.tenantId = tenantId;
            payloadData.action = "draft";
            payloadData.parentId = null;
            payloadData.campaignName = totalFormData?.HCM_CAMPAIGN_NAME?.campaignName;
            if (totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData) {
              payloadData.boundaries = totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData;
            }

            const temp = resourceData(
              resourceDatas?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0],
              resourceDatas?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0],
              resourceDatas?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0],
              resourceDatas?.HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA?.uploadUnified?.uploadedFile?.[0]
            );
            payloadData.resources = temp;
            payloadData.projectType = totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code || draftData?.projectType;
            // Preserve existing additionalDetails (including isUnifiedCampaign) from draftData, then override with new values
            const sessionIsUnifiedCampaign2 = totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.isUnifiedCampaign;
            payloadData.additionalDetails = {
              ...draftData?.additionalDetails,
              beneficiaryType: totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType,
              key: currentKey,
              targetId: dataParams?.boundaryId,
              facilityId: dataParams?.facilityId,
              userId: dataParams?.userId,
              // Only override isUnifiedCampaign if session has it explicitly set; otherwise draftData value is already preserved from spread above
              ...(sessionIsUnifiedCampaign2 !== undefined && { isUnifiedCampaign: sessionIsUnifiedCampaign2 }),
            };
            if (totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure) {
              payloadData.additionalDetails.cycleData = totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
            } else {
              payloadData.additionalDetails.cycleData = {};
            }
            if (totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule) {
              const temp = restructureData(
                totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule,
                totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure,
                DeliveryConfig,
                totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code || draftData?.projectType,
                "draft"
              );

              payloadData.deliveryRules = [temp?.[0]];
              // payloadData.deliveryRules = totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
            } else {
              payloadData.deliveryRules = [];
            }
            if (!payloadData?.startDate && !payloadData?.endDate) {
              delete payloadData?.startDate;
              delete payloadData?.endDate;
            }
            if (compareIdentical(draftData, payloadData) === false) {
              setIsUpdating(true);
              await updateCampaign(payloadData, {
                onError: (error, variables) => {
                  if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.mandatoryOnAPI) {
                    setShowToast({ key: "error", label: error?.message ? error?.message : error });
                  }
                },
                onSuccess: async (data) => {
                  updateUrlParams({ id: data?.CampaignDetails?.id });
                  draftRefetch();
                  if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.mandatoryOnAPI) {
                    setCurrentKey(currentKey + 1);
                  }
                },
                onSettled: () => {
                  // This will always run after the mutation completes
                  setIsUpdating(false);
                  // Final function logic here
                },
              });
            } else {
              setCurrentKey(currentKey + 1);
            }
          };

          reqCreate();
        }
        setShouldUpdate(false);
      }
    }
    handleUpdate();
  }, [shouldUpdate]);

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 10000);
    }
  }, [showToast]);

  function hasSelectedBoundaryChanged(sessionData, formData) {
    const sessionSelected = sessionData?.boundaryType?.selectedData || [];
    const formSelected = formData?.selectedData || [];

    if (sessionSelected.length !== formSelected.length) return true;

    const sortByCode = (arr) => [...arr].sort((a, b) => a.code.localeCompare(b.code));
    const sortedSession = sortByCode(sessionSelected);
    const sortedForm = sortByCode(formSelected);

    for (let i = 0; i < sortedSession.length; i++) {
      const a = sortedSession[i];
      const b = sortedForm[i];

      if (
        a.code !== b.code ||
        a.name !== b.name ||
        a.type !== b.type ||
        a.isRoot !== b.isRoot ||
        a.includeAllChildren !== b.includeAllChildren ||
        (a.parent || "") !== (b.parent || "") // handle undefined vs empty string
      ) {
        return true; // Something changed
      }
    }

    return false; // All matched
  }

  const onSubmit = async (formData, cc) => {
    //const isChanged = hasSelectedBoundaryChanged(resourceDatas?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA, formData?.boundaryType);
    let isChanged = false;

    const sessionBoundary = resourceDatas?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA;
    const formBoundary = formData?.boundaryType;

    if (sessionBoundary && formBoundary) {
      isChanged = hasSelectedBoundaryChanged(sessionBoundary, formBoundary);
    }
    if (isChanged) {
      Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_SET_UP");
    }

    setIsSubmitting(true);
    // validating the screen data on clicking next button
    const checkValid = handleValidate({
      formData,
      hierarchyDefinition,
      lowestHierarchy,
      hierarchyType,
      totalFormData,
      setFetchUpload,
      setSummaryErrors,
      t,
      setShowToast,
    });
    if (checkValid === false) {
      return;
    }

    const name = filteredConfig?.[0]?.form?.[0]?.name;

    if (name === "HCM_CAMPAIGN_TYPE" && totalFormData?.["HCM_CAMPAIGN_TYPE"]?.projectType?.code !== formData?.projectType?.code) {
      setTotalFormData((prevData) => ({
        [name]: formData,
      }));
      //to set the data in the local storage
      setParams({
        [name]: { ...formData },
      });
    } else if (name === "HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA" && formData?.boundaryType?.updateBoundary === true) {
      window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
      window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_UNIFIED_UPLOAD_DATA");
      setTotalFormData((prevData) => ({
        ...prevData,
        [name]: formData,
        ["HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_USER_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA"]: {},
      }));
      //to set the data in the local storage
      setParams({
        ...params,
        [name]: { ...formData },
        ["HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_USER_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA"]: {},
      });
    } else if (name === "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA_MAPPING" && formData?.uploadFacilityMapping?.data?.length > 0) {
      setLoader(true);
      const schemas = formData?.uploadFacilityMapping?.schemas;
      const checkValid = formData?.uploadFacilityMapping?.data?.some(
        (item) =>
          item?.[t(schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active" &&
          (!item?.[t(schemas?.find((i) => i.description === "Boundary Code")?.name)] ||
            item?.[t(schemas?.find((i) => i.description === "Boundary Code")?.name)]?.length === 0)
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
          sheetNameToUpdate: "HCM_ADMIN_CONSOLE_FACILITIES",
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
                    hierarchyType: hierarchyType,
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
                    hierarchyType: hierarchyType,
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
    } else {
      setTotalFormData((prevData) => ({
        ...prevData,
        [name]: formData,
      }));
      //to set the data in the local storage
      setParams({
        ...params,
        [name]: { ...formData },
      });
      if (formData?.cycleConfigure?.cycleData?.length > 0) {
        const tempSession = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_DATA") || {};
        const updated = {
          ...tempSession,
          additionalDetails: {
            ...(tempSession.additionalDetails || {}),
            cycleData: formData?.cycleConfigure?.cycleData,
            cycleConfgureDate: formData?.cycleConfigure?.cycleConfgureDate,
          },
        };
        Digit.SessionStorage.set("HCM_ADMIN_CONSOLE_DATA", updated);
      }
    }

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
    if (isSubmit) {
      setShouldUpdate(true);
      if (currentKey == 6 || currentKey == 9 || currentKey == 15) {
        setShowToast({ key: "success", label: t("HCM_DRAFT_SUCCESS") });
        if (isDraft === "true") {
          navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}&draft=${isDraft}`);
        } else {
          navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
        }
      }
      return;
    }
    return;
  };

  const onStepClick = (step) => {
    const filteredSteps = campaignConfig[0].form.filter((item) => item.stepCount === String(step + 1));

    const maxKeyStep = filteredSteps.reduce((max, step) => {
      return parseInt(step.key) > parseInt(max.key) ? step : max;
    });

    const key = parseInt(filteredSteps[0].key);
    const name = filteredSteps[0].name;
    if (step === 6 && Object.keys(totalFormData).includes("HCM_CAMPAIGN_UPLOAD_USER_DATA")) {
      setCurrentKey(16);
      setCurrentStep(5);
    } else if (step === 0 && totalFormData["HCM_CAMPAIGN_NAME"] && totalFormData["HCM_CAMPAIGN_TYPE"] && totalFormData["HCM_CAMPAIGN_DATE"]) {
      setCurrentKey(4);
      setCurrentStep(1);
    } else if (!totalFormData["HCM_CAMPAIGN_NAME"] || !totalFormData["HCM_CAMPAIGN_NAME"]) {
      // Do not set stepper and key
    } else if (Object.keys(totalFormData).includes(name)) {
      setCurrentKey(parseInt(maxKeyStep?.key));
      setCurrentStep(step);
      // Do not set stepper and key
    }
  };

  useEffect(() => {
    const isMicroplanScreen = source === "microplan";
    const urlKey = currentKey;
    findHighestStepCount({ totalFormData, campaignConfig, isDraft, setActive, isMicroplanScreen, urlKey });
  }, [totalFormData, campaignConfig]);

  const onSecondayActionClick = () => {
    if (currentKey > 1) {
      setShouldUpdate(false);
      setCurrentKey(currentKey - 1);
      setSummaryErrors(null);
    }
    if (isSubmit) {
      if (currentKey == 5 || currentKey == 7 || currentKey == 10) {
        if (isDraft === "true") {
          navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}&draft=${isDraft}`);
        } else {
          navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
        }
      }
      return;
    }
  };

  const [filteredConfig, setFilteredConfig] = useState(filterCampaignConfig(campaignConfig, currentKey));

  useEffect(() => {
    setFilteredConfig(filterCampaignConfig(campaignConfig, currentKey));
  }, [campaignConfig, currentKey]);

  const config = filteredConfig?.[0];

  // setting the current step when the key is changed on the basis of the config
  useEffect(() => {
    setCurrentStep(Number(filteredConfig?.[0]?.form?.[0]?.stepCount - 1));
    // setShowToast(null);
  }, [currentKey, filteredConfig]);

  useEffect(() => {
    // setCurrentStep(Number(filteredConfig?.[0]?.form?.[0]?.stepCount - 1));
    setShowToast(null);
  }, [currentKey]);

  const closeToast = () => {
    setShowToast(null);
  };

  if (isPreview === "true" && !draftData) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  if (isDraft === "true" && !draftData) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  function onActionSelect(action) {
    setDisplayMenu(false);
    switch (action) {
      case "HCM_UPDATE_DATES":
        navigate(`/${window.contextPath}/employee/campaign/update-dates-boundary?id=${id}&campaignName=${draftData?.campaignName}`, {
          state: {
            name: draftData?.campaignName,
            projectId: draftData?.projectId,
            data: draftData,
          },
        });
        break;
      case "HCM_CONFIGURE_APP":
        navigate(
          `/${window.contextPath}/employee/campaign/checklist/search?name=${draftData?.campaignName}&campaignId=${draftData?.id}&projectType=${draftData?.projectType}`,
          {
            state: {
              name: draftData?.campaignName,
              projectId: draftData?.projectId,
              data: draftData,
            },
          }
        );
        break;
      case "HCM_UPDATE_CAMPAIGN":
        navigate(`/${window.contextPath}/employee/campaign/update-campaign?key=1&parentId=${draftData?.id}&campaignName=${draftData?.campaignName}`, {
          state: { name: draftData?.campaignName, projectId: draftData?.projectId, data: draftData },
        });
        break;
      default:
        break;
    }
  }

  const actionbarOptions = [
    { code: "HCM_UPDATE_DATES", name: "CS_ACTION_HCM_UPDATE_DATES" },
    { code: "HCM_CONFIGURE_APP", name: "CS_ACTION_HCM_CONFIGURE_APP" },
    { code: "HCM_UPDATE_CAMPAIGN", name: "CS_ACTION_HCM_UPDATE_CAMPAIGN" },
  ];

  const onActionClick = () => {
    navigate(`/${window?.contextPath}/employee/campaign/my-campaign`);
  };

  return (
    <React.Fragment>
      {loader || (isUpdating && <Loader page={true} variant={"OverlayLoader"} loaderText={t("PLEASE_WAIT_WHILE_UPDATING")} />)}
      {/* {noAction !== "false" && (
        <Stepper
          customSteps={["HCM_CAMPAIGN_SETUP_DETAILS", "HCM_BOUNDARY_DETAILS", "HCM_DELIVERY_DETAILS", "HCM_UPLOAD_DATA", "HCM_REVIEW_DETAILS"]}
          currentStep={currentStep + 1}
          onStepClick={onStepClick}
          activeSteps={active}
          // className={"campaign-flow-stepper"}
        />
      )} */}
      <FormComposerV2
        config={config?.form.map((config) => {
          return {
            ...config,
            body: config?.body.filter((a) => !a.hideInEmployee),
          };
        })}
        isDisabled={isDataCreating}
        onSubmit={onSubmit}
        showSecondaryLabel={currentKey > 1 ? true : false}
        secondaryLabel={isChangeDates === "true" && currentKey == 6 ? t("HCM_BACK") : noAction === "false" ? null : t("HCM_BACK")}
        actionClassName={"actionBarClass"}
        className="setup-campaign"
        cardClassName="setup-campaign-card"
        noCardStyle={true}
        // noCardStyle={currentStep === 7 ? false : true}
        onSecondayActionClick={onSecondayActionClick}
        secondaryActionIcon={"ArrowBack"}
        primaryActionIconAsSuffix={true}
        primaryActionIcon={"ArrowDirection"}
        label={
          isChangeDates === "true" && currentKey == 16
            ? t("HCM_UPDATE_DATE")
            : isChangeDates === "true"
            ? null
            : noAction === "false"
            ? null
            : isSubmit === true
            ? t("HCM_NEXT")
            : filteredConfig?.[0]?.form?.[0]?.isLast === true
            ? t("HCM_SUBMIT")
            : t("HCM_NEXT")
        }
      />
      {actionBar === "true" && (
        <Footer
          actionFields={[
            <Button
              type={"button"}
              style={{ marginLeft: "2.5rem", width: "14rem" }}
              label={t("HCM_BACK")}
              title={t("HCM_BACK")}
              variation={"secondary"}
              t={t}
              onClick={() => {
                onActionClick();
              }}
            ></Button>,
            <Button
              type={"actionButton"}
              options={actionbarOptions}
              label={t("ES_COMMON_TAKE_ACTION")}
              title={t("ES_COMMON_TAKE_ACTION")}
              variation={"primary"}
              style={{ width: "14rem" }}
              optionsKey={"name"}
              isSearchable={false}
              t={t}
              onOptionSelect={(option) => {
                onActionSelect(option?.code);
              }}
            ></Button>,
          ]}
          className={"new-actionbar"}
        />
      )}
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

export default React.memo(SetupCampaign);
