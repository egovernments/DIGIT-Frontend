import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { EditIcon, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { Button, InfoBannerIcon, Toast , PopUp } from "@egovernments/digit-ui-components";
import { DownloadIcon } from "@egovernments/digit-ui-react-components";
import { PRIMARY_COLOR, downloadExcelWithCustomName } from "../utils";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import TimelineComponent from "./TimelineComponent";

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


function boundaryDataGrp(boundaryData) {
  // Create an empty object to hold grouped data by type
  const groupedData = {};

  // Iterate through each boundary item in the data
  boundaryData.forEach((item) => {
    const { type } = item; // Extract the type

    // If the type doesn't exist in the groupedData, create an array for it
    if (!groupedData[type]) {
      groupedData[type] = [];
    }

    // Add the current item to its corresponding type array
    groupedData[type].push(item);
  });

  // Convert the grouped object into an array of objects
  const result = Object.keys(groupedData).map((type) => ({
    type, // The type of the boundary
    boundaries: groupedData[type], // All items that belong to this type
  }));

  return result;
}

const fetchResourceFile = async (tenantId, resourceIdArr) => {
  const res = await Digit.CustomService.getResponse({
    url: `/project-factory/v1/data/_search`,
    body: {
      SearchCriteria: {
        tenantId: tenantId,
        id: resourceIdArr,
      },
    },
  });
  return res?.ResourceDetails;
};
const fetchcd = async (tenantId, projectId) => {
  const url = getProjectServiceUrl();
  const reqCriteriaResource = {
    url: `${url}/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: 10,
      offset: 0,
    },
    body: {
      Projects: [
        {
          tenantId: tenantId,
          id: projectId,
        },
      ],
    },
    config:{
      enabled: projectId ? true: false
    }
  };
  try {
    const res = await Digit.CustomService.getResponse(reqCriteriaResource);
    return res?.Project?.[0];
  } catch (e) {
    console.log("error", e);
  }
};
const CampaignSummary = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const noAction = searchParams.get("action");
  const [showToast, setShowToast] = useState(null);
  const [userCredential, setUserCredential] = useState(null);
  const [summaryErrors, setSummaryErrors] = useState(null);
  const [projectId, setprojectId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [cards, setCards] = useState([]);
  const [timeLine, setTimeline] = useState(false);
  const [resource, setResource] = useState(null);
  const [campaignId, setCampaignId] = useState(null);
  const isPreview = searchParams.get("preview");
  const parentId = searchParams.get("parentId");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const handleRedirect = (step, activeCycle) => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    urlParams.set("key", step);
    urlParams.set("preview", false);
    if (activeCycle) {
      urlParams.set("activeCycle", activeCycle);
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.push(newUrl);
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
        quantity: variant.quantity || 1,
        value: variant.productVariantId,
        name: variant.name,
      }));
    };
  
    const parseConditionAndCreateRules = (condition, ruleKey, products) => {
      // const conditionParts = condition.split("and").map((part) => part.trim());
      // let attributes = [];
      let attributes = [];
  
      if (isPreview) {
        // Handle preview condition `3<=ageandage<11` or `3 <= Age < 11` in "IN_BETWEEN" style
        const inBetweenMatch = condition.match(/(\d+)(<=|<|>=|>)(\w+)and(\w+)(<=|<|>=|>)(\d+)/);
        if (inBetweenMatch) {
          const toValue = inBetweenMatch[1].trim();
          const fromValue = inBetweenMatch[6].trim();
          const attributeCode = inBetweenMatch[3].trim();
    
          attributes.push({
            key: attributes.length + 1,
            operator: { code: "IN_BETWEEN" },
            attribute: { code: attributeCode },
            fromValue,
            toValue,
          });
        } else {
          // Handle regular conditions in preview mode
          const conditionParts = condition.split("and").map((part) => part.trim());
          conditionParts.forEach((part) => {
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
          });
        }
      }  else {
        const conditionParts = condition.split("and").map((part) => part.trim());
      conditionParts.forEach((part) => {
        const parts = part.split(" ").filter(Boolean);
    
        // Handle "IN_BETWEEN" operator
        if (parts.length === 5 && (parts[1] === "<=" || parts[1] === "<") && (parts[3] === "<" || parts[3] === "<=")) {
          const toValue = parts[0];
          const fromValue = parts[4];
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
    }
      return [{
        ruleKey: ruleKey + 1,
        delivery: {},
        products,
        attributes,
      }];
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

  useEffect(() => {
    const fetchData = async () => {
      let temp = await fetchcd(tenantId, projectId);
      if (temp) {
        await new Promise((resolve) => {
          setStartDate(temp?.startDate);
          setEndDate(temp?.endDate);
          setCycles(temp?.additionalDetails?.projectType?.cycles);
          resolve();
        });
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);


  const { isLoading, data, error, refetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
    },
    config: {
      select: (data) => {
        const resourceIdArr = [];
        data?.[0]?.resources?.map((i) => {
          if (i?.createResourceId && i?.type === "user") {
            resourceIdArr.push(i?.createResourceId);
          }
        });
        setStartDate(data?.[0]?.startDate);
        setEndDate(data?.[0]?.endDate);
        let processid;
        setprojectId(data?.[0]?.projectId);
        setCards(data?.cards);

        const target = data?.[0]?.deliveryRules;
        const boundaryData = boundaryDataGrp(data?.[0]?.boundaries);
        const cycleData = reverseDeliveryRemap(target, t);
        const hierarchyType = data?.[0]?.hierarchyType;
        return {
          cards: [
            {
              navigationKey: "card1",
              sections: [
                {
                  type: "DATA",
                  cardHeader: { value: t("CAMPAIGN_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  // cardSecondaryAction: isPreview === "true" && (
                  //   <Button
                  //     className={"campaign-type-alert-button"}
                  //     type={"button"}
                  //     size={"large"}
                  //     variation={"primary"}
                  //     label={t("ES_CAMPAIGN_DOWNLOAD_USER_DETAILS")}
                  //     onClick={() => {
                  //       setTimeline(true);
                  //       setResource(resourceIdArr);
                  //       setCampaignId(data?.[0]?.id);

                  //     }}
                  //   />
                  // ),
                  cardSecondaryAction: isPreview === "true" ? (
                    <Button
                      className={"campaign-type-alert-button"}
                      type={"button"}
                      size={"large"}
                      variation={"primary"}
                      label={t("ES_CAMPAIGN_DOWNLOAD_USER_DETAILS")}
                      onClick={() => {
                        setTimeline(true);
                        setResource(resourceIdArr);
                        setCampaignId(data?.[0]?.id);
                      }}
                    />
                  ) : (
                    <div
                      className="campaign-preview-edit-container"
                      onClick={() => handleRedirect(4)}
                    >
                      <span>{t("CAMPAIGN_EDIT")}</span>
                      <EditIcon />
                    </div>
                  ),
                  values: [
                    {
                      key: "CAMPAIGN_TYPE",
                      value: data?.[0]?.projectType ? t(`CAMPAIGN_PROJECT_${data?.[0]?.projectType?.toUpperCase()}`) : t("CAMPAIGN_SUMMARY_NA"),
                    },
                    {
                      key: "CAMPAIGN_NAME",
                      value: data?.[0]?.campaignName || t("CAMPAIGN_SUMMARY_NA"),
                    },
                    {
                      key: "CAMPAIGN_START_DATE",
                      // value: Digit.Utils.date.convertEpochToDate(data?.[0]?.startDate) || t("CAMPAIGN_SUMMARY_NA"),
                      value: Digit.Utils.date.convertEpochToDate(startDate) || t("CAMPAIGN_SUMMARY_NA"),
                    },
                    {
                      key: "CAMPAIGN_END_DATE",
                      // value: Digit.Utils.date.convertEpochToDate(data?.[0]?.endDate) || t("CAMPAIGN_SUMMARY_NA"),
                      value: Digit.Utils.date.convertEpochToDate(endDate) || t("CAMPAIGN_SUMMARY_NA"),
                    },
                  ],
                },
              ],
            },
            ...(boundaryData || []).map((item, index) => {
              return {
                navigationKey: "card2",
                name: `HIERARCHY_${index + 1}`,
                sections: [
                  {
                    name: `HIERARCHY_${index + 1}`,
                    type: "COMPONENT",

                    cardHeader: { value: `${t((hierarchyType + "_" + item?.type).toUpperCase())}`, inlineStyles: { color: "#0B4B66" } },

                    // cardHeader: { value: t("item?.boundaries?.type") },
                    component: "BoundaryDetailsSummary",
                    cardSecondaryAction: noAction !== "false" && (
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(5)}>
                        <span>{t(`CAMPAIGN_EDIT`)}</span>
                        <EditIcon />
                      </div>
                    ),
                    props: {
                      boundaries: item,
                      hierarchyType: hierarchyType,
                    },
                  },
                ],
              };
            }),
            {
              navigationKey: "card3",
              sections: [
                {
                  type: "DATA",
                  cardHeader: { value: t("CAMPAIGN_DELIVERY_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  cardSecondaryAction: noAction !== "false" && (
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(7)}>
                      <span>{t(`CAMPAIGN_EDIT`)}</span>
                      <EditIcon />
                    </div>
                  ),
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
            ...(cycleData || []).map((item, index) => {
              return {
                name: `CYCLE_${index + 1}`,
                // errorName: "deliveryErrors",
                navigationKey: "card3",
                sections: [
                  {
                    name: `CYCLE_${index + 1}`,
                    type: "COMPONENT",
                    cardHeader: { value: `${t("CYCLE")} ${item?.cycleIndex}`, inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                    cardSecondaryAction: noAction !== "false" && (
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(8)}>
                        <span>{t(`CAMPAIGN_EDIT`)}</span>
                        <EditIcon />
                      </div>
                    ),
                    component: "CycleDataPreview",
                    props: {
                      data: item,
                    },
                  },
                ],
              };
            }),
            {
              navigationKey: "card4",
              sections: [
                {
                  name: "facility",
                  type: "COMPONENT",
                  component: "CampaignDocumentsPreview",
                  props: {
                    documents: data?.[0]?.resources?.filter((i) => i.type === "facility"),
                  },
                  cardHeader: { value: t("FACILITY_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  cardSecondaryAction: noAction !== "false" && (
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(10)}>
                      <span>{t(`CAMPAIGN_EDIT`)}</span>
                      <EditIcon />
                    </div>
                  ),
                },
              ],
            },
            {
              navigationKey: "card4",
              sections: [
                {
                  name: "user",
                  type: "COMPONENT",
                  component: "CampaignDocumentsPreview",
                  props: {
                    documents: data?.[0]?.resources?.filter((i) => i.type === "user"),
                  },
                  cardHeader: { value: t("USER_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  cardSecondaryAction: noAction !== "false" && (
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(11)}>
                      <span>{t(`CAMPAIGN_EDIT`)}</span>
                      <EditIcon />
                    </div>
                  ),
                },
              ],
            },
            {
              navigationKey: "card4",
              sections: [
                {
                  name: "target",
                  type: "COMPONENT",
                  component: "CampaignDocumentsPreview",
                  props: {
                    documents: data?.[0]?.resources?.filter((i) => i?.type === "boundaryWithTarget"),
                  },
                  cardHeader: { value: t("TARGET_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  cardSecondaryAction: noAction !== "false" && (
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(12)}>
                      <span>{t(`CAMPAIGN_EDIT`)}</span>
                      <EditIcon />
                    </div>
                  ),
                },
              ],
            },
            resourceIdArr?.length > 0
              ? {
                  navigationKey: "card4",
                  sections: [
                    {
                      type: "COMPONENT",
                      component: "CampaignResourceDocuments",
                      props: {
                        isUserGenerate: true,
                        // resources: processid,
                        resources: resourceIdArr,
                      },
                      cardHeader: { value: t("USER_GENERATE_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                    },
                  ],
                }
              : {},
          ],
          apiResponse: {},
          additionalDetails: {},
          horizontalNav: {
            showNav: true,
            configNavItems: [
              // ...(isPreview === "true"
              //   ? [
              //       {
              //         name: "card1",
              //         active: true,
              //         code: t("HCM_TIMELINE"),
              //       },
              //     ]
              //   : []),
              {
                name: "card1",
                active: true,
                code: t("HCM_CAMPAIGN_SETUP_DETAILS"),
              },
              {
                name: "card2",
                active: true,
                code: t("HCM_BOUNDARY_DETAILS"),
              },
              {
                name: "card3",
                active: true,
                code: t("HCM_DELIVERY_DETAILS"),
              },
              {
                name: "card4",
                active: true,
                code: t("HCM_DATA_UPLOAD"),
              },
            ],
            activeByDefault: "card1",
          },

          error: data?.[0]?.additionalDetails?.error,
          data: data?.[0],
          status: data?.[0]?.status,
          userGenerationSuccess: resourceIdArr,
        };
      },
      enabled: id ? true : false,
      staleTime: 0,
      cacheTime: 0,
    },
  });

  if (isLoading) {
    return <Loader />;
  }
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

  const downloadUserCred = async () => {
    downloadExcelWithCustomName(userCredential);
  };

  useEffect(() => {
    if (data?.userGenerationSuccess?.length > 0) {
      const fetchUser = async () => {
        const responseTemp = await Digit.CustomService.getResponse({
          url: `/project-factory/v1/data/_search`,
          body: {
            SearchCriteria: {
              tenantId: tenantId,
              id: data?.userGenerationSuccess,
            },
          },
        });

        const response = responseTemp?.ResourceDetails?.map((i) => i?.processedFilestoreId);

        if (response?.[0]) {
          setUserCredential({ fileStoreId: response?.[0], customName: "userCredential" });
        }
      };
      fetchUser();
    }
  }, [data]);

  const updatedObject = { ...data };

  useEffect(() => {
    // Update startDate and endDate in the `data` object
    updatedObject.data.startDate = startDate;
    updatedObject.data.endDate = endDate;
    updatedObject.cards[0].sections[0].values[2].value = Digit.Utils.date.convertEpochToDate(startDate);
    updatedObject.cards[0].sections[0].values[3].value = Digit.Utils.date.convertEpochToDate(endDate);
  }, [startDate, endDate]);

  if (updatedObject?.cards?.[1]?.sections?.[0]?.values?.[0]?.value == t("MR-DN")) {
    updatedObject.cards.forEach((card) => {
      if (card.name && card.name.startsWith("CYCLE_")) {
        const cycleId = card.name.split("_")[1];
        const cycleData = cycles.find((cycle) => cycle.id === cycleId);

        if (cycleData) {
          card.sections.forEach((section) => {
            if (section.props && section.props.data) {
              section.props.data.startDate = new Date(cycleData.startDate).toLocaleDateString("en-GB");
              // section.props.data.startDate = Digit.Utils.date.convertEpochToDate(cycleData.startDate) || t("CAMPAIGN_SUMMARY_NA");
              section.props.data.endDate = new Date(cycleData.endDate).toLocaleDateString("en-GB");
              // section.props.data.startDate = Digit.Utils.date.convertEpochToDate(cycleData.endDate) || t("CAMPAIGN_SUMMARY_NA");
            }
          });
        }
      }
    });
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-1.5rem" }}>
        <Header className="summary-header">{t("ES_TQM_SUMMARY_HEADING")}</Header>
        {timeLine && (
          <PopUp type={"default"} heading={t("ES_CAMPAIGN_TIMELINE")} onOverlayClick={() => setTimeline(false)} onClose={() => setTimeline(false)}>
            <TimelineComponent campaignId={campaignId} resourceId={resource} />
          </PopUp>
        )}
      </div>
      <div className="campaign-summary-container">
        <ViewComposer data={updatedObject} cardErrors={summaryErrors} />
        {showToast && (
          <Toast
            type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : "success"}
            label={t(showToast?.label)}
            onClose={closeToast}
          />
        )}
      </div>
    </>
  );
};

export default CampaignSummary;
