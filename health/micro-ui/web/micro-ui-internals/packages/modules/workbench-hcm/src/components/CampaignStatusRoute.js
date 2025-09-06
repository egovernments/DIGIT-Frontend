import React from "react";
import { Route } from "react-router-dom";
import CampaignStatus from "../pages/employee/CampaignStatus";

// Example route configuration for integrating into main routing
// This can be added to the main app routing configuration

const CampaignStatusRoute = ({ path, url }) => {
  return (
    <Route 
      path={`${path}/campaign-status`} 
      component={CampaignStatus}
    />
  );
};

export default CampaignStatusRoute;

// Example usage in main app routing:
// <Route path="/employee/hcm-workbench/campaign-status" component={CampaignStatus} />

// URL format: 
// /employee/hcm-workbench/campaign-status?tenantId=od&campaignNumber=CMP-2025-09-06-000069