import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EditIcon, ViewComposer } from "@egovernments/digit-ui-react-components";
import { Toast, Loader, HeaderComponent, Button } from "@egovernments/digit-ui-components";
import { PRIMARY_COLOR, downloadExcelWithCustomName } from "../utils";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import NoResultsFound from "./NoResultsFound";
import TagComponent from "./TagComponent";

// Define the function that groups boundary data based on hierarchy
function boundaryDataGrp(boundaryData, hierarchyDefinition) {
  if (!hierarchyDefinition) return [];

  const groupedData = {};

  // Function to order the boundary types based on parent-child relationship
  function getOrderedBoundaryTypes(hierarchy) {
    const result = [];
    let currentItem = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy.find((item) => item.parentBoundaryType === null);
    while (currentItem) {
      result.push(currentItem.boundaryType);
      currentItem = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy.find((item) => item.parentBoundaryType === currentItem.boundaryType);
    }
    return result;
  }

  // Get the ordered boundary types from hierarchy
  const orderedBoundaryTypes = getOrderedBoundaryTypes(hierarchyDefinition);

  boundaryData.forEach((item) => {
    const { type } = item;
    if (!groupedData[type]) {
      groupedData[type] = [];
    }
    groupedData[type].push(item);
  });
  const result = orderedBoundaryTypes
    .map((type) => ({
      type,
      boundaries: groupedData[type] || [],
    }))
    .filter((entry) => entry.boundaries.length > 0);

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
  };
  try {
    const res = await Digit.CustomService.getResponse(reqCriteriaResource);
    return res?.Project?.[0];
  } catch (e) {
    console.log("error", e);
  }
};
const CampaignUpdateSummary = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const campaignName = searchParams.get("campaignName");
  const noAction = searchParams.get("action");
  const [showToast, setShowToast] = useState(null);
  const [userCredential, setUserCredential] = useState(null);
  const [summaryErrors, setSummaryErrors] = useState(null);
  const [projectId, setprojectId] = useState(null);
  const [cards, setCards] = useState([]);
  const isPreview = searchParams.get("preview");
  const parentId = searchParams.get("parentId");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const params = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
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

  // useEffect(() => {
  //   if (props?.props?.summaryErrors) {
  //     if (props?.props?.summaryErrors?.deliveryErrors) {
  //       const temp = props?.props?.summaryErrors?.deliveryErrors?.map((i) => {
  //         return {
  //           ...i,
  //           onClick: i?.dateError ? () => handleRedirect(5) : () => handleRedirect(6, i?.cycle),
  //         };
  //       });
  //       setSummaryErrors({ ...props?.props?.summaryErrors, deliveryErrors: temp });
  //     } else {
  //       setSummaryErrors(props?.props?.summaryErrors);
  //     }
  //   }
  //   // if (props?.props?.summaryErrors?.deliveryErrors) {
  //   //   const temp = props?.props?.summaryErrors?.deliveryErrors?.map((i) => {
  //   //     return {
  //   //       ...i,
  //   //       onClick: () => handleRedirect(6, i?.cycle),
  //   //     };
  //   //   });
  //   //   setDeliveryErrors(temp);
  //   // }
  //   // if (props?.props?.summaryErrors?.targetErrors) {
  //   //   setTargetErrors(props?.props?.summaryErrors?.targetErrors);
  //   // }
  //   // if (props?.props?.summaryErrors?.facilityErrors) {
  //   //   setFacilityErrors(props?.props?.summaryErrors?.facilityErrors);
  //   // }
  //   // if (props?.props?.summaryErrors?.userErrors) {
  //   //   setUserErrors(props?.props?.summaryErrors?.userErrors);
  //   // }
  // }, [props?.props?.summaryErrors]);

  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `${params?.hierarchyType}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 2,
        offset: 0,
        hierarchyType: params?.hierarchyType,
      },
    },
  };

  const { data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  function getOrderedBoundaryTypes(hierarchy) {
    const result = [];
    let currentItem = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.find((item) => item.parentBoundaryType === null);
    while (currentItem) {
      result.push(currentItem.boundaryType);
      currentItem = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.find((item) => item.parentBoundaryType === currentItem.boundaryType);
    }
    return result;
  }

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
        setprojectId(data?.[0]?.projectId);
        setCards(data?.cards);
        let processid;
        const ss = async () => {
          let temp = await fetchResourceFile(tenantId, resourceIdArr);
          processid = temp;
          return;
        };
        ss();
        const target = data?.[0]?.deliveryRules;
        const boundaryData = boundaryDataGrp(data?.[0]?.boundaries, hierarchyDefinition);
        const hierarchyType = data?.[0]?.hierarchyType;

        return {
          cards: [
            ...(boundaryData.length > 0
              ? boundaryData.map((item, index) => ({
                  navigationKey: "card1",
                  name: `HIERARCHY_${index + 1}`,
                  sections: [
                    {
                      name: `HIERARCHY_${index + 1}`,
                      type: "COMPONENT",
                      cardHeader: {
                        value: hierarchyType ? `${t((hierarchyType + "_" + item?.type).toUpperCase())}` : t("To Be Updated"),
                        inlineStyles: { color: "#0B4B66" },
                      },
                      component: "BoundaryDetailsSummary",
                      cardSecondaryAction: noAction !== "false" && (
                        <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
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
                }))
              : [
                  {
                    navigationKey: "card1",
                    name: "HIERARCHY_1",
                    sections: [
                      {
                        name: "NoResults",
                        type: "COMPONENT",
                        component: "NoResultsFound",
                        props: {
                          text: Digit.Utils.locale.getTransformedLocale(`NO_RESULTS`),
                        },
                      },
                    ],
                  },
                ]),
            {
              navigationKey: "card2",
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
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(2)}>
                      <span>{t(`CAMPAIGN_EDIT`)}</span>
                      <EditIcon />
                    </div>
                  ),
                },
              ],
            },
            {
              navigationKey: "card2",
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
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(3)}>
                      <span>{t(`CAMPAIGN_EDIT`)}</span>
                      <EditIcon />
                    </div>
                  ),
                },
              ],
            },
            {
              navigationKey: "card2",
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
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(4)}>
                      <span>{t(`CAMPAIGN_EDIT`)}</span>
                      <EditIcon />
                    </div>
                  ),
                },
              ],
            },
            resourceIdArr?.length > 0
              ? {
                  navigationKey: "card2",
                  sections: [
                    {
                      type: "COMPONENT",
                      component: "CampaignResourceDocuments",
                      props: {
                        isUserGenerate: true,
                        resources: processid,
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
              {
                name: "card1",
                active: true,
                code: t("HCM_BOUNDARY_DETAILS"),
              },
              {
                name: "card2",
                active: true,
                code: t("HCM_DATA_UPLOAD"),
              },
            ],
            activeByDefault: "card2",
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
    return <Loader page={true} variant={"PageLoader"} />;
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

  return (
    <>
      <TagComponent campaignName={campaignName} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-1.5rem", marginTop: "1.5rem" }}>
        <HeaderComponent className="summary-header">{t("ES_TQM_SUMMARY_HEADING")}</HeaderComponent>
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

export default CampaignUpdateSummary;
