import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, EditIcon, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { Toast , Stepper , TextBlock ,Card  } from "@egovernments/digit-ui-components";

import { downloadExcelWithCustomName } from "../utils";



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

const BoundarySummary = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const noAction = searchParams.get("action");
  const [showToast, setShowToast] = useState(null);
  const isPreview = searchParams.get("preview");
  const [currentStep, setCurrentStep] = useState(2);
  const currentKey = searchParams.get("key");
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

  const { isLoading, data, error, refetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
    },
    config: {
      select: (data) => {
        const boundaryData = boundaryDataGrp(data?.[0]?.boundaries);
        return {
          cards: [
            ...boundaryData?.map((item, index) => {
              return {
                name: `HIERARCHY_${index + 1}`,
                sections: [
                  {
                    name: `HIERARCHY_${index + 1}`,
                    type: "COMPONENT",
                    cardHeader: { value: `${t(item?.type)}` , inlineStyles: { color : "#0B4B66" } },
                    // cardHeader: { value: t("item?.boundaries?.type") },
                    component: "BoundaryDetailsSummary",
                    // cardSecondaryAction: noAction !== "false" && (
                    //   <div className="campaign-preview-edit-container" onClick={() => handleRedirect(5)}>
                    //     <span>{t(`CAMPAIGN_EDIT`)}</span>
                    //     <EditIcon />
                    //   </div>
                    // ),
                    props: {
                      boundaries: item,
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
  const downloadUserCred = async () => {
    downloadExcelWithCustomName(userCredential);
  };

  useEffect(() => {
    setKey(currentKey);
    setCurrentStep(currentKey);
  }, [currentKey]);

  const onStepClick = (currentStep) => {
    if (!props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA) return;
    if (currentStep === 0) {
      setKey(5);
    } else setKey(6);
  };


  const updatedObject = { ...data };

  return (
    <>
     <div className="container-full">
        <div className="card-container">
          <Card className="card-header-timeline">
            <TextBlock subHeader={t("HCM_BOUNDARY_DETAILS")} subHeaderClasName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper customSteps={["HCM_BOUNDARY_DETAILS", "HCM_SUMMARY"]} currentStep={2} onStepClick={onStepClick} direction={"vertical"} />
          </Card>
        </div>

        <div className="card-container-delivery">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header className="summary-header">{t("ES_BOUNDARY_SUMMARY_HEADING")}</Header>
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
