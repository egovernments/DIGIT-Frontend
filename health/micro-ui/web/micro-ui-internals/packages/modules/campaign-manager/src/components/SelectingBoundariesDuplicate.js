import React, { useState, useMemo, Fragment, useEffect } from "react";
import { CardText, Card, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Wrapper } from "./SelectingBoundaryComponent";
import { InfoCard, PopUp, Stepper, TextBlock } from "@egovernments/digit-ui-components";

const SelectingBoundariesDuplicate = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const searchParams = new URLSearchParams(location.search);
  const hierarchyType = props?.props?.dataParams?.hierarchyType;
  const { data: hierarchyConfig } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }]);
  const { data: mailConfig } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "mailConfig" }]);
  const lowestHierarchy = useMemo(() => {
    return hierarchyConfig?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.find((item) => item.isActive)?.lowestHierarchy;
  }, [hierarchyConfig]);
  const [selectedData, setSelectedData] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData || []);
  const [boundaryOptions, setBoundaryOptions] = useState(
    props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData || {}
  );
  const [executionCount, setExecutionCount] = useState(0);
  const [showPopUp, setShowPopUp] = useState(null);
  const [updateBoundary, setUpdateBoundary] = useState(true);
  const [currentStep, setCurrentStep] = useState(2);
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const [updatedSelected, setUpdatedSelected] = useState(null);
  const [restrictSelection, setRestrictSelection] = useState(null);

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

  useEffect(() => {
    onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions , updateBoundary: updateBoundary});
  }, [selectedData, boundaryOptions]);

  useEffect(() => {
    setSelectedData(
      props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData
        ? props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData
        : []
    );
    setBoundaryOptions(
      props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData
        ? props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData
        : {}
    );
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions , updateBoundary: updateBoundary});
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  const checkDataPresent = ({ action }) => {
    if (action === false) {
      setShowPopUp(false);
      setUpdateBoundary(true);
      setRestrictSelection(false);
      return;
    }
    if (action === true) {
      setShowPopUp(false);
      setUpdateBoundary(false);
      return;
    }
  };


  useEffect(() => {
      if (
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.length > 0 ||
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.length > 0 ||
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.length > 0
      ) {
        setRestrictSelection(true);
      }
  }, [props?.props?.sessionData, updateBoundary]);

  const handleBoundaryChange = (value) => {
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
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

  return (
    <>
      <div className="container-full">
        <div className="card-container">
          <Card className="card-header-timeline">
            <TextBlock subHeader={t("HCM_BOUNDARY_DETAILS")} subHeaderClasName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper customSteps={["HCM_BOUNDARY_DETAILS", "HCM_SUMMARY"]} currentStep={1} onStepClick={onStepClick} direction={"vertical"} />
          </Card>
        </div>

        <div className="card-container-delivery">
          <Card>
            <Header>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</Header>
            <p className="description-type">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
            <Wrapper
              hierarchyType={hierarchyType}
              lowest={lowestHierarchy}
              selectedData={selectedData}
              boundaryOptions={boundaryOptions}
              updateBoundary={updateBoundary}
              hierarchyData={props?.props?.hierarchyData}
              isMultiSelect={"true"}
              restrictSelection = {restrictSelection}
              onSelect={(value) => {
                handleBoundaryChange(value);
              }}
            ></Wrapper>
          </Card>
          <InfoCard
            populators={{
              name: "infocard",
            }}
            variant="default"
            style={{ margin: "0rem", maxWidth: "100%" }}
            additionalElements={[
              <span style={{ color: "#505A5F" }}>
                {t("HCM_BOUNDARY_INFO ")}
                <a href={`mailto:${mailConfig?.["HCM-ADMIN-CONSOLE"]?.mailConfig?.[0]?.mailId}`} style={{ color: "black" }}>
                  {mailConfig?.["HCM-ADMIN-CONSOLE"]?.mailConfig?.[0]?.mailId}
                </a>
              </span>,
            ]}
            label={"Info"}
          />
        </div>
      </div>
    </>
  );
};

export default SelectingBoundariesDuplicate;
