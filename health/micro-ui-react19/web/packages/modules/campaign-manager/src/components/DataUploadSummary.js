import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { EditIcon, LoaderWithGap, ViewComposer } from "@egovernments/digit-ui-react-components";
import { Toast, Stepper, TextBlock, Card, Loader, HeaderComponent } from "@egovernments/digit-ui-components";
import { downloadExcelWithCustomName } from "../utils";
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
  const navigate = useNavigate();
  const location = useLocation();
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

  // normalize key to number
  const currentKey = Number(searchParams.get("key"));

  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [currentStep, setCurrentStep] = useState(1);
  const baseKey = 9;

  // Determine which config flow we're in based on URL path
  // uploadConfig (NewUploadScreen): /upload-screen - keys 1, 2, 3
  // CampaignConfig (SetupCampaign): /setup-campaign - keys 10, 11, 12
  const isUploadScreenFlow = window.location.pathname.includes("upload-screen");
  const facilityKey = isUploadScreenFlow ? 1 : 10;
  const userKey = isUploadScreenFlow ? 2 : 11;
  const targetKey = isUploadScreenFlow ? 3 : 12;

  const handleRedirect = useCallback(
    (step, activeCycle) => {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("key", step);
      urlParams.set("preview", false);
      if (activeCycle) {
        urlParams.set("activeCycle", activeCycle);
      }
      navigate(`${window.location.pathname}?${urlParams.toString()}`);
    },
    [navigate]
  );

  const campaignName = props?.props?.campaignData?.campaignName;

  useEffect(() => {
    if (!Number.isNaN(currentKey)) {
      setKey(currentKey);
      setCurrentStep(currentKey - baseKey + 1);
    }
  }, [currentKey]);

  // Only dispatch "checking" event for SetupCampaign to sync
  // Don't call updateUrlParams here - handleRedirect already navigates
  useEffect(() => {
    // Check if URL key matches state key to avoid unnecessary event dispatch
    const urlKey = Number(new URLSearchParams(window.location.search).get("key"));
    if (urlKey === key) {
      window.dispatchEvent(new Event("checking"));
    }
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
  }, [props?.props?.summaryErrors, handleRedirect]);

  const { isLoading, data, error, refetch, isFetching } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
    },
    config: {
      select: useCallback(
        (data) => {
          const resourceIdArr = [];
          data?.[0]?.resources?.map((i) => {
            if (i?.createResourceId && i?.type === "user") {
              resourceIdArr.push(i?.createResourceId);
            }
          });
          let processid;

          const fetchResources = async () => {
            try {
              let temp = await fetchResourceFile(tenantId, resourceIdArr);
              processid = temp;
            } catch (error) {
              console.error("Error fetching resource file:", error);
            }
          };

          if (resourceIdArr.length > 0) {
            fetchResources();
          }
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
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(facilityKey)}>
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
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(userKey)}>
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
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(targetKey)}>
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
        [tenantId, t, noAction, handleRedirect, facilityKey, userKey, targetKey]
      ),
      enabled: id ? true : false,
      staleTime: 0,
      cacheTime: 0,
    },
  });

  useEffect(() => {
    if (data?.data?.[0]?.projectId) {
      setprojectId(data.data[0].projectId);
    }
  }, [data]);
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

  const onStepClick = useCallback((currentStep) => {
    setCurrentStep(currentStep + 1);
    if (currentStep === 0) {
      setKey(10);
    } else if (currentStep === 1) {
      setKey(11);
    } else if (currentStep === 3) {
      setKey(12);
    } else setKey(13);
  }, []);

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <>
      {(isLoading || (!data && !error) || isFetching) && <Loader page={true} variant={"PageLoader"} loaderText={t("DATA_SYNC_WITH_SERVER")} />}
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
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
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
          <div className="campaign-summary-container data-upload-summary">
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
