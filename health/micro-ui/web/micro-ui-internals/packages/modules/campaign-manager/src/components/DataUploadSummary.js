import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, EditIcon, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { InfoBannerIcon, Toast } from "@egovernments/digit-ui-components";
import { DownloadIcon } from "@egovernments/digit-ui-react-components";
import { PRIMARY_COLOR, downloadExcelWithCustomName } from "../utils";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";

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

// function loopAndReturn(dataa, t) {
//   let newArray = [];
//   const data = dataa?.map((i) => ({ ...i, operator: i?.operator, attribute: i?.attribute }));

//   data.forEach((item) => {
//     // Check if an object with the same attribute already exists in the newArray
//     const existingIndex = newArray.findIndex((element) => element.attribute === item.attribute);
//     if (existingIndex !== -1) {
//       // If an existing item is found, replace it with the new object
//       const existingItem = newArray[existingIndex];
//       newArray[existingIndex] = {
//         attribute: existingItem.attribute,
//         operator: "IN_BETWEEN",
//         toValue: existingItem.value && item.value ? Math.min(existingItem.value, item.value) : null,
//         fromValue: existingItem.value && item.value ? Math.max(existingItem.value, item.value) : null,
//       };
//     } else if (item?.operator === "EQUAL_TO") {
//       newArray.push({
//         ...item,
//         value: item?.value ? t(item?.value) : null,
//       });
//     } else {
//       newArray.push(item);
//     }
//   });

//   const withKey = newArray.map((i, c) => ({ key: c + 1, ...i }));
//   const format = withKey.map((i) => {
//     if (i.operator === "IN_BETWEEN") {
//       return {
//         ...i,
//         value: `${i?.toValue ? i?.toValue : "N/A"}  to ${i?.fromValue ? i?.fromValue : "N/A"}`,
//       };
//     }
//     return {
//       ...i,
//     };
//   });
//   return format;
// }

// function reverseDeliveryRemap(data, t) {
//   if (!data) return null;
//   const reversedData = [];
//   let currentCycleIndex = null;
//   let currentCycle = null;

//   data.forEach((item, index) => {
//     if (currentCycleIndex !== item.cycleNumber) {
//       currentCycleIndex = item.cycleNumber;
//       currentCycle = {
//         cycleIndex: currentCycleIndex.toString(),
//         startDate: item?.startDate ? Digit.Utils.date.convertEpochToDate(item?.startDate) : null,
//         endDate: item?.endDate ? Digit.Utils.date.convertEpochToDate(item?.endDate) : null,
//         active: index === 0, // Initialize active to false
//         deliveries: [],
//       };
//       reversedData.push(currentCycle);
//     }

//     const deliveryIndex = item.deliveryNumber.toString();

//     let delivery = currentCycle.deliveries.find((delivery) => delivery.deliveryIndex === deliveryIndex);

//     if (!delivery) {
//       delivery = {
//         deliveryIndex: deliveryIndex,
//         active: item.deliveryNumber === 1, // Set active to true only for the first delivery
//         deliveryRules: [],
//       };
//       currentCycle.deliveries.push(delivery);
//     }

//     delivery.deliveryRules.push({
//       ruleKey: item.deliveryRuleNumber,
//       delivery: {},
//       attributes: loopAndReturn(item.conditions, t),
//       products: [...item.products],
//     });
//   });

//   return reversedData;
// }

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
const DataUploadSummary = (props) => {
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
  const [summaryErrors, setSummaryErrors] = useState(null);
  const [projectId, setprojectId] = useState(null);
  const isPreview = searchParams.get("preview");
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

  useEffect(() => {
    if (props?.props?.summaryErrors) {
      if (props?.props?.summaryErrors?.deliveryErrors) {
        const temp = props?.props?.summaryErrors?.deliveryErrors?.map((i) => {
          return {
            ...i,
            onClick: i?.dateError ? () => handleRedirect(5) : () => handleRedirect(6, i?.cycle),
          };
        });
        setSummaryErrors({ ...props?.props?.summaryErrors, deliveryErrors: temp });
      } else {
        setSummaryErrors(props?.props?.summaryErrors);
      }
    }
  }, [props?.props?.summaryErrors]);

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
        let processid;
        setprojectId(data?.[0]?.projectId);

        const ss = async () => {
          let temp = await fetchResourceFile(tenantId, resourceIdArr);
          processid = temp;
          return;
        };
        ss();
        const target = data?.[0]?.deliveryRules;
        return {
          cards: [
            {
                name: "target",
                errorName: "target",
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
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(11)}>
                        <span>{t(`CAMPAIGN_EDIT`)}</span>
                        <EditIcon />
                      </div>
                    ),
                  },
                ],
              },
              {
                name: "facility",
                errorName: "facility",
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
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(9)}>
                        <span>{t(`CAMPAIGN_EDIT`)}</span>
                        <EditIcon />
                      </div>
                    ),
                  },
                ],
              },
              {
                name: "user",
                errorName: "user",
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
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(10)}>
                        <span>{t(`CAMPAIGN_EDIT`)}</span>
                        <EditIcon />
                      </div>
                    ),
                  },
                ],
              },
          ],
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

  const updatedObject = { ...data };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header className="summary-header">{t("HCM_DATA_UPLOAD_SUMMARY")}</Header>
        {/* {userCredential && (
          <Button
            label={t("CAMPAIGN_DOWNLOAD_USER_CRED")}
            variation="secondary"
            icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill={PRIMARY_COLOR} />}
            type="button"
            className="campaign-download-template-btn hover"
            onButtonClick={downloadUserCred}
          />
        )} */}
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

export default DataUploadSummary;
