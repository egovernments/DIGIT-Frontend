import React, { useMemo } from 'react'
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from 'react-router-dom';
import { Header, InboxSearchComposer, Loader, Button, DownloadImgIcon} from "@egovernments/digit-ui-react-components";
import { CreatePAWMSConfig } from '../../../configs/CreatePAWMSConfig';


const CreatePA = () => {
  const { t } = useTranslation();
  const { state } = useLocation()
  const history = useHistory()
  const stateTenant = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  
  const { isLoading, data:configs } = Digit.Hooks.useCustomMDMS(
      stateTenant,
      Digit.Utils.getConfigModuleName(),
      [
          {
              "name": "CreatePAWMSConfig"
          }
      ],
      {
        select: (data) => {
            const result =  data?.[Digit.Utils.getConfigModuleName()]?.CreatePAWMSConfig[0];
            //local config 
            // const result = CreatePAWMSConfig?.CreatePAWMSConfig?.[0]
            const configs =  Digit.Utils.preProcessMDMSConfigInboxSearch(t, result, "sections.search.uiConfig.fields",{
              updateDependent : [
               {
                 key : "createdFrom",
                 value : [new Date().toISOString().split("T")[0]]
               },
               {
                 key : "createdTo",
                 value : [new Date().toISOString().split("T")[0]]
               }
             ]
           })
           
           if( !Digit.Utils.didEmployeeHasRole(configs?.actionRole)){
            configs.sections.searchResult.uiConfig.showCheckBox =false
            configs.sections.searchResult.uiConfig.showTableInstruction = ""
           }
           return configs
        },
      }
  );
  

  //For local Update data to access searchConfig or searchWMS config
  // const configs = SearchBillWMSConfig?.SearchBillWMSConfig?.[0]

  

  if(isLoading) return <Loader />

  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        <Header className="works-header-search">{t(configs?.label)}</Header>
      </div>
      <div className="inbox-search-wrapper">
          <InboxSearchComposer configs={configs}></InboxSearchComposer>
      </div>
    </React.Fragment>
  )
}

export default CreatePA;