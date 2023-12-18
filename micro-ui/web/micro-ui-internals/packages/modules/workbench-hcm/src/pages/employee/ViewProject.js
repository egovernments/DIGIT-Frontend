import React, { useEffect , useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { Header, Card, Loader , ViewComposer} from "@egovernments/digit-ui-react-components";

import { data } from "../../configs/ViewProjectConfig"

const ViewProject = () => {
    const { t } = useTranslation();
    const location = useLocation();
    
    const { tenantId, projectNumber , projectId} = Digit.Hooks.useQueryParams();

    const requestCriteria = {
      url: "/project/v1/_search",
      changeQueryName:projectId||projectNumber,
      params : {
        tenantId,
        offset:0,
        limit:100,
        includeAncestors:true
      },
      body:{
      Projects:[
        {
          tenantId,
          ...(projectId ? { id: projectId } : { projectNumber })
        }
      ],
      "apiOperation": "SEARCH"
    }
    };

    //fetching the project data
    const {data: project} = Digit.Hooks.useCustomAPIHook(requestCriteria);

    // Render the data once it's available
    let config = null;


    config = data(project);
    return (
       <React.Fragment>
      <Header className="works-header-view">{t("WORKBENCH_PROJECT")}</Header>
     <ViewComposer data={config} isLoading={false}/>
    </React.Fragment>
    
      );
  };
  export default ViewProject;