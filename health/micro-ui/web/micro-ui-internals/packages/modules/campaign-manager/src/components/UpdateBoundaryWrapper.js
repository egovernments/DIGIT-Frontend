import React, { useState, useMemo, useRef, useEffect } from "react";
import { UploadIcon, FileIcon, DeleteIconv2, Toast, Card, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation , useHistory } from "react-router-dom";
import { Wrapper } from "./SelectingBoundaryComponent";
import { Loader } from "@egovernments/digit-ui-components";

const UpdateBoundaryWrapper = ({ ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  // const hierarchyType = props?.props?.hierarchyType;
  const { data: hierarchyConfig } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }]);
  const lowestHierarchy = useMemo(() => {
    return hierarchyConfig?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.find((item) => item.isActive)?.lowestHierarchy;
  }, [hierarchyConfig]);
  const [boundaryOptions, setBoundaryOptions] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [hierarchyType , SetHierarchyType] = useState(props?.props?.hierarchyType);

  console.log("props" , props);

  const reqCriteriaCampaign = {
    url: `/project-factory/v1/project-type/search`,
    body: {
        CampaignDetails: {
        tenantId: tenantId,
        ids: [id],
      },
    },
  };

  const { data: CampaignData } = Digit.Hooks.useCustomAPIHook(reqCriteriaCampaign);

  console.log("CampaignData" , CampaignData?.CampaignDetails?.[0]?.hierarchyType );

  const hierarchyData = Digit.Hooks.campaign.useBoundaryRelationshipSearch({BOUNDARY_HIERARCHY_TYPE: hierarchyType,tenantId});

  console.log("CampaignDataaaaaaaaaaaa333333333" , CampaignData , hierarchyData);

  const handleBoundaryChange =(value) =>{
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
  }

  useEffect (() => {
    setSelectedData(CampaignData?.CampaignDetails?.[0]?.boundaries);
    SetHierarchyType(CampaignData?.CampaignDetails?.[0]?.hierarchyType);
  },[CampaignData])

  return (
    <React.Fragment>
      <Header>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</Header>
      <p className="description-type">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
      <Wrapper 
      hierarchyType={hierarchyType} 
      lowest={lowestHierarchy} 
      isMultiSelect ={"true"}
      frozenData = { CampaignData?.CampaignDetails?.[0]?.boundaries} 
      frozenType = {"filter"}
      hierarchyData = { hierarchyData}
      onSelect={(value) => {
        handleBoundaryChange(value);
      }}
      boundaryOptions={boundaryOptions}
      selectedData={selectedData}
      ></Wrapper>
    </React.Fragment>
  );
};

export default UpdateBoundaryWrapper;
