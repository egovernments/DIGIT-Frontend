import React, { useState, useMemo, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./SelectingBoundaryComponent";
import { AlertCard, Stepper, TextBlock, Tag, Card, HeaderComponent, Loader } from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../Module";
import TagComponent from "./TagComponent";

const SelectingBoundariesDuplicate = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const searchParams = new URLSearchParams(location.search);
  const hierarchyType = props?.props?.dataParams?.hierarchyType;
  const campaignNumber = searchParams.get("campaignNumber");
  const draft = searchParams.get("draft");
  const { data: HierarchySchema } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "HierarchySchema",
        filter: `[?(@.type=='${window.Digit.Utils.campaign.getModuleName()}')]`,
      },
    ],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.HierarchySchema` }
  );
  const { data: mailConfig } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "mailConfig" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.mailConfig` }
  );
  const lowestHierarchy = useMemo(() => {
    return HierarchySchema?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.lowestHierarchy;
  }, [HierarchySchema]);
  // const [selectedData, setSelectedData] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData || []);
  // const [boundaryOptions, setBoundaryOptions] = useState(
  //   props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData || {}
  // );
  const [selectedData, setSelectedData] = useState([]);
  const [boundaryOptions, setBoundaryOptions] = useState({});
  const [executionCount, setExecutionCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const campaignName = props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName;
  const [restrictSelection, setRestrictSelection] = useState(null);

  // useEffect(() => {
  //   setKey(currentKey);
  //   setCurrentStep(currentKey);
  // }, [currentKey]);

  const reqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        campaignNumber: campaignNumber,
      },
    },
    config: {
      enabled: !!campaignNumber,
      select: (data) => {
        return data?.CampaignDetails?.[0];
      },
    },
  };

  const { data: campaignData, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // useEffect(() => {
  //   onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions ,  updateBoundary: !restrictSelection});
  // }, [selectedData, boundaryOptions , restrictSelection]);

  useEffect(() => {
    if (selectedData?.length > 0 || Object.keys(boundaryOptions || {}).length) {
      onSelect("boundaryType", {
        selectedData,
        boundaryData: boundaryOptions,
        updateBoundary: !restrictSelection,
      });
    }
  }, [selectedData, boundaryOptions, restrictSelection]);

  // useEffect(() => {
  //   if (executionCount < 5) {
  //     onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions , updateBoundary: !restrictSelection});
  //     setExecutionCount((prevCount) => prevCount + 1);
  //   }
  // });
  useEffect(() => {
    const sessionData = props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType;
    if (sessionData || campaignData?.boundaries) {
      setSelectedData(sessionData?.selectedData || campaignData?.boundaries);
      setBoundaryOptions(sessionData?.boundaryData || {});
    }
    setTimeout(() => setIsLoading(false), 10);
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType, campaignData]);

  // useEffect(() => {
  //   if (
  //     props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.length > 0 ||
  //     props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.length > 0 ||
  //     props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.length > 0
  //   ) {
  //     setRestrictSelection(true);
  //   }
  // }, [props?.props?.sessionData]);
  const handleBoundaryChange = (value) => {
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
    setRestrictSelection(value?.restrictSelection);
  };

  // function updateUrlParams(params) {
  //   const url = new URL(window.location.href);
  //   Object.entries(params).forEach(([key, value]) => {
  //     url.searchParams.set(key, value);
  //   });
  //   window.history.replaceState({}, "", url);
  // }

  // useEffect(() => {
  //   updateUrlParams({ key: key });
  //   window.dispatchEvent(new Event("checking"));
  // }, [key]);

  if (draft && isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  if (draft && isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <>
      <div className="container-full">
        <div className="card-container-delivery">
          <Card>
            <TagComponent campaignName={campaignName} />
            <HeaderComponent className="select-boundary">{t(`CAMPAIGN_SELECT_BOUNDARY`)}</HeaderComponent>
            <p className="dates-description">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
            <Wrapper
              hierarchyType={hierarchyType}
              lowest={lowestHierarchy}
              selectedData={selectedData}
              boundaryOptions={boundaryOptions}
              hierarchyData={props?.props?.hierarchyData}
              isMultiSelect={"true"}
              restrictSelection={restrictSelection}
              onSelect={(value) => {
                handleBoundaryChange(value);
              }}
            ></Wrapper>
          </Card>
          <AlertCard
            populators={{
              name: "infocard",
            }}
            variant="default"
            style={{ margin: "0rem", maxWidth: "100%", marginTop: "1.5rem", marginBottom: "2rem" }}
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
