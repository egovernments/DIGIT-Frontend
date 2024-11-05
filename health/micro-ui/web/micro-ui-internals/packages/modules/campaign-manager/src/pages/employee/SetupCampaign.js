import {
  Loader,
  FormComposerV2, Menu,
  ActionBar,
  SubmitBar
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { CampaignConfig } from "../../configs/CampaignConfig";
import { Stepper, Toast } from "@egovernments/digit-ui-components";
import _ from "lodash";
import { cycleDataRemap, updateUrlParams,transformDraftDataToFormData,compareIdentical,resourceData, groupByTypeRemap, restructureData, reverseDeliveryRemap, filterCampaignConfig, filterNonEmptyValues, findHighestStepCount } from "../../utils/setupCampaignHelpers";

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
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
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
  const { mutate: updateCampaign } = Digit.Hooks.campaign.useUpdateCampaign(tenantId);
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const isPreview = searchParams.get("preview");
  const isSummary = searchParams.get("summary");
  const noAction = searchParams.get("action");
  const isDraft = searchParams.get("draft");
  const isSkip = searchParams.get("skip");
  const isChangeDates = searchParams.get("changeDates");
  const actionBar = searchParams.get("actionBar");
  const [isDraftCreated, setIsDraftCreated] = useState(false);
  const [currentKey, setCurrentKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [displayMenu, setDisplayMenu] = useState(null);
  const [fetchBoundary, setFetchBoundary] = useState(() => Boolean(searchParams.get("fetchBoundary")));
  const [fetchUpload, setFetchUpload] = useState(false);
  const [active, setActive] = useState(0);
  const { data: hierarchyConfig } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }]);
  const lowestHierarchy = useMemo(() => {
    return hierarchyConfig?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.find((item) => item.isActive)?.lowestHierarchy;
  }, [hierarchyConfig]);

  const { data: DeliveryConfig } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    {
      select: (data) => {
        return data?.["HCM-PROJECT-TYPES"]?.projectTypes;
      },
    }
  );

  const reqCriteria = {
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

  const { isLoading, data: projectType } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-PROJECT-TYPES", [{ name: "projectTypes" }]);

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
      setCurrentKey(14);
      return;
    }
    if (isDraft === "true") {
      setIsDraftCreated(true);
      if (isSkip === "false") {
        currentKey !== 1 ? null : setCurrentKey(1);
      } else {
        if(draftData?.additionalDetails?.key === 7) setCurrentKey(8);
        else setCurrentKey(draftData?.additionalDetails?.key);
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
    const restructureFormData = transformDraftDataToFormData(draftData,projectType);
    setParams({ ...restructureFormData });
  }, [params, draftData, isLoading, projectType]);

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
    if (currentKey === 14 && isSummary !== "true") {
      updateUrlParams({ key: currentKey, summary: true });
    } else if (currentKey !== 14) {
      updateUrlParams({ key: currentKey, summary: false });
      // setSummaryErrors(null);
    }
  }, [currentKey]);



  //API CALL
  useEffect(async () => {
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
            const temp = restructureData(totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule , totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure , DeliveryConfig);
            payloadData.deliveryRules =  [temp?.[0]];
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
                console.log(error);
                if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.mandatoryOnAPI) {
                  setShowToast({ key: "error", label: error?.message ? error?.message : error });
                }
              },
              onSuccess: async (data) => {
                updateUrlParams({ id: data?.CampaignDetails?.id });
                draftRefetch();
                if (currentKey == 6) {
                  setCurrentKey(14);
                } else {
                  setCurrentKey(currentKey + 1);
                }
              },
            });
          } else {
            if (currentKey == 6) {
              setCurrentKey(14);
            } else {
              setCurrentKey(currentKey + 1);
            }
          }
        };

        reqCreate();
      } else if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.skipAPICall && !id) {
        return;
      } else if (filteredConfig?.[0]?.form?.[0]?.isLast) {
        const reqCreate = async () => {
          let payloadData = { ...draftData };
          payloadData.hierarchyType = hierarchyType;
          payloadData.startDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate
            ? Digit.Utils.pt.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate, "daystart")
            : null;
          payloadData.endDate = totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate
            ? Digit.Utils.pt.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate)
            : null;
          payloadData.tenantId = tenantId;
          payloadData.action = "create";
          payloadData.parentId = null;
          payloadData.campaignName = totalFormData?.HCM_CAMPAIGN_NAME?.campaignName;
          if (totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData) {
            payloadData.boundaries = totalFormData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData;
          }
          const temp = resourceData(
            totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]
          );
          payloadData.resources = temp;
          payloadData.projectType = totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code;
          payloadData.additionalDetails = {
            beneficiaryType: totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType,
            key: currentKey,
            targetId: dataParams?.boundaryId,
            facilityId: dataParams?.facilityId,
            userId: dataParams?.userId,
          };
          if (totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure) {
            payloadData.additionalDetails.cycleData = totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
          } else {
            payloadData.additionalDetails.cycleData = {};
          }
          if (totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule) {
            const temp = restructureData(totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule, totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure , DeliveryConfig , totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code);
            payloadData.deliveryRules =  [temp?.[0]];
            // payloadData.deliveryRules = totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
          }
          if (compareIdentical(draftData, payloadData) === false) {
            await updateCampaign(payloadData, {
              onError: (error, variables) => {
                console.log(error);
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
                    actionLabel: "HCM_CONFIGURE_APP_RESPONSE_ACTION",
                    actionLink: `/${window.contextPath}/employee/campaign/checklist/search?name=${data?.CampaignDetails?.campaignName}&campaignId=${data?.CampaignDetails?.id}&projectType=${data?.CampaignDetails?.projectType}`,
                    secondaryActionLabel: "MY_CAMPAIGN",
                    secondaryActionLink: `/${window?.contextPath}/employee/campaign/my-campaign`,
                    name: data?.CampaignDetails?.campaignName,
                    projectId: data?.CampaignDetails?.projectId,
                    data: data,
                  }
                );
                Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
              },
            });
          }
        };

        reqCreate();
      } else if (!isDraftCreated && !id) {
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
            totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]
          );
          payloadData.resources = temp;
          payloadData.projectType = totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code;
          payloadData.additionalDetails = {
            beneficiaryType: totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType,
            key: currentKey,
            targetId: dataParams?.boundaryId,
            facilityId: dataParams?.facilityId,
            userId: dataParams?.userId,
          };
          if (totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure) {
            payloadData.additionalDetails.cycleData = totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
          } else {
            payloadData.additionalDetails.cycleData = {};
          }
          if (totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule) {
            const temp = restructureData(totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule ,  totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure ,DeliveryConfig ,totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code);
            payloadData.deliveryRules = temp?.[0];
            // payloadData.deliveryRules = totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
          }

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
            totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0],
            totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]
          );
          payloadData.resources = temp;
          payloadData.projectType = totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code;
          payloadData.additionalDetails = {
            beneficiaryType: totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.beneficiaryType,
            key: currentKey,
            targetId: dataParams?.boundaryId,
            facilityId: dataParams?.facilityId,
            userId: dataParams?.userId,
          };
          if (totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure) {
            payloadData.additionalDetails.cycleData = totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
          } else {
            payloadData.additionalDetails.cycleData = {};
          }
          if (totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule) {
            const temp = restructureData(totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule , totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure , DeliveryConfig ,totalFormData?.HCM_CAMPAIGN_TYPE?.projectType?.code);
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
  }, [shouldUpdate]);

  function validateCycleData(data) {
    const { cycle, deliveries } = data?.cycleConfigure?.cycleConfgureDate;
    const cycleData = data.cycleConfigure.cycleData;
    let dateError = [];

    [...Array(cycle)].forEach((item, index) => {
      const check = cycleData?.find((i) => i?.key === index + 1);
      if (!check?.fromDate || !check?.toDate) {
        dateError.push({
          name: `CYCLE_${index + 1}`,
          cycle: index + 1,
          dateError: true,
          // error: `Dates are missing in Cycle {CYCLE_NO}${index + 1}`,
          error: t(`CAMPAIGN_SUMMARY_DATE_MISSING_ERROR`, { CYCLE_NO: index + 1 }),
          button: t(`CAMPAIGN_SUMMARY_ADD_DATE_ACTION`),
        });
      }
    });

    return dateError;
  }

  function validateDeliveryRules(data, projectType, cycleConfigureData) {
    let isValid = true;
    let deliveryRulesError = [];
    let dateError = validateCycleData(cycleConfigureData);

    // Iterate over deliveryRule array
    data.deliveryRule.forEach((cycle) => {
      cycle.deliveries.forEach((delivery) => {
        delivery.deliveryRules.forEach((rule) => {
          // Validate attributes and products length
          if (projectType === "MR-DN" && !rule?.deliveryType) {
            isValid = false;
            deliveryRulesError?.push({
              name: `CYCLE_${cycle?.cycleIndex}`,
              cycle: cycle?.cycleIndex,
              error: t(`CAMPAIGN_SUMMARY_DELIVERY_TYPE_MISSING_ERROR`, {
                CONDITION_NO: rule?.ruleKey,
                DELIVERY_NO: delivery?.deliveryIndex,
                CYCLE_NO: cycle?.cycleIndex,
              }),
              button: t(`CAMPAIGN_SUMMARY_ADD_DELIVERY_TYPE_ACTION`),
            });
          }
          if (rule.attributes.length === 0) {
            isValid = false;
            deliveryRulesError?.push({
              name: `CYCLE_${cycle?.cycleIndex}`,
              cycle: cycle?.cycleIndex,
              error: t(`CAMPAIGN_SUMMARY_VALUES_MISSING_ERROR`, {
                CONDITION_NO: rule?.ruleKey,
                DELIVERY_NO: delivery?.deliveryIndex,
                CYCLE_NO: cycle?.cycleIndex,
              }),
              button: t(`CAMPAIGN_SUMMARY_ADD_VALUES_ACTION`),
            });
          }
          if (rule.products.length === 0) {
            isValid = false;
            deliveryRulesError?.push({
              name: `CYCLE_${cycle?.cycleIndex}`,
              cycle: cycle?.cycleIndex,
              error: t(`CAMPAIGN_SUMMARY_PRODUCT_MISSING_ERROR`, {
                CONDITION_NO: rule?.ruleKey,
                DELIVERY_NO: delivery?.deliveryIndex,
                CYCLE_NO: cycle?.cycleIndex,
              }),
              button: t(`CAMPAIGN_SUMMARY_ADD_PRODUCT_ACTION`),
            });
          }

          rule.attributes.forEach((attribute) => {
            // Check if attribute, operator, and value are empty
            if (attribute.attribute === "" || attribute.operator === null || attribute.value === "") {
              if (attribute?.operator?.code === "IN_BETWEEN" && attribute?.toValue !== "" && attribute?.fromValue !== "") {
                isValid = true;
              } else {
                deliveryRulesError?.push({
                  name: `CYCLE_${cycle?.cycleIndex}`,
                  cycle: cycle?.cycleIndex,
                  error: t(`CAMPAIGN_SUMMARY_ATTRIBUTES_MISSING_ERROR`, {
                    CONDITION_NO: rule?.ruleKey,
                    DELIVERY_NO: delivery?.deliveryIndex,
                    CYCLE_NO: cycle?.cycleIndex,
                  }),
                  // error: `Attributes missing in delivery condition ${rule?.ruleKey} delivery ${delivery?.deliveryIndex}`,
                  button: t(`CAMPAIGN_SUMMARY_ADD_ATTRIBUTES_ACTION`),
                });
                isValid = false;
              }
            }
          });

          rule.products.forEach((product) => {
            // Check if count and value are empty
            if (product.count === null || product.value === null) {
              isValid = false;
            }
          });
        });
      });
    });

    setSummaryErrors((prev) => {
      return {
        ...prev,
        deliveryErrors: [...deliveryRulesError, ...dateError],
      };
    });
    return isValid;
    // ? "Delivery rules are valid"
    // : "Attributes, operators, values, count, or value are not empty in delivery rules or attributes/products length is 0";
  }

  function checkAttributeValidity(data) {
    for (const rule of data?.deliveryRule) {
      for (const delivery of rule?.deliveries) {
        for (const rule of delivery?.deliveryRules) {
          for (const attribute of rule?.attributes) {
            if (
              attribute?.operator &&
              attribute?.operator?.code === "IN_BETWEEN" &&
              attribute?.fromValue &&
              attribute?.toValue &&
              attribute?.fromValue !== "" &&
              attribute?.toValue !== "" &&
              Number(attribute?.toValue) >= Number(attribute?.fromValue)
            ) {
              // return `Error: Attribute "${attribute?.attribute?.code ? attribute?.attribute?.code : attribute?.attribute}" has invalid range (${
              //   attribute.toValue
              // } to ${attribute.fromValue})`;
              return "CAMPAIGN_IN_BETWEEN_ERROR";
            } else if (attribute?.value === 0 || attribute?.value === "0") {
              return "CAMPAIGN_VALUE_ZERO_ERROR";
            }
          }
        }
      }
    }
    return false;
  }

  function validateBoundaryLevel(data) {
    // Extracting boundary hierarchy from hierarchy definition
    const boundaryHierarchy = hierarchyDefinition?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [];

    // Find the index of the lowest hierarchy
    const lowestIndex = boundaryHierarchy.findIndex((item) => item?.boundaryType === lowestHierarchy);

    // Create a set of boundary types including only up to the lowest hierarchy
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
      case "campaignName":
        if (typeof formData?.campaignName !== "string" || !formData?.campaignName.trim()) {
          setShowToast({ key: "error", label: "CAMPAIGN_NAME_MISSING_TYPE_ERROR" });
          return false;
        } else if (formData.campaignName.length > 250) {
          setShowToast({ key: "error", label: "CAMPAIGN_NAME_TOO_LONG_ERROR" });
          return false;
        } else {
          setShowToast(null);
          return true;
        }
      case "projectType":
        if (!formData?.projectType) {
          setShowToast({ key: "error", label: "PROJECT_TYPE_UNDEFINED_ERROR" });
          return false;
        } else {
          setShowToast(null);
          return true;
        }
      case "campaignDates":
        const startDateObj = new Date(formData?.campaignDates?.startDate);
        const endDateObj = new Date(formData?.campaignDates?.endDate);
        if (!formData?.campaignDates?.startDate || !formData?.campaignDates?.endDate) {
          setShowToast({ key: "error", label: `${t("HCM_CAMPAIGN_DATE_MISSING")}` });
          return false;
        } else if (endDateObj.getTime() === startDateObj.getTime()) {
          setShowToast({ key: "error", label: `${t("HCM_CAMPAIGN_END_DATE_EQUAL_START_DATE")}` });
          return false;
        } else if (endDateObj.getTime() < startDateObj) {
          setShowToast({ key: "error", label: `${t("HCM_CAMPAIGN_END_DATE_BEFORE_START_DATE")}` });
          return false;
        } else {
          setShowToast(null);
          return true;
        }
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

      case "cycleConfigure":
        const cycleNumber = formData?.cycleConfigure?.cycleConfgureDate?.cycle;
        const deliveryNumber = formData?.cycleConfigure?.cycleConfgureDate?.deliveries;
        if (cycleNumber === "" || cycleNumber === 0 || deliveryNumber === "" || deliveryNumber === 0) {
          setShowToast({ key: "error", label: "DELIVERY_CYCLE_ERROR" });
          return false;
        } else {
          setShowToast(null);
          return true;
        }
      case "deliveryRule":
        const isAttributeValid = checkAttributeValidity(formData);
        if (isAttributeValid) {
          setShowToast({ key: "error", label: isAttributeValid });
          return false;
        }
        setShowToast(null);
        return;
      case "DeliveryDetailsSummary":
        const cycleConfigureData = totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE;
        const isCycleError = validateCycleData(cycleConfigureData);
        const deliveryCycleData = totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA;
        const isDeliveryError = validateDeliveryRules(
          deliveryCycleData,
          totalFormData?.["HCM_CAMPAIGN_TYPE"]?.projectType?.code?.toUpperCase(),
          cycleConfigureData
        );
        if (isCycleError?.length > 0) {
          setShowToast({ key: "error", label: "DELIVERY_CYCLE_MISMATCH_LENGTH_ERROR" });
          return false;
        }
        if (isDeliveryError === false) {
          setShowToast({ key: "error", label: "DELIVERY_RULES_ERROR" });
          return false;
        }
        setShowToast(null);
        return true;
      case "DataUploadSummary":
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
          return false;
        }
        if (isFacilityError) {
          setShowToast({ key: "error", label: "FACILITY_DETAILS_ERROR" });
          return false;
        }
        if (isUserError) {
          setShowToast({ key: "error", label: "USER_DETAILS_ERROR" });
          return false;
        }
        setShowToast(null);
        return true;
      case "summary":
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
      (filteredConfig[0].form[0].body[0].skipAPICall && id)
    ) {
      setShouldUpdate(true);
    }
    if (isChangeDates === "true" && currentKey == 6) {
      setCurrentKey(14);
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

    const filteredSteps = campaignConfig[0].form.filter((item) => item.stepCount === String(step + 1));

    const maxKeyStep = filteredSteps.reduce((max, step) => {
      return parseInt(step.key) > parseInt(max.key) ? step : max;
    });

    const key = parseInt(filteredSteps[0].key);
    const name = filteredSteps[0].name;
    if (step === 6 && Object.keys(totalFormData).includes("HCM_CAMPAIGN_UPLOAD_USER_DATA")) {
      setCurrentKey(14);
      setCurrentStep(5);
    } else if (step === 1 && totalFormData["HCM_CAMPAIGN_NAME"] && totalFormData["HCM_CAMPAIGN_TYPE"] && totalFormData["HCM_CAMPAIGN_DATE"]) {
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
    findHighestStepCount({totalFormData,campaignConfig,isDraft,setActive});
  }, [totalFormData, campaignConfig]);

  const onSecondayActionClick = () => {
    if (currentKey > 1) {
      setShouldUpdate(false);
      setCurrentKey(currentKey - 1);
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
    return <Loader />;
  }

  if (isDraft === "true" && !draftData) {
    return <Loader />;
  }

  function onActionSelect(action) {
    setDisplayMenu(false);
    switch (action) {
      case "HCM_UPDATE_DATES":
        history.push(`/${window.contextPath}/employee/campaign/update-dates-boundary?id=${id}`, {
          name: draftData?.campaignName,
          projectId: draftData?.projectId,
          data: draftData,
        });
        break;
        case "HCM_CONFIGURE_APP":
          history.push(`/${window.contextPath}/employee/campaign/checklist/search?name=${draftData?.campaignName}&campaignId=${draftData?.id}`, {
            name: draftData?.campaignName,
            projectId: draftData?.projectId,
            data: draftData,
          });
          break;
          case "HCM_UPDATE_CAMPAIGN":
            history.push( `/${window.contextPath}/employee/campaign/update-campaign?key=1&parentId=${draftData?.id}`, {
              name: draftData?.campaignName,
              projectId: draftData?.projectId,
              data: draftData,
            });
            break;
      default:
        break;
    }
  }

  return (
    <React.Fragment>
      {noAction !== "false" && (
        <Stepper
          customSteps={["HCM_CAMPAIGN_SETUP_DETAILS", "HCM_BOUNDARY_DETAILS", "HCM_DELIVERY_DETAILS", "HCM_UPLOAD_DATA", "HCM_REVIEW_DETAILS" , "HCM_CONFIGURE_APP"]}
          currentStep={currentStep + 1}
          onStepClick={onStepClick}
          activeSteps={active}
        />
      )}
      <FormComposerV2
        config={config?.form.map((config) => {
          return {
            ...config,
            body: config?.body.filter((a) => !a.hideInEmployee),
          };
        })}
        onSubmit={onSubmit}
        showSecondaryLabel={currentKey > 1 ? true : false}
        secondaryLabel={isChangeDates === "true" && currentKey == 6 ? t("HCM_BACK") : noAction === "false" ? null : t("HCM_BACK")}
        actionClassName={"actionBarClass"}
        className="setup-campaign"
        cardClassName="setup-campaign-card"
        noCardStyle={true}
        // noCardStyle={currentStep === 7 ? false : true}
        onSecondayActionClick={onSecondayActionClick}
        label={
          isChangeDates === "true" && currentKey == 14
            ? t("HCM_UPDATE_DATE")
            : isChangeDates === "true"
            ? null
            : noAction === "false"
            ? null
            : filteredConfig?.[0]?.form?.[0]?.isLast === true
            ? t("HCM_SUBMIT")
            : t("HCM_NEXT")
        }
      />
      {actionBar === "true" && (
        <ActionBar style={{ zIndex: "19" }}>
          {displayMenu ? (
            <Menu
              options={[
                "HCM_UPDATE_DATES",
                "HCM_CONFIGURE_APP",
                "HCM_UPDATE_CAMPAIGN",
              ]}
              t={t}
              onSelect={onActionSelect}
            />
          ) : null}
          <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
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

export default SetupCampaign;
