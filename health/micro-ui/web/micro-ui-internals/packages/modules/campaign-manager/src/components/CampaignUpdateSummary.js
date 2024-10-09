import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, EditIcon, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { InfoBannerIcon, Toast } from "@egovernments/digit-ui-components";
import { DownloadIcon } from "@egovernments/digit-ui-react-components";
import { PRIMARY_COLOR, downloadExcelWithCustomName } from "../utils";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";

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
    type,
    boundaries: groupedData[type], 
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
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const noAction = searchParams.get("action");
  const [showToast, setShowToast] = useState(null);
  const [userCredential, setUserCredential] = useState(null);
  const [deliveryErrors, setDeliveryErrors] = useState(null);
  const [targetErrors, setTargetErrors] = useState(null);
  const [facilityErrors, setFacilityErrors] = useState(null);
  const [userErrors, setUserErrors] = useState(null);
  const [cycleDatesError, setCycleDatesError] = useState(null);
  const [summaryErrors, setSummaryErrors] = useState(null);
  const [projectId, setprojectId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [cards, setCards] = useState([]);
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
        const boundaryData = boundaryDataGrp(data?.[0]?.boundaries);
        return {
          cards: [
            ...boundaryData?.map((item, index) => {
              return {
                navigationKey: "card1",
                name: `HIERARCHY_${index + 1}`,
                sections: [
                  {
                    name: `HIERARCHY_${index + 1}`,
                    type: "COMPONENT",
                    cardHeader: { value: `${t(item?.type)}`, inlineStyles: { color: "#0B4B66" } },
                    // cardHeader: { value: t("item?.boundaries?.type") },
                    component: "BoundaryDetailsSummary",
                    cardSecondaryAction: noAction !== "false" && (
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                        <span>{t(`CAMPAIGN_EDIT`)}</span>
                        <EditIcon />
                      </div>
                    ),
                    props: {
                      boundaries: item,
                    },
                  },
                ],
              };
            }),
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
                  name: "facility",
                  type: "COMPONENT",
                  component: "CampaignDocumentsPreview",
                  props: {
                    documents: data?.[0]?.resources?.filter((i) => i.type === "facility"),
                  },
                  cardHeader: { value: t("FACILITY_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
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
                  name: "user",
                  type: "COMPONENT",
                  component: "CampaignDocumentsPreview",
                  props: {
                    documents: data?.[0]?.resources?.filter((i) => i.type === "user"),
                  },
                  cardHeader: { value: t("USER_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
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


  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header className="summary-header">{t("ES_TQM_SUMMARY_HEADING")}</Header>
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
