import React, { useState, useMemo, useRef, useEffect } from "react";
import { UploadIcon, FileIcon, DeleteIconv2, Toast, Card, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation , useHistory } from "react-router-dom";
import { Wrapper } from "./SelectingBoundaryComponent";

const UpdateBoundaryWrapper = ({ ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const hierarchyType = props?.props?.hierarchyType;
  const { data: hierarchyConfig } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }]);
  const lowestHierarchy = useMemo(() => {
    return hierarchyConfig?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.find((item) => item.isActive)?.lowestHierarchy;
  }, [hierarchyConfig]);

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

  return (
    <React.Fragment>
      <Header>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</Header>
      <p className="description-type">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
      <Wrapper 
      hierarchyType={hierarchyType} 
      lowest={lowestHierarchy} 
      frozenData = { CampaignData?.CampaignDetails?.[0]?.boundaries} 
      frozenType = {"filter"}
      ></Wrapper>
    </React.Fragment>
  );
};

export default UpdateBoundaryWrapper;
