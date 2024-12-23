import React, { useState, useMemo, Fragment, useEffect } from "react";
import { CardText,  Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Wrapper } from "./SelectingBoundaryComponent";
import { InfoCard, PopUp, Stepper, TextBlock,Tag , Card} from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../Module";
import TagComponent from "./TagComponent";

const SelectingBoundariesDuplicate = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const searchParams = new URLSearchParams(location.search);
  const hierarchyType = props?.props?.dataParams?.hierarchyType;
  const { data: HierarchySchema } = Digit.Hooks.useCustomMDMS(tenantId, CONSOLE_MDMS_MODULENAME, [{ 
    name: "HierarchySchema",
    "filter": `[?(@.type=='${window.Digit.Utils.campaign.getModuleName()}')]`
   }],{select:(MdmsRes)=>MdmsRes},{ schemaCode: `${CONSOLE_MDMS_MODULENAME}.HierarchySchema` });
  const { data: mailConfig } = Digit.Hooks.useCustomMDMS(tenantId, CONSOLE_MDMS_MODULENAME, [{ name: "mailConfig" }],{select:(MdmsRes)=>MdmsRes},{ schemaCode: `${CONSOLE_MDMS_MODULENAME}.mailConfig` });
  const lowestHierarchy = useMemo(() => {
    return HierarchySchema?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.lowestHierarchy;
  }, [HierarchySchema]);
  const [selectedData, setSelectedData] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData || []);
  const [boundaryOptions, setBoundaryOptions] = useState(
    props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData || {}
  );
  const [executionCount, setExecutionCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(2);
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const campaignName = props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName;
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
    onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions ,  updateBoundary: !restrictSelection});
  }, [selectedData, boundaryOptions , restrictSelection]);

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
      onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions , updateBoundary: !restrictSelection});
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });


  useEffect(() => {
      if (
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.length > 0 ||
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.length > 0 ||
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.length > 0
      ) {
        setRestrictSelection(true);
      }
  }, [props?.props?.sessionData]);

  const handleBoundaryChange = (value) => {
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
    setRestrictSelection(value?.restrictSelection);
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
            <TextBlock subHeader={t("HCM_BOUNDARY_DETAILS")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper customSteps={["HCM_BOUNDARY_DETAILS_VERTICAL", "HCM_SUMMARY"]} currentStep={1} onStepClick={onStepClick} direction={"vertical"} />
          </Card>
        </div>

        <div className="card-container-delivery">
        <TagComponent campaignName={campaignName} /> 
          <Card>
            <Header>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</Header>
            <p className="description-type">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
            <Wrapper
              hierarchyType={hierarchyType}
              lowest={lowestHierarchy}
              selectedData={selectedData}
              boundaryOptions={boundaryOptions}
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
            style={{ margin: "0rem", maxWidth: "100%" , marginTop: "1.5rem" , marginBottom: "2rem"}}
            additionalElements={[
              <span style={{ color: "#505A5F" }}>
                {t("HCM_BOUNDARY_INFO")}
                &nbsp;
                <a href={`mailto:${mailConfig?.[CONSOLE_MDMS_MODULENAME]?.mailConfig?.[0]?.mailId}`} style={{ color: "black" }}>
                  {mailConfig?.[CONSOLE_MDMS_MODULENAME]?.mailConfig?.[0]?.mailId}
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
