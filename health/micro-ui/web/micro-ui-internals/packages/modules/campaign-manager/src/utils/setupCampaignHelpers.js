
export const cycleDataRemap=(data)=> {
    if (!data) return null;
    const uniqueCycleObjects = Object.values(
      data?.reduce((acc, obj) => {
        acc[obj?.cycleNumber] = acc[obj?.cycleNumber] || obj;
        return acc;
      }, {})
    );
    return uniqueCycleObjects.map((i, n) => {
      return {
        key: i.cycleNumber,
        fromDate: i?.startDate ? Digit.DateUtils.ConvertEpochToDate(i?.startDate)?.split("/")?.reverse()?.join("-") : null,
        toDate: i?.endDate ? Digit.DateUtils.ConvertEpochToDate(i?.endDate)?.split("/")?.reverse()?.join("-") : null,
      };
    });
  }
  
  export const  getOperatorSymbol=(operator)=> {
    const operatorMapping = {
      "LESS_THAN": "<",
      "LESS_THAN_EQUAL_TO": "<=",
      "GREATER_THAN": ">",
      "GREATER_THAN_EQUAL_TO": ">=",
      "EQUAL_TO": "==",
      "NOT_EQUAL_TO": "!=",
      "IN_BETWEEN": "IN" // Map IN_BETWEEN to a keyword if needed
    };
    return operatorMapping[operator] || ""; // Default to empty if not found
  }
  export const  restructureData=(data, cycleData, DeliveryConfig, projectType)=> {
    const deliveryConfig = DeliveryConfig?.find((e) => e.code === String(projectType));
    if (deliveryConfig) {
      delete deliveryConfig.cycles;   
      delete deliveryConfig.resources;  
    }
  
    const resourcesMap = new Map();
    const ageInfo = { maxAge: -Infinity, minAge: Infinity };  
  
    const cycles = data.map(cycle => {
      const cycleStartDate = Digit.Utils.pt.convertDateToEpoch(cycleData?.cycleData?.[0]?.fromDate);
      const cycleEndDate = Digit.Utils.pt.convertDateToEpoch(cycleData?.cycleData?.[0]?.toDate);
  
      return {
        mandatoryWaitSinceLastCycleInDays: null,
        startDate: cycleStartDate,
        endDate: cycleEndDate,
        id: parseInt(cycle.cycleIndex, 10),
        deliveries: cycle?.deliveries?.map(delivery => processDelivery(delivery, resourcesMap, ageInfo))
      };
    });
  
    const resources = Array.from(resourcesMap.values());
    if (deliveryConfig) {
      deliveryConfig.cycles = cycles;
      deliveryConfig.resources = resources;
      deliveryConfig.validMaxAge = ageInfo.maxAge === -Infinity ? null : ageInfo.maxAge; 
      deliveryConfig.validMinAge = ageInfo.minAge === Infinity ? null : ageInfo.minAge; 
    }
    return [deliveryConfig];
  }
  
  export const  reverseDeliveryRemap=(data, t) =>{
    if (!data) return null;
    const reversedData = [];
    let currentCycleIndex = null;
    let currentCycle = null;
  
    const operatorMapping = {
      "<=": "LESS_THAN_EQUAL_TO",
      ">=": "GREATER_THAN_EQUAL_TO",
      "<": "LESS_THAN",
      ">": "GREATER_THAN",
      "==": "EQUAL_TO",
      "!=": "NOT_EQUAL_TO",
      IN_BETWEEN: "IN_BETWEEN",
    };
  
    const cycles = data?.[0]?.cycles || [];
    const mapProductVariants = (productVariants) => {
      return productVariants.map((variant, key) => ({
        key: key + 1,
        count: 1,
        value: variant.productVariantId,
        name: variant.name,
      }));
    };
  
    const parseConditionAndCreateRules = (condition, ruleKey, products) => {
      const conditionParts = condition.split("and").map((part) => part.trim());
      let rules = [];
  
      conditionParts.forEach((part) => {
        const parts = part.split(" ").filter(Boolean);
        let attributes = [];
  
        // Handle "IN_BETWEEN" operator
        if (parts.length === 5 && (parts[1] === "<=" || parts[1] === "<") && (parts[3] === "<" || parts[3] === "<=")) {
          const toValue = parts[0];
          const fromValue = parts[4];
          attributes.push({
            key: 1,
            operator: { code: operatorMapping["IN_BETWEEN"] },
            attribute: { code: parts[2] },
            fromValue,
            toValue,
          });
        } else {
       
          const match = part.match(/(.*?)\s*(<=|>=|<|>|==|!=)\s*(.*)/);
          if (match) {
            const attributeCode = match[1].trim();
            const operatorSymbol = match[2].trim();
            const value = match[3].trim();
            attributes.push({
              key: attributes.length + 1,
              value,
              operator: { code: operatorMapping[operatorSymbol] },
              attribute: { code: attributeCode },
            });
          }
        }
        rules.push({
          ruleKey: ruleKey + 1,
          delivery: {},
          products,
          attributes,
        });
      });
  
      return rules;
    };
    const mapDoseCriteriaToDeliveryRules = (doseCriteria) => {
      return doseCriteria?.flatMap((criteria, ruleKey) => {
        const products = mapProductVariants(criteria.ProductVariants);
        return parseConditionAndCreateRules(criteria.condition, ruleKey, products);
      });
    };
  
    const mapDeliveries = (deliveries) => {
      return deliveries?.map((delivery, deliveryIndex) => ({
        active: deliveryIndex === 0,
        deliveryIndex: String(deliveryIndex + 1),
        deliveryRules: mapDoseCriteriaToDeliveryRules(delivery.doseCriteria),
      }));
    };
  
    const transformedCycles = cycles.map((cycle) => ({
      active: true,
      cycleIndex: String(cycle.id),
      deliveries: mapDeliveries(cycle.deliveries),
    }));
  
  
  
    return transformedCycles;
  
  }
  
  export const  processDelivery=(delivery, resourcesMap, ageInfo)=> {
  
    return {
      id: parseInt(delivery.deliveryIndex, 10),
      deliveryStrategy: delivery.deliveryStrategy || "DIRECT",
      mandatoryWaitSinceLastDeliveryInDays: null,
      doseCriteria: delivery.deliveryRules.map(rule => {
        const doseCriteriaResult = processDoseCriteria(rule, resourcesMap);
        const ages = extractAgesFromConditions(doseCriteriaResult.condition);
        if (ages.length > 0) { 
          ageInfo.maxAge = Math.max(ageInfo.maxAge, ...ages);
          ageInfo.minAge = Math.min(ageInfo.minAge, ...ages);
        }
        return doseCriteriaResult;
      })
    };
  }
  export const  processDoseCriteria =(rule, resourcesMap) =>{
    rule.products.forEach(product => {
      if (resourcesMap.has(product.value)) {
        resourcesMap.get(product.value).count += product.count;
      } else {
        resourcesMap.set(product.value, {
          productVariantId: product.value,
          isBaseUnitVariant: false,
          name: product.name,
          count: product.count
        });
      }
    });
  
    const conditions = rule.attributes.map(attr => {
      if (attr?.operator?.code === "IN_BETWEEN") {
        return `${attr.toValue} <= ${attr.attribute.code} < ${attr.fromValue}`;
      } else {
        return `${attr?.attribute?.code}${getOperatorSymbol(attr?.operator?.code)}${attr?.value}`;
      }
    });
  
    return {
      condition: conditions.join(" and "),
      ProductVariants: rule.products.map(product => ({
        productVariantId: product.value,
        name: product.name
      }))
    };
  }
  
  export const  extractAgesFromConditions=(condition)=> {
    const agePattern = /\b(\d+)\b/g;
    const matches = condition.match(agePattern);
    return matches ? matches.map(Number) : []; 
  }
  
  
  export const  groupByTypeRemap=(data)=> {
    if (!data) return null;
  
    const result = {};
  
    data.forEach((item) => {
      const type = item?.type;
      const boundaryType = item?.type;
      const parentCode = item?.parent !== undefined ? item.parent : null;
  
      if (!result[type]) {
        result[type] = {};
      }
  
      if (!result[type][parentCode]) {
        result[type][parentCode] = {
          parentCode,
          boundaryTypeData: {
            TenantBoundary: [
              {
                boundary: [],
              },
            ],
          },
        };
      }
  
      const targetBoundaryArray = result[type][parentCode].boundaryTypeData.TenantBoundary[0].boundary;
      targetBoundaryArray.push({ ...item, boundaryType });
    });
  }
  // Example usage:
  // updateUrlParams({ id: 'sdjkhsdjkhdshfsdjkh', anotherParam: 'value' });
  export const  updateUrlParams=(params) =>{
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }


  export const  compareIdentical = (draftData, payload) => {
    return _.isEqual(draftData, payload);
  };

  export const  resourceData=(facilityData, boundaryData, userData)=> {
    const resources = [facilityData, boundaryData, userData].filter((data) => data !== null && data !== undefined);
    return resources;
  }


  export const transformDraftDataToFormData =(draftData,projectType)=>{

    const delivery = Array.isArray(draftData?.deliveryRules) ? draftData?.deliveryRules : [];
    const filteredProjectType = projectType?.["HCM-PROJECT-TYPES"]?.projectTypes?.filter((i) => i?.code === draftData?.projectType);
    const restructureFormData = {
      HCM_CAMPAIGN_TYPE: { projectType: filteredProjectType?.[0] },
      HCM_CAMPAIGN_NAME: {
        campaignName: draftData?.campaignName,
      },
      HCM_CAMPAIGN_DATE: {
        campaignDates: {
          startDate: draftData?.startDate ? Digit.DateUtils.ConvertEpochToDate(draftData?.startDate)?.split("/")?.reverse()?.join("-") : "",
          endDate: draftData?.endDate ? Digit.DateUtils.ConvertEpochToDate(draftData?.endDate)?.split("/")?.reverse()?.join("-") : "",
        },
      },
      HCM_CAMPAIGN_CYCLE_CONFIGURE: {
        cycleConfigure: {
          cycleConfgureDate: draftData?.additionalDetails?.cycleData?.cycleConfgureDate
            ? draftData?.additionalDetails?.cycleData?.cycleConfgureDate
            : {
                cycle: delivery?.map((obj) => obj?.cycleNumber)?.length > 0 ? Math.max(...delivery?.map((obj) => obj?.cycleNumber)) : 1,
                deliveries: delivery?.map((obj) => obj?.deliveryNumber)?.length > 0 ? Math.max(...delivery?.map((obj) => obj?.deliveryNumber)) : 1,
                refetch: true,
              },
          cycleData: draftData?.additionalDetails?.cycleData?.cycleData
            ? draftData?.additionalDetails?.cycleData?.cycleData
            : cycleDataRemap(delivery),
        },
      },
      HCM_CAMPAIGN_DELIVERY_DATA: {
        deliveryRule: reverseDeliveryRemap(delivery),
        // deliveryRule: delivery,
      },
      HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA: {
        boundaryType: {
          boundaryData: groupByTypeRemap(draftData?.boundaries),
          selectedData: draftData?.boundaries,
        },
      },
      HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA: {
        uploadBoundary: {
          uploadedFile: draftData?.resources?.filter((i) => i?.type === "boundaryWithTarget"),
          isSuccess: draftData?.resources?.filter((i) => i?.type === "boundaryWithTarget").length > 0,
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
    return restructureFormData;
  }


 export const filterCampaignConfig = (campaignConfig, currentKey) => {
    return campaignConfig
      .map((config) => {
        return {
          ...config,
          form: config?.form.filter((step) => parseInt(step.key) === currentKey),
        };
      })
      .filter((config) => config.form.length > 0);
  };



  export const filterNonEmptyValues = (obj) => {
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

  export  const hasNonEmptyValue = (obj) => {
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




  export const draftFilterStep = (totalFormData,campaignConfig) => {
    const stepFind = (name) => {
      const step = campaignConfig?.[0]?.form.find((step) => step.name === name);
      return step ? parseInt(step.stepCount, 14) : null;
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

  export const findHighestStepCount = ({totalFormData,campaignConfig,isDraft,setActive}) => {
    const totalFormDataKeys = Object.keys(totalFormData);

    const nonNullFormDataKeys = filterNonEmptyValues(totalFormData);

    const relatedSteps = campaignConfig?.[0]?.form.filter((step) => nonNullFormDataKeys.includes(step.name));

    const highestStep = relatedSteps.reduce((max, step) => Math.max(max, parseInt(step.stepCount)), 0);
    if (isDraft == "true") {
      const filteredStep = draftFilterStep(totalFormData,campaignConfig);
      setActive(filteredStep);
    } else {
      setActive(highestStep);
    }
  };