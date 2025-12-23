/**
 * This file contains all the validations for create campaign flow
 */
import { VALIDATION_FUNCTIONS, allRulesMet } from "./campaignNameValidators";

 const  validateCycleData=(data,t)=> {
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
};

 const  validateDeliveryRules=(data, projectType, cycleConfigureData,t,setSummaryErrors)=> {
  let isValid = true;
  let deliveryRulesError = [];
  let dateError = validateCycleData(cycleConfigureData,t);

  // Iterate over deliveryRule array
  data.deliveryRule.forEach((cycle) => {
    cycle.deliveries.forEach((delivery) => {
      delivery.deliveryRules.forEach((rule) => {
        // Validate attributes and products length
        if (!rule?.deliveryType) {
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
          if (product.quantity === null || product.value === null) {
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
};

 const  checkAttributeValidity=(data)=> {
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
            Number(attribute?.toValue) <= Number(attribute?.fromValue)
          ) {
            // return `Error: Attribute "${attribute?.attribute?.code ? attribute?.attribute?.code : attribute?.attribute}" has invalid range (${
            //   attribute.toValue
            // } to ${attribute.fromValue})`;
            return "CAMPAIGN_IN_BETWEEN_ERROR";
          } else if (attribute?.value !== "" && attribute?.value !== undefined && attribute?.value !== null && Number(attribute?.value) === 0) {
            return "CAMPAIGN_VALUE_ZERO_ERROR";
          }
        }
      }
    }
  }
  return false;
};

const hasInvalidMaxCountAttribute = (deliveryRules = []) => {
  return deliveryRules.some((cycle) =>
    cycle?.deliveries?.some((delivery) =>
      delivery?.deliveryRules?.some((rule) => {
        const attributeCodes = rule?.attributes?.map((attr) => attr?.attribute?.code) || [];
        const hasMaxCount = attributeCodes.includes("maxCount");
        const hasMemberCount = attributeCodes.includes("memberCount");
        return hasMaxCount && !hasMemberCount;
      })
    )
  );
};

const validateBoundaryLevel = (data, hierarchyDefinition, lowestHierarchy) => {
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
};

 const  recursiveParentFind=(filteredData,lowestHierarchy)=> {
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
};

// validating the screen data on clicking next button
export const  handleValidate = ({formData,t,setShowToast,hierarchyDefinition,lowestHierarchy,hierarchyType,totalFormData,setFetchUpload,setSummaryErrors}) => {
  const key = Object.keys(formData)?.[0];
  switch (key) {
    case "campaignName":
      if (typeof formData?.campaignName !== "string" || !formData?.campaignName.trim()) {
        setShowToast({ key: "error", label: "CAMPAIGN_NAME_MISSING_TYPE_ERROR" });
        return false;
      }
      
      // Validate against all naming rules
      const validationResults = VALIDATION_FUNCTIONS.map((validator) => validator(formData.campaignName));
      if (!allRulesMet(validationResults.map((isValid) => ({ isValid })))) {
        setShowToast({ key: "error", label: "CAMPAIGN_NAME_RULES_NOT_MET" });
        return false;
      }
      setShowToast(null);
      return true;
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
        const validateBoundary = validateBoundaryLevel(formData?.boundaryType?.selectedData, hierarchyDefinition, lowestHierarchy);
        const missedType = recursiveParentFind(formData?.boundaryType?.selectedData, lowestHierarchy);
        if (!validateBoundary) {
          setShowToast({ key: "error", label: t("HCM_CAMPAIGN_ALL_THE_LEVELS_ARE_MANDATORY") });
          return false;
        } else if (recursiveParentFind(formData?.boundaryType?.selectedData, lowestHierarchy).length > 0) {
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

    // case "cycleConfigure":
    //   const cycleNumber = formData?.cycleConfigure?.cycleConfgureDate?.cycle;
    //   const deliveryNumber = formData?.cycleConfigure?.cycleConfgureDate?.deliveries;
    //   const cycleData = formData?.cycleConfigure?.cycleData || [];

    //   if (cycleNumber === "" || cycleNumber === 0 || deliveryNumber === "" || deliveryNumber === 0) {
    //     setShowToast({ key: "error", label: "DELIVERY_CYCLE_ERROR" });
    //     return false;
    //   } else {
    //     setShowToast(null);
    //     return true;
    //   }

    case "cycleConfigure":
      const cycleNumber = formData?.cycleConfigure?.cycleConfgureDate?.cycle;
      const deliveryNumber = formData?.cycleConfigure?.cycleConfgureDate?.deliveries;
      const cycleData = formData?.cycleConfigure?.cycleData || [];

      // Check if cycle/delivery count is missing or zero
      if (!cycleNumber || !deliveryNumber) {
        setShowToast({ key: "error", label: "DELIVERY_CYCLE_ERROR" });
        return false;
      }

      // Validate if all cycle entries have fromDate and toDate
      if (cycleData.length < cycleNumber) {
        setShowToast({ key: "error", label: "HCM_ALL_CYCLE_DATES_MANDATORY" });
        return false;
      }

      // 3. Validate required cycles have fromDate and toDate
      const requiredCycles = cycleData.slice(0, cycleNumber);
      const invalidCycles = requiredCycles.some((cycle) => !cycle.fromDate || !cycle.toDate);

      if (invalidCycles) {
        setShowToast({ key: "error", label: "HCM_ALL_CYCLE_DATES_MANDATORY" });
        return false;
      }

      setShowToast(null);
      return true;

    case "deliveryRule":
      const deliveryRules = formData?.deliveryRule;
      const validateMaxCondition = hasInvalidMaxCountAttribute(deliveryRules);
      if (validateMaxCondition) {
        setShowToast({ key: "error", label: "INVALID_USE_OF_MAX_COUNT" });
        return false; 
      }
      const isAttributeValid = checkAttributeValidity(formData);
      if (isAttributeValid) {
        setShowToast({ key: "error", label: isAttributeValid });
        return false;
      }
      setShowToast(null);
      return;
    case "DeliveryDetailsSummary":
      const cycleConfigureData = totalFormData?.HCM_CAMPAIGN_CYCLE_CONFIGURE;
      const isCycleError = validateCycleData(cycleConfigureData, t);
      const deliveryCycleData = totalFormData?.HCM_CAMPAIGN_DELIVERY_DATA;
      const isDeliveryError = validateDeliveryRules(
        deliveryCycleData,
        totalFormData?.["HCM_CAMPAIGN_TYPE"]?.projectType?.code?.toUpperCase(),
        cycleConfigureData,
        t,
        setSummaryErrors
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