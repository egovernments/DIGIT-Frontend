import React, { useEffect, useState,Fragment } from "react";
import { useTranslation } from "react-i18next";
import {LoaderWithGap, ViewComposer } from "@egovernments/digit-ui-react-components";
import { Toast, Stepper, TextBlock, Card , Loader ,HeaderComponent } from "@egovernments/digit-ui-components";
import TagComponent from "./TagComponent";


function boundaryDataGrp(boundaryData) {
  // Create an empty object to hold grouped data by type
  const groupedData = {};

  // Iterate through each boundary item in the data
  boundaryData?.forEach((item) => {
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

const BoundarySummary = (props) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [showToast, setShowToast] = useState(null);
  const currentKey = searchParams.get("key");
  const campaignName = window.Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_NAME?.campaignName || t("NA");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });


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

  const { isLoading, data, error, refetch,isFetching } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
    },
    config: {
      select: (data) => {
        const boundaryData = boundaryDataGrp(data?.[0]?.boundaries);
        const hierarchyType= data?.[0]?.hierarchyType;
        return {
          cards: [
            ...boundaryData?.map((item, index) => {
              return {
                name: `HIERARCHY_${index + 1}`,
                sections: [
                  {
                    name: `HIERARCHY_${index + 1}`,
                    type: "COMPONENT",
                    cardHeader: { value: `${t(( hierarchyType + "_" + item?.type).toUpperCase())}` , inlineStyles: { color : "#0B4B66" } },
                    // cardHeader: { value: t("item?.boundaries?.type") },
                    component: "BoundaryDetailsSummary",
                    props: {
                      boundaries: item,
                      hierarchyType: hierarchyType
                    },
                  },
                ],
              };
            }),
          ],
          apiResponse: {},
          additionalDetails: {},

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
    setKey(currentKey);
  }, [currentKey]);

  const onStepClick = (currentStep) => {
    if (!props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA) return;
    if (currentStep === 0) {
      setKey(5);
    } else setKey(6);
  };


  const updatedObject = { ...data };

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"}/>;
  }

  return (
    <>
    {(isLoading || (!data && !error) || isFetching) && <Loader page={true} variant={"PageLoader"} loaderText={t("DATA_SYNC_WITH_SERVER")}/>}
     <div className="container-full"> 

        <div className="card-container-delivery">
        <TagComponent campaignName={campaignName} />
      <div style={{ display: "flex", justifyContent: "space-between" , marginTop: "1.5rem" }}>
        <HeaderComponent className="summary-header">{t("ES_BOUNDARY_SUMMARY_HEADING")}</HeaderComponent>
      </div>
      <div className="campaign-summary-container">
        <ViewComposer data={updatedObject} />
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

export default BoundarySummary;
