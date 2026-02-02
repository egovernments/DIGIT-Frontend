import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ViewComposer } from "@egovernments/digit-ui-react-components";
import { Toast, Loader, HeaderComponent } from "@egovernments/digit-ui-components";
import TagComponent from "./TagComponent";

function mergeObjects(item) {
  const arr = item;
  const mergedArr = [];
  const mergedAttributes = new Set();

  arr.forEach((obj) => {
    if (!mergedAttributes.has(obj.attribute)) {
      const sameAttrObjs = arr.filter((o) => o.attribute === obj.attribute);

      if (sameAttrObjs.length > 1) {
        const fromValue = Math.min(...sameAttrObjs.map((o) => o.value));
        const toValue = Math.max(...sameAttrObjs.map((o) => o.value));

        mergedArr.push({
          fromValue,
          toValue,
          value: fromValue > 0 && toValue > 0 ? `${fromValue} to ${toValue}` : null,
          operator: "IN_BETWEEN",
          attribute: obj.attribute,
        });

        mergedAttributes.add(obj.attribute);
      } else {
        mergedArr.push(obj);
      }
    }
  });

  return mergedArr;
}

function loopAndReturn(dataa, t) {
  let newArray = [];
  const data = dataa?.map((i) => ({ ...i, operator: i?.operator, attribute: i?.attribute }));

  data.forEach((item) => {
    // Check if an object with the same attribute already exists in the newArray
    const existingIndex = newArray.findIndex((element) => element.attribute === item.attribute);
    if (existingIndex !== -1) {
      // If an existing item is found, replace it with the new object
      const existingItem = newArray[existingIndex];
      newArray[existingIndex] = {
        attribute: existingItem.attribute,
        operator: "IN_BETWEEN",
        toValue: existingItem.value && item.value ? Math.min(existingItem.value, item.value) : null,
        fromValue: existingItem.value && item.value ? Math.max(existingItem.value, item.value) : null,
      };
    } else if (item?.operator === "EQUAL_TO") {
      newArray.push({
        ...item,
        value: item?.value ? t(item?.value) : null,
      });
    } else {
      newArray.push(item);
    }
  });

  const withKey = newArray.map((i, c) => ({ key: c + 1, ...i }));
  const format = withKey.map((i) => {
    if (i.operator === "IN_BETWEEN") {
      return {
        ...i,
        value: `${i?.toValue ? i?.toValue : "N/A"}  to ${i?.fromValue ? i?.fromValue : "N/A"}`,
      };
    }
    return {
      ...i,
    };
  });
  return format;
}

function reverseDeliveryRemap(data, t) {
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
      quantity: variant.quantity,
      value: variant.productVariantId,
      name: variant.name,
    }));
  };
  const parseConditionAndCreateRules = (condition, ruleKey, products) => {
    const conditionParts = condition.split("and").map((part) => part.trim());
    let attributes = [];

    conditionParts.forEach((part) => {
      const parts = part.split(" ").filter(Boolean);

      // Handle "IN_BETWEEN" operator
      if (parts.length === 5 && (parts[1] === "<=" || parts[1] === "<") && (parts[3] === "<" || parts[3] === "<=")) {
        const fromValue = parts[0];
        const toValue = parts[4];
        attributes.push({
          key: attributes.length + 1,
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
    });
    return [
      {
        ruleKey: ruleKey + 1,
        delivery: {},
        products,
        attributes,
      },
    ];
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
const DeliveryDetailsSummary = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const noAction = searchParams.get("action");
  const [showToast, setShowToast] = useState(null);
  const [summaryErrors, setSummaryErrors] = useState(null);
  const isPreview = searchParams.get("preview");
  const [currentStep, setCurrentStep] = useState(1);
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const campaignName = window.Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_NAME?.campaignName;
  const handleRedirect = (step, activeCycle) => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    urlParams.set("key", step);
    urlParams.set("preview", false);
    if (activeCycle) {
      urlParams.set("activeCycle", activeCycle);
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    navigate(newUrl);
  };

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }

  useEffect(() => {
    updateUrlParams({ key: key });
    window.dispatchEvent(new Event("checking"));
  }, [key]);

  useEffect(() => {
    if (props?.props?.summaryErrors) {
      if (props?.props?.summaryErrors?.deliveryErrors) {
        const temp = props?.props?.summaryErrors?.deliveryErrors?.map((i) => {
          return {
            ...i,
            onClick: i?.dateError ? () => handleRedirect(7) : () => handleRedirect(8, i?.cycle),
          };
        });
        setSummaryErrors({ ...props?.props?.summaryErrors, deliveryErrors: temp });
      } else {
        setSummaryErrors(props?.props?.summaryErrors);
      }
    }
  }, [props?.props?.summaryErrors]);

  const { isLoading, data, error, refetch, isFetching } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
    },
    config: {
      select: (data) => {
        const target = data?.[0]?.deliveryRules;
        const cycleData = reverseDeliveryRemap(target, t);

        return {
          cards: [
            {
              sections: [
                {
                  type: "DATA",
                  cardHeader: { value: t("CAMPAIGN_DELIVERY_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  // cardSecondaryAction: noAction !== "false" && (
                  //   <div className="campaign-preview-edit-container" onClick={() => handleRedirect(7)}>
                  //     <span>{t(`CAMPAIGN_EDIT`)}</span>
                  //     <EditIcon />
                  //   </div>
                  // ),
                  values: [
                    {
                      key: "CAMPAIGN_NO_OF_CYCLES",
                      value: data?.[0]?.additionalDetails?.cycleData?.cycleConfgureDate?.cycle
                        ? data?.[0]?.additionalDetails?.cycleData?.cycleConfgureDate?.cycle
                        : t("CAMPAIGN_SUMMARY_NA"),
                    },
                    {
                      key: "CAMPAIGN_NO_OF_DELIVERIES",
                      value: data?.[0]?.additionalDetails?.cycleData?.cycleConfgureDate?.deliveries
                        ? data?.[0]?.additionalDetails?.cycleData?.cycleConfgureDate?.deliveries
                        : t("CAMPAIGN_SUMMARY_NA"),
                    },
                  ],
                },
              ],
            },
            ...cycleData?.map((item, index) => {
              return {
                name: `CYCLE_${index + 1}`,
                errorName: "deliveryErrors",
                sections: [
                  {
                    name: `CYCLE_${index + 1}`,
                    type: "COMPONENT",
                    cardHeader: { value: `${t("CYCLE")} ${item?.cycleIndex}`, inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                    // cardSecondaryAction: noAction !== "false" && (
                    //   <div className="campaign-preview-edit-container" onClick={() => handleRedirect(8)}>
                    //     <span>{t(`CAMPAIGN_EDIT`)}</span>
                    //     <EditIcon />
                    //   </div>
                    // ),
                    component: "CycleDataPreview",
                    props: {
                      data: item,
                    },
                  },
                ],
              };
            }),
          ],
          error: data?.[0]?.additionalDetails?.error,
          data: data?.[0],
          status: data?.[0]?.status,
        };
      },
      enabled: id ? true : false,
      staleTime: 0,
      cacheTime: 0,
    },
  });

  const closeToast = () => {
    setShowToast(null);
  };
  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);
  useEffect(() => {
    if (data?.status === "failed" && data?.error) {
      setShowToast({ label: data?.error, key: "error" });
    }
    if (data?.status === "creating") {
      setShowToast({ label: "CAMPAIGN_STATUS_CREATING_MESSAGE", key: "info" });
    }
    if (data?.status === "created" && data?.userGenerationSuccess?.length > 0) {
      setShowToast({ label: "CAMPAIGN_USER_GENERATION_SUCCESS", key: "success" });
    }
  }, [data]);

  const updatedObject = { ...data };

  const onStepClick = (currentStep) => {
    if (currentStep === 0) {
      setKey(7);
    } else if (currentStep === 2) setKey(9);
    else setKey(8);
  };
  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <>
      {(isLoading || (!data && !error) || isFetching) && <Loader page={true} variant={"PageLoader"} loaderText={t("DATA_SYNC_WITH_SERVER")} />}
      <div className="container-full">
        {/* <div className="card-container">
          <Card className="card-header-timeline">
            <TextBlock subHeader={t("HCM_DELIVERY_DETAILS")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper
              customSteps={["HCM_CYCLES", "HCM_DELIVERY_RULES", "HCM_SUMMARY"]}
              currentStep={3}
              onStepClick={onStepClick}
              direction={"vertical"}
            />
          </Card>
        </div> */}
        <div className="card-container-delivery">
          <TagComponent campaignName={campaignName} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <HeaderComponent className="summary-header">{t("HCM_DELIVERY_DETAILS_SUMMARY")}</HeaderComponent>
          </div>
          <div className="campaign-summary-container delivery-summary">
            <ViewComposer data={updatedObject} cardErrors={summaryErrors} />
            {showToast && (
              <Toast
                type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : "success"}
                label={t(showToast?.label)}
                onClose={closeToast}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryDetailsSummary;
