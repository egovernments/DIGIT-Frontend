import React, { useState, useMemo, useRef, useEffect, Fragment } from "react";
import { Card, HeaderComponent, AlertCard } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Wrapper } from "./SelectingBoundaryComponent";
import { CONSOLE_MDMS_MODULENAME } from "../Module";
import TagComponent from "./TagComponent";

const UpdateBoundaryWrapper = ({ onSelect, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const searchParams = new URLSearchParams(location.search);
  const parentId = searchParams.get("parentId");
  const id = searchParams.get("id");
  const isDraft = searchParams.get("draft");
  // const hierarchyType = props?.props?.hierarchyType;
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
  const [selectedData, setSelectedData] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData || []);
  const [boundaryOptions, setBoundaryOptions] = useState(
    props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData || {}
  );
  const campaignName = searchParams.get("campaignName");
  const [hierarchyType, SetHierarchyType] = useState(props?.props?.hierarchyType);
  const lowestHierarchy = useMemo(() => {
    return HierarchySchema?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.find((item) => item.hierarchy === hierarchyType)?.lowestHierarchy;
  }, [HierarchySchema, hierarchyType]);

  const reqCriteriaCampaign = {
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        ids: [parentId],
      },
    },
  };

  const { data: CampaignData } = Digit.Hooks.useCustomAPIHook(reqCriteriaCampaign);

  useEffect(() => {
    if (!id || isDraft) {
      setSelectedData(CampaignData?.CampaignDetails?.[0]?.boundaries);
      const rootOptions = {};
      CampaignData?.CampaignDetails?.[0]?.boundaries.forEach((item) => {
        if (item.isRoot) {
          if (!rootOptions[item.type]) {
            rootOptions[item.type] = {};
          }
          rootOptions[item.type][item.code] = null;
        }
      });

      setBoundaryOptions(rootOptions);
    }
    SetHierarchyType(CampaignData?.CampaignDetails?.[0]?.hierarchyType);
  }, [CampaignData]);

  useEffect(() => {
    if (props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType) {
      setSelectedData(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData);
      setBoundaryOptions(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData);
    }
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType]);

  const hierarchyData = Digit.Hooks.campaign.useBoundaryRelationshipSearch({ BOUNDARY_HIERARCHY_TYPE: hierarchyType, tenantId });

  const handleBoundaryChange = (value) => {
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
  };

  useEffect(() => {
    onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions });
  }, [selectedData, boundaryOptions]);

  return (
    <>
      <Card>
        <TagComponent campaignName={campaignName} />
        <HeaderComponent className={"update-boundary-header"}>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</HeaderComponent>
        <p className="description-type">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
        {hierarchyData && (
          <Wrapper
            hierarchyType={hierarchyType}
            lowest={lowestHierarchy}
            isMultiSelect={"true"}
            frozenData={CampaignData?.CampaignDetails?.[0]?.boundaries}
            frozenType={"filter"}
            hierarchyData={hierarchyData}
            onSelect={(value) => {
              handleBoundaryChange(value);
            }}
            boundaryOptions={boundaryOptions}
            selectedData={selectedData}
          />
        )}
      </Card>
      <div style={{ marginTop: "1rem" }}>
        <AlertCard
          label="Info"
          text={t("CAMPAIGN_CANNOT_REMOVE_PREVIOUS_BOUNDARIES")}
          variant="default"
          style={{ margin: "0rem", maxWidth: "100%", marginTop: "1.5rem", marginBottom: "2rem" }}
        />
      </div>
    </>
  );
};

export default UpdateBoundaryWrapper;
