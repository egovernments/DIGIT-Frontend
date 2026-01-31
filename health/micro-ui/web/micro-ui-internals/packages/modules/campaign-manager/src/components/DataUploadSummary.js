import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {  EditIcon, LoaderWithGap, ViewComposer } from "@egovernments/digit-ui-react-components";
import { Toast, Stepper, TextBlock, Card , Loader , HeaderComponent} from "@egovernments/digit-ui-components";
import {  downloadExcelWithCustomName } from "../utils";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
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
  const id = searchParams.get("id") || props?.props?.campaignData?.id;
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
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [currentStep, setCurrentStep] = useState(1);
  const baseKey = 9;
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

  const campaignName = props?.props?.campaignData?.campaignName;

  useEffect(() => {
    setKey(currentKey);
    setCurrentStep(currentKey - baseKey + 1);
  }, [currentKey]);

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

  const { isLoading, data, error, refetch, isFetching } = Digit.Hooks.campaign.useSearchCampaign({
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
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
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
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(3)}>
                      <span>{t(`CAMPAIGN_EDIT`)}</span>
                      <EditIcon />
                    </div>
                  ),
                },
              ],
            },
            {
              name: "target",
              errorName: "target",
              sections: [
                {
                  name: "target",
                  type: "COMPONENT",
                  component: "CampaignDocumentsPreview",
                  props: {
                    documents: data?.[0]?.resources?.filter((i) => i?.type === "boundary"),
                  },
                  cardHeader: { value: t("TARGET_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  cardSecondaryAction: noAction !== "false" && (
                    <div className="campaign-preview-edit-container" onClick={() => handleRedirect(5)}>
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

  const onStepClick = (currentStep) => {
    setCurrentStep(currentStep + 1);
    if (currentStep === 0) {
      setKey(10);
    } else if (currentStep === 1) {
      setKey(11);
    } else if (currentStep === 3) {
      setKey(12);
    } else setKey(13);
  };
  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"}/>;
  }

  return (
    <>
      {(isLoading || (!data && !error) || isFetching) && <Loader page={true} variant={"PageLoader"} loaderText={t("DATA_SYNC_WITH_SERVER")}/>}
      <div className="container-full">
        {/* <div className="card-container">
          <Card className="card-header-timeline">
            <TextBlock subHeader={t("HCM_UPLOAD_DATA")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper
              customSteps={["HCM_UPLOAD_FACILITY", "HCM_UPLOAD_USER", "HCM_UPLOAD_TARGET", "HCM_SUMMARY"]}
              currentStep={currentStep}
              onStepClick={onStepClick}
              direction={"vertical"}
            />
          </Card>
        </div> */}

        <div className="card-container-delivery">
        <TagComponent campaignName={campaignName} />  
          <div style={{ display: "flex", justifyContent: "space-between" , marginTop:"1.5rem" }}>
            <HeaderComponent className="summary-header">{t("HCM_DATA_UPLOAD_SUMMARY")}</HeaderComponent>
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
        </div>
      </div>
    </>
  );
};

export default DataUploadSummary;
