import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, ViewComposer,  } from "@egovernments/digit-ui-react-components";
import { data } from "../../configs/ViewCampaignConfig";

import getProjectServiceUrl from "../../utils/getProjectServiceUrl";
import { Toast } from "@egovernments/digit-ui-components";
const projectUrl = getProjectServiceUrl();

const ViewCampaign = () => {
  const { t } = useTranslation();
  
  const [showToast, setShowToast] = useState(false);
  

  const { tenantId, projectNumber, projectId } = Digit.Hooks.useQueryParams();


  const requestCriteria = {
    url: `${projectUrl}/v1/_search`,
    changeQueryName: projectId || projectNumber,
    params: {
      tenantId,
      offset: 0,
      limit: 100,
      // includeAncestors: true,
    },
    body: {
      Projects: [
        {
          tenantId,
          ...(projectId ? { id: projectId } : { projectNumber }),
        },
      ],
      apiOperation: "SEARCH",
    },
    config: {
      enabled: projectId || projectNumber ? true : false,
    },
  };



  //fetching the project data
  const { data: project, refetch } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  // Render the data once it's available
  let config = null;



  config = data(project);


  


  return (
    <React.Fragment>
      <Header className="works-header-view">{t("WORKBENCH_PROJECT")}</Header>
      <ViewComposer data={config} isLoading={false} /> 
                    {showToast && <Toast label={showToast.label} type={showToast?.isError?"error":"info"}  onClose={() => setShowToast(null)}></Toast>}
    </React.Fragment>
  );
};
export default ViewCampaign;
