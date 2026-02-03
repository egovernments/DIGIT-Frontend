import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Toast, Stepper, Loader } from "@egovernments/digit-ui-components";
import _ from "lodash";
import { UpdateBoundaryConfig } from "../../configs/UpdateBoundaryConfig";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";
import { compareIdentical, groupByTypeRemap, resourceData, updateUrlParams } from "../../utils/setupCampaignHelpers";

/**
 * The `UpdateCampaign` function in JavaScript handles the Updating of campaign details,
 * including form data handling, validation, and submission.
 * @returns The `UpdateCampaign` component is being returned. It consists of a form setup for Updating
 * a Created campaign with multiple steps like boundary
 * details, targets, facility details, user details, and review details. The form data is validated at
 * each step, and the user can navigate between steps using a stepper component. The form submission
 * triggers API calls to create or update the campaign
 */

const UpdateCampaign = ({ hierarchyData, ...props }) => {
  const resourceDatas = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_SET_UP");
  Digit.SessionStorage.set("HCM_ADMIN_CONSOLE_SET_UP", resourceDatas);
  const location = useLocation();
  // const isDraftCampaign = location.state?.isDraftCampaign;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalFormData, setTotalFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataCreating, setIsDataCreating] = useState(false);
  const [campaignConfig, setCampaignConfig] = useState(UpdateBoundaryConfig(totalFormData, null, isSubmitting));
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ADMIN_CONSOLE_UPLOAD_DATA", {});
  const [dataParams, setDataParams] = Digit.Hooks.useSessionStorage("HCM_CAMPAIGN_MANAGER_UPLOAD_ID", {});
  const [showToast, setShowToast] = useState(null);
  const [summaryErrors, setSummaryErrors] = useState({});
  const { mutate } = Digit.Hooks.campaign.useCreateCampaign(tenantId);
  const { mutate: updateCampaign } = Digit.Hooks.campaign.useUpdateCampaign(tenantId);
  const searchParams = new URLSearchParams(location.search);
  const [urlParams, setUrlParams] = useState(() => new URLSearchParams(window.location.search));
  const id = urlParams.get("id");
  const [currentId, setCurrentId] = useState(() => urlParams.get("id"));
  const isDraftCampaign = searchParams.get("isDraftCampaign") === "true";
  const parentId = searchParams.get("parentId");
  const isPreview = searchParams.get("preview");
  const isSummary = searchParams.get("summary");
  const noAction = searchParams.get("action");
  const campaignNumber = searchParams.get("campaignNumber");
  const isDraft = searchParams.get("draft");
  const isSkip = searchParams.get("skip");
  const isChangeDates = searchParams.get("changeDates");
  const [isDraftCreated, setIsDraftCreated] = useState(false);
  const [currentKey, setCurrentKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [fetchBoundary, setFetchBoundary] = useState(() => Boolean(searchParams.get("fetchBoundary")));
  const [fetchUpload, setFetchUpload] = useState(false);
  const [active, setActive] = useState(0);
  const { data: HierarchySchema } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "HierarchySchema",
        filter: `[?(@.type=='${window.Digit.Utils.campaign.getModuleName()}')]`,
      },
    ],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.HierarchySchema` }
  );
  const [hierarchyType, setHierarchyType] = useState();
  const lowestHierarchy = useMemo(() => {
    return HierarchySchema?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.find((item) => item.hierarchy === hierarchyType)?.lowestHierarchy;
  }, [HierarchySchema, hierarchyType]);
  const { isLoading, data: projectType } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${"HCM-PROJECT-TYPES"}.projectTypes` }
  );

  const { isLoading: campaignDataLoading, data: CampaignData, error: campaignError, refetch: campaignRefetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: currentId ? [currentId] : [parentId],
      ...(isDraftCampaign && { status: ["drafted"] }),
    },
    config: {
      enabled: currentId ? true : parentId ? true : false,
    },
  });

  useEffect(() => {
    setHierarchyType(CampaignData?.[0]?.hierarchyType);
  }, [CampaignData]);

  const reqCriteria = useMemo(() => {
    return {
      url: `/boundary-service/boundary-hierarchy-definition/_search`,
      changeQueryName: `${hierarchyType}`,
      body: {
        BoundaryTypeHierarchySearchCriteria: {
          tenantId: tenantId,
          limit: 1,
          offset: 0,
          hierarchyType: hierarchyType,
        },
      },
      config: {
        enabled: hierarchyType ? true : false,
        cacheTime: 1000000,
      },
    };
  }, [tenantId, hierarchyType]);

  const { data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  const { isLoading: draftLoading, data: draftData, error: draftError, refetch: draftRefetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: currentId ? [currentId] : [parentId],
      ...(isDraftCampaign && { status: ["drafted"] }),
    },
    config: {
      enabled: currentId ? true : false,
      select: (data) => {
        return data?.[0];
      },
    },
  });

  useEffect(() => {
    if (fetchUpload) {
      setFetchUpload(false);
    }
    if (fetchBoundary && currentKey > 5) {
      setFetchBoundary(false);
    }
  }, [fetchUpload, fetchBoundary]);

  useEffect(() => {
    if (isPreview === "true") {
      setIsDraftCreated(true);
      setCurrentKey(13);
      return;
    }
    if (isDraft === "true") {
      setIsDraftCreated(true);
      if (isSkip === "false") {
        currentKey !== 1 ? null : setCurrentKey(1);
      } else {
        setCurrentKey(draftData?.additionalDetails?.key);
      }
      return;
    }
  }, [isPreview, isDraft, draftData]);

  useEffect(() => {
    setTotalFormData(params);
  }, [params]);

  //DATA STRUCTURE
  useEffect(() => {
    if (isLoading) return;
    if (Object.keys(params).length !== 0) return;
    if (!draftData) return;
    const restructureFormData = {
      HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA: {
        boundaryType: {
          boundaryData: groupByTypeRemap(draftData?.boundaries),
          selectedData: draftData?.boundaries,
        },
      },
      HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA: {
        uploadBoundary: {
          uploadedFile: draftData?.resources?.filter((i) => i?.type === "boundary"),
          isSuccess: draftData?.resources?.filter((i) => i?.type === "boundary").length > 0,
        },
      },
      HCM_CAMPAIGN_UPLOAD_FACILITY_DATA: {
        uploadFacility: {
          uploadedFile: draftData?.resources?.filter((i) => i?.type === "facility"),
          isSuccess: draftData?.resources?.filter((i) => i?.type === "facility").length > 0,
        },
      },
      HCM_CAMPAIGN_UPLOAD_USER_DATA: {
        uploadUser: {
          uploadedFile: draftData?.resources?.filter((i) => i?.type === "user"),
          isSuccess: draftData?.resources?.filter((i) => i?.type === "user").length > 0,
        },
      },
    };
    setParams({ ...restructureFormData });
  }, [params, draftData, isLoading,projectType]);

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
    setCampaignConfig(
      UpdateBoundaryConfig({
        totalFormData,
        hierarchyData,
        hierarchyType: CampaignData?.[0]?.hierarchyType,
        projectType: CampaignData?.[0]?.projectType,
        summaryErrors,
        campaignData: CampaignData?.[0],
      })
    );
  }, [totalFormData, dataParams, isSubmitting, summaryErrors, hierarchyData, CampaignData?.[0]?.projectType]);

  useEffect(() => {
    setIsSubmitting(false);
    if (currentKey === 13 && isSummary !== "true") {
      updateUrlParams({ key: currentKey, summary: true });
    } else if (currentKey !== 13) {
      updateUrlParams({ key: currentKey, summary: false });
      // setSummaryErrors(null);
    }
  }, [currentKey]);



  function restructureBoundaryData(childBoundaries, parentBoundaries = []) {
    if (!childBoundaries || !Array.isArray(childBoundaries) || childBoundaries.length === 0) {
      return parentBoundaries;
    }
    return childBoundaries;
  }

  //API CALL
  useEffect(async () => {
    if (shouldUpdate === true) {
      if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.skipAPICall && !currentId) {
        return;
      } else if (filteredConfig?.[0]?.form?.[0]?.isLast) {
        const reqCreate = async () => {
          let payloadData = { ...draftData };
          payloadData.hierarchyType = hierarchyType;
          payloadData.endDate = CampaignData?.[0]?.endDate;
          payloadData.startDate = CampaignData?.[0]?.startDate;
          payloadData.tenantId = tenantId;
          payloadData.action = "create";
          payloadData.parentId = CampaignData?.[0]?.parentId;
          payloadData.campaignName = CampaignData?.[0]?.campaignName;
          if (totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData) {
            const temp = restructureBoundaryData(
              totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData,
              CampaignData?.[0]?.boundaries
            );
            payloadData.boundaries = temp;
          }
          const temp = resourceData(
            totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]
          );

          payloadData.resources = temp;
          payloadData.projectType = CampaignData?.[0]?.projectType;
          payloadData.additionalDetails = {
            beneficiaryType:
              projectType?.["HCM-PROJECT-TYPES"]?.projectTypes.find(
                (projectType) => projectType.code === CampaignData?.[0]?.projectType
              )?.beneficiaryType || null,
            key: currentKey,
            targetId: dataParams?.boundaryId,
            facilityId: dataParams?.facilityId,
            userId: dataParams?.userId,
          };
          if (CampaignData?.[0]?.additionalDetails?.cycleData) {
            payloadData.additionalDetails.cycleData = CampaignData?.[0]?.additionalDetails?.cycleData;
          } else {
            payloadData.additionalDetails.cycleData = {};
          }
          payloadData.deliveryRules = CampaignData?.[0]?.deliveryRules;
          if (compareIdentical(draftData, payloadData) === false) {
            setIsDataCreating(true);
            await updateCampaign(payloadData, {
              onError: (error, variables) => {
                setShowToast({ key: "error", label: error?.message ? error?.message : error });
              },
              onSuccess: async (data) => {
                draftRefetch();
                history.push(
                  `/${window.contextPath}/employee/campaign/response?campaignId=${data?.CampaignDetails?.campaignNumber}&isSuccess=${true}`,
                  {
                    message: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE"),
                    text: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE_TEXT"),
                    info: t("ES_CAMPAIGN_SUCCESS_INFO_TEXT"),
                    actionLabel: t("HCM_CAMPAIGN_SUCCESS_RESPONSE_ACTION"),
                    actionLink: `/${window.contextPath}/employee/campaign/my-campaign-new`,
                  }
                );
                Digit.SessionStorage.del("HCM_CAMPAIGN_UPDATE_FORM_DATA");
              },
              onSettled: () => {
                // This will always run after the mutation completes
                setIsDataCreating(false);
                // Final function logic here
              },
            });
          }
        };

        reqCreate();
      } else if (!isDraftCampaign && !isDraftCreated && !currentId) {
        const reqCreate = async () => {
          let payloadData = {};
          payloadData.hierarchyType = hierarchyType;
          payloadData.endDate = CampaignData?.[0]?.endDate;
          payloadData.startDate = CampaignData?.[0]?.startDate;
          payloadData.tenantId = tenantId;
          payloadData.action = "draft";
          payloadData.parentId = CampaignData?.[0]?.id;
          payloadData.campaignName = CampaignData?.[0]?.campaignName;
          if (totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData) {
            const temp = restructureBoundaryData(
              totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData,
              CampaignData?.[0]?.boundaries
            );
            payloadData.boundaries = temp;
          }
          const temp = resourceData(
            resourceDatas?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0],
            resourceDatas?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0],
            resourceDatas?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]
          );

          payloadData.resources = temp;
          payloadData.projectType = CampaignData?.[0]?.projectType;
          payloadData.additionalDetails = {
            beneficiaryType:
              projectType?.["HCM-PROJECT-TYPES"]?.projectTypes.find(
                (projectType) => projectType.code === CampaignData?.[0]?.projectType
              )?.beneficiaryType || null,
            key: currentKey,
            targetId: dataParams?.boundaryId,
            facilityId: dataParams?.facilityId,
            userId: dataParams?.userId,
          };
          if (CampaignData?.[0]?.additionalDetails?.cycleData) {
            payloadData.additionalDetails.cycleData = CampaignData?.[0]?.additionalDetails?.cycleData;
          } else {
            payloadData.additionalDetails.cycleData = {};
          }
          payloadData.deliveryRules = CampaignData?.[0]?.deliveryRules;
          setIsDataCreating(true);

          await mutate(payloadData, {
            onError: (error, variables) => {
              if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.mandatoryOnAPI) {
                setShowToast({ key: "error", label: error?.message ? error?.message : error });
              }
            },
            onSuccess: async (data) => {
              updateUrlParams({ id: data?.CampaignDetails?.id });
              setCurrentId(data?.CampaignDetails?.id);
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
          let payloadData = { ...CampaignData?.[0] };
          payloadData.hierarchyType = hierarchyType;
          payloadData.endDate = CampaignData?.[0]?.endDate;
          payloadData.startDate = CampaignData?.[0]?.startDate;
          payloadData.tenantId = tenantId;
          payloadData.action = "draft";
          payloadData.parentId = CampaignData?.[0]?.parentId;
          payloadData.campaignName = CampaignData?.[0]?.campaignName;
          if (totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData) {
            const temp = restructureBoundaryData(
              totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData,
              CampaignData?.[0]?.boundaries
            );
            payloadData.boundaries = temp;
          }
          const temp = resourceData(
            totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]
          );
          payloadData.resources = temp;
          payloadData.projectType = CampaignData?.[0]?.projectType;
          payloadData.additionalDetails = {
            beneficiaryType:
              projectType?.["HCM-PROJECT-TYPES"]?.projectTypes.find(
                (projectType) => projectType.code === CampaignData?.[0]?.projectType
              )?.beneficiaryType || null,
            key: currentKey,
            targetId: dataParams?.boundaryId,
            facilityId: dataParams?.facilityId,
            userId: dataParams?.userId,
          };
          if (CampaignData?.[0]?.additionalDetails?.cycleData) {
            payloadData.additionalDetails.cycleData = CampaignData?.[0]?.additionalDetails?.cycleData;
          } else {
            payloadData.additionalDetails.cycleData = {};
          }

          payloadData.deliveryRules = CampaignData?.[0]?.deliveryRules;
          if (!payloadData?.startDate && !payloadData?.endDate) {
            delete payloadData?.startDate;
            delete payloadData?.endDate;
          }
          if (compareIdentical(draftData, payloadData) === false) {
            await updateCampaign(payloadData, {
              onError: (error, variables) => {
                console.log(error);
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
            });
          } else {
            setCurrentKey(currentKey + 1);
          }
        };

        reqCreate();
      }
      setShouldUpdate(false);
    }
  }, [shouldUpdate,]);

  function isBoundaryDiff(parentBoundaries, childBoundaries) {
    const parentBoundaryCodesSet = new Set(parentBoundaries.map((boundary) => boundary.code));
    const childBoundaryCodesSet = new Set(childBoundaries.map((boundary) => boundary.code));
    for (const boundary of childBoundaries) {
      if (!parentBoundaryCodesSet.has(boundary.code)) {
        return true;
      }
    }
    for (const boundary of parentBoundaries) {
      if (!childBoundaryCodesSet.has(boundary.code)) {
        return true;
      }
    }
    return false;
  }

  function validateBoundaryLevel(data) {
    const boundaryHierarchy = hierarchyDefinition?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [];

    const lowestIndex = boundaryHierarchy.findIndex((item) => item?.boundaryType === lowestHierarchy);

    const boundaryTypes = new Set(boundaryHierarchy.filter((_, index) => index <= lowestIndex).map((item) => item?.boundaryType));

    // Extracting unique boundary types from data
    const uniqueDataBoundaryTypes = new Set(data?.map((item) => item.type));

    // Checking if all boundary types from the filtered hierarchy are present in data
    const allBoundaryTypesPresent = [...boundaryTypes].every((type) => uniqueDataBoundaryTypes.has(type));

    return allBoundaryTypesPresent;
  }

  function recursiveParentFind(filteredData) {
    const parentChildrenMap = {};

    // Build the parent-children map
    filteredData?.forEach((item) => {
      if (item?.parent) {
        if (!parentChildrenMap[item?.parent]) {
          parentChildrenMap[item?.parent] = [];
        }
        parentChildrenMap[item?.parent].push(item.code);
      }
    });

    // Check for missing children
    const missingParents = filteredData?.filter((item) => item?.parent && !parentChildrenMap[item.code]);
    const extraParent = missingParents?.filter((i) => i?.type !== lowestHierarchy);

    return extraParent;
  }

  // validating the screen data on clicking next button
  const handleValidate = (formData) => {
    const key = Object.keys(formData)?.[0];
    switch (key) {
      case "boundaryType":
        if (formData?.boundaryType?.selectedData) {
          const validateBoundary = validateBoundaryLevel(formData?.boundaryType?.selectedData);
          const missedType = recursiveParentFind(formData?.boundaryType?.selectedData);
          if (!validateBoundary) {
            setShowToast({ key: "error", label: t("HCM_CAMPAIGN_ALL_THE_LEVELS_ARE_MANDATORY") });
            return false;
          } else if (recursiveParentFind(formData?.boundaryType?.selectedData).length > 0) {
            setShowToast({
              key: "error",
              label: `${t(`HCM_CAMPAIGN_FOR`)} ${t(`${hierarchyType}_${missedType?.[0]?.type}`?.toUpperCase())} ${t(missedType?.[0]?.code)} ${t(
                `HCM_CAMPAIGN_CHILD_NOT_PRESENT`
              )}`,
            });
            return false;
          }
          setShowToast(null);
          const checkEqual = _.isEqual(
            formData?.boundaryType?.selectedData,
            totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData
          );
          setFetchUpload(true);
          // setRefetchGenerate(checkEqual === false ? true : false);
          return true;
        } else {
          setShowToast({ key: "error", label: `${t("HCM_SELECT_BOUNDARY")}` });
          return false;
        }

      case "uploadBoundary":
        if (formData?.uploadBoundary?.isValidation) {
          setShowToast({ key: "info", label: `${t("HCM_FILE_VALIDATION_PROGRESS")}`, transitionTime: 6000000000 });
          return false;
        } else if (formData?.uploadBoundary?.isError) {
          if (formData?.uploadBoundary?.apiError) {
            setShowToast({ key: "error", label: formData?.uploadBoundary?.apiError, transitionTime: 6000000000 });
          } else setShowToast({ key: "error", label: `${t("HCM_FILE_VALIDATION")}` });
          return false;
        } else {
          setShowToast(null);
          return true;
        }

      case "uploadFacility":
        if (formData?.uploadFacility?.isValidation) {
          setShowToast({ key: "info", label: `${t("HCM_FILE_VALIDATION_PROGRESS")}`, transitionTime: 6000000000 });
          return false;
        } else if (formData?.uploadFacility?.isError) {
          if (formData?.uploadFacility?.apiError) {
            setShowToast({ key: "error", label: formData?.uploadFacility?.apiError, transitionTime: 6000000000 });
          } else setShowToast({ key: "error", label: `${t("HCM_FILE_VALIDATION")}` });
          return false;
        } else {
          setShowToast(null);
          return true;
        }
      case "uploadUser":
        if (formData?.uploadUser?.isValidation) {
          setShowToast({ key: "info", label: `${t("HCM_FILE_VALIDATION_PROGRESS")}`, transitionTime: 6000000000 });
          return false;
        } else if (formData?.uploadUser?.isError) {
          if (formData?.uploadUser?.apiError) {
            setShowToast({ key: "error", label: formData?.uploadUser?.apiError, transitionTime: 6000000000 });
          } else setShowToast({ key: "error", label: `${t("HCM_FILE_VALIDATION")}` });
          return false;
        } else {
          setShowToast(null);
          return true;
        }
      case "summary":
        const updateBoundary = restructureBoundaryData(
          totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData,
          CampaignData?.[0]?.boundaries
        );
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
        if (isTargetError && isFacilityError && isUserError) {
          setShowToast({ key: "error", label: "AT_LEAST_ONE_FILE_REQUIRED_ERROR" });
          return false;
        }
        if (isTargetError && isBoundaryDiff(CampaignData?.[0]?.boundaries, updateBoundary)) {
          setShowToast({ key: "error", label: "TARGET_DETAILS_ERROR" });
          return false;
        }
        if (isFacilityError && !parentId) {
          setShowToast({ key: "error", label: "FACILITY_DETAILS_ERROR" });
          return false;
        }
        if (isUserError && !parentId) {
          setShowToast({ key: "error", label: "USER_DETAILS_ERROR" });
          return false;
        }
        setShowToast(null);
        return true;
      default:
        break;
    }
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 10000);
    }
  }, [showToast]);

  const onSubmit = (formData, cc) => {
    setIsSubmitting(true);
    const checkValid = handleValidate(formData);
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
      setTotalFormData((prevData) => ({
        ...prevData,
        [name]: formData,
        ["HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_USER_DATA"]: {},
      }));
      //to set the data in the local storage
      setParams({
        ...params,
        [name]: { ...formData },
        ["HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]: {},
        ["HCM_CAMPAIGN_UPLOAD_USER_DATA"]: {},
      });
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
    }

    if (
      filteredConfig?.[0]?.form?.[0]?.isLast ||
      !filteredConfig[0].form[0].body[0].skipAPICall ||
      (filteredConfig[0].form[0].body[0].skipAPICall && currentId)
    ) {
      setShouldUpdate(true);
    }
    if (isChangeDates === "true" && currentKey == 6) {
      setCurrentKey(13);
    }

    if (!filteredConfig?.[0]?.form?.[0]?.isLast && !filteredConfig[0].form[0].body[0].mandatoryOnAPI) {
      setCurrentKey(currentKey + 1);
    }
    if (isDraft === "true" && isSkip !== "false") {
      updateUrlParams({ skip: "false" });
    }
    return;
  };

  const onStepClick = (step) => {
    // if ((currentKey === 5 || currentKey === 6) && step > 1) {
    //   return;
    // }
    const filteredSteps = campaignConfig[0].form.filter((item) => item.stepCount === String(step + 1));

    const maxKeyStep = filteredSteps.reduce((max, step) => {
      return parseInt(step.key) > parseInt(max.key) ? step : max;
    });

    const key = parseInt(filteredSteps[0].key);
    const name = filteredSteps[0].name;
    if (Object.keys(totalFormData).includes(name)) {
      setCurrentKey(parseInt(maxKeyStep?.key));
      setCurrentStep(step);
    }
  };

  const filterNonEmptyValues = (obj) => {
    const keys = [];
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // Check if any nested value is non-null and non-empty
        if (hasNonEmptyValue(obj[key])) {
          keys.push(key);
        }
      } else if (obj[key] !== null && obj[key] !== "") {
        keys.push(key);
      }
    }
    return keys;
  };

  const hasNonEmptyValue = (obj) => {
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== "") {
        if (typeof obj[key] === "object") {
          if (hasNonEmptyValue(obj[key])) {
            return true;
          }
        } else {
          return true;
        }
      }
    }
    return false;
  };

  const draftFilterStep = (totalFormData) => {
    const stepFind = (name) => {
      const step = campaignConfig?.[0]?.form.find((step) => step.name === name);
      return step ? parseInt(step.stepCount, 13) : null;
    };
    let v = [];
    if (totalFormData?.HCM_CAMPAIGN_NAME?.campaignName) v.push(stepFind("HCM_CAMPAIGN_NAME"));
    if (totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.selectedData?.length) v.push(stepFind("HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"));
    if (totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate && totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate)
      v.push(stepFind("HCM_CAMPAIGN_DATE"));
    if (totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure?.cycleData?.length) v.push(stepFind("HCM_CAMPAIGN_CYCLE_CONFIGURE"));
    if (totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule?.length) v.push(stepFind("HCM_CAMPAIGN_DELIVERY_DATA"));
    if (totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.length) v.push(stepFind("HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA"));
    if (totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.length) v.push(stepFind("HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"));
    if (totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.length) v.push(stepFind("HCM_CAMPAIGN_UPLOAD_USER_DATA"));

    const highestNumber = Math.max(...v);
    return highestNumber;
  };

  const findHighestStepCount = () => {
    const totalFormDataKeys = Object.keys(totalFormData);

    const nonNullFormDataKeys = filterNonEmptyValues(totalFormData);

    const relatedSteps = campaignConfig?.[0]?.form.filter((step) => nonNullFormDataKeys.includes(step.name));

    const highestStep = relatedSteps.reduce((max, step) => Math.max(max, parseInt(step.stepCount)), 0);
    if (isDraft == "true") {
      const filteredStep = draftFilterStep(totalFormData);
      setActive(filteredStep);
    } else {
      setActive(highestStep);
    }
  };

  useEffect(() => {
    findHighestStepCount();
  }, [totalFormData, campaignConfig]);

  const onSecondayActionClick = () => {
    if (currentKey > 1) {
      setShouldUpdate(false);
      setCurrentKey(currentKey - 1);
    } else {
      history.push(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
    }
  };

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

  return (
    <React.Fragment>
      {/* {noAction !== "false" && (
        <Stepper
          customSteps={["HCM_BOUNDARY_DETAILS", "HCM_UPLOAD_FACILITY_DATA", "HCM_UPLOAD_USER_DATA", "HCM_UPLOAD_TARGET_DATA", "HCM_REVIEW_DETAILS"]}
          currentStep={currentStep + 1}
          onStepClick={onStepClick}
          activeSteps={active}
        />
      )} */}
      <FormComposerV2
        config={config?.form.map((config) => {
          return {
            ...config,
            body: config?.body.filter((a) => !a.hideInEmployee),
          };
        })}
        onSubmit={onSubmit}
        isDisabled={isDataCreating}
        showSecondaryLabel={true}
        secondaryLabel={isChangeDates === "true" && currentKey == 6 ? t("HCM_BACK") : noAction === "false" ? null : t("HCM_BACK")}
        actionClassName={"actionBarClass"}
        className="setup-campaign"
        cardClassName="setup-campaign-card"
        noCardStyle={true}
        onSecondayActionClick={onSecondayActionClick}
        label={filteredConfig?.[0]?.form?.[0]?.isLast === true ? t("HCM_UPDATE") : t("HCM_NEXT")}
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

export default React.memo(UpdateCampaign);
