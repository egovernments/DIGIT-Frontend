import { Card, Stepper, TextBlock } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import UploadData from "./UploadData";
import { useTranslation } from "react-i18next";
import UploadDataMappingWrapper from "./UploadDataMappingWrapper";
import NewUploadData from "./CreateCampaignComponents/NewUploadData";

function DataUploadWrapper({ formData, props, onSelect }) {
  const { t } = useTranslation();
  const { parentId, key: currentKey, ...queryParams } = Digit.Hooks.useQueryParams();
  const categories = [
    "HCM_UPLOAD_FACILITY",
    // "HCM_UPLOAD_FACILITY_MAPPING",
    "HCM_UPLOAD_USER",
    // "HCM_UPLOAD_USER_MAPPING",
    "HCM_UPLOAD_TARGET",
    "HCM_SUMMARY",
  ];
  const mappingCategories = ["HCM_UPLOAD_FACILITY_MAPPING", "HCM_UPLOAD_USER_MAPPING"];
  const [currentStep, setCurrentStep] = useState(1);
  const currentCategories = categories?.[parseInt(currentKey) - 1];
  const [key, setKey] = useState(() => {
    return currentKey ? parseInt(currentKey) : 1;
  });
  const baseKey = 10;
  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }

  useEffect(() => {
    setKey(currentKey);
    setCurrentStep(currentKey - baseKey + 1);
  }, [currentKey]);

  useEffect(() => {
    updateUrlParams({ key: key });
    window.dispatchEvent(new Event("checking"));
  }, [key]);

  const onStepClick = (currentStep) => {
    setCurrentStep(currentStep + 1);
    if (currentStep === 0) {
      setKey(10);
    } else if (currentStep === 1) {
      setKey(11);
    } else if (currentStep === 3) {
      setKey(13);
    } else if (currentStep === 4) {
      setKey(14);
    } else setKey(12);
  };

  return (
    <>
      <div className="container-full">
        {/* {!parentId && (
          <div className="card-container">
            <Card className="card-header-timeline">
              <TextBlock subHeader={t("HCM_UPLOAD_DATA")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
            </Card>
            <Card className="stepper-card">
              <Stepper customSteps={categories} currentStep={currentStep} onStepClick={() => {}} direction={"vertical"} />
            </Card>
          </div>
        )} */}
        {mappingCategories?.includes(currentCategories) && !parentId ? (
          <UploadDataMappingWrapper currentCategories={currentCategories} formData={formData} props={props} onSelect={onSelect} />
        ) : (
          // <UploadData formData={formData} props={props} onSelect={onSelect} />
          <NewUploadData formData={formData} props={props} onSelect={onSelect} />
        )}
      </div>
    </>
  );
}

export default DataUploadWrapper;
