import React, { useMemo } from 'react'
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from 'react-router-dom';
import { Header, InboxSearchComposer, Loader, Button, DownloadImgIcon} from "@egovernments/digit-ui-react-components";
import { SearchPaymentInstructionConfig } from '../../../configs/SearchPaymentInstructionConfig';
import { SearchPIConfigNew } from '../../../configs/SearchPaymentInstructionConfigNew';

const SearchPaymentInstruction = () => {
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
              "name": "SearchPaymentInstructionConfig"
          }
      ],
      {
        select: (data) => {
          
            // const result =  data?.[Digit.Utils.getConfigModuleName()]?.SearchPaymentInstructionConfig[0];
            // const result =  SearchPaymentInstructionConfig?.SearchPaymentInstructionConfig[0];
            // const result =  SearchPIConfigNew?.SearchPaymentInstructionConfig[0];
          
            //mdms config
            const result = data?.[Digit.Utils.getConfigModuleName()]?.SearchPaymentInstructionConfig[0]
            
          //for 2nd tab
              let configs =  Digit.Utils.preProcessMDMSConfigInboxSearch(t, result, "sections.search.uiConfig.additionalTabs[0].uiConfig.fields",{
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
           //for 1st tab
              configs =  Digit.Utils.preProcessMDMSConfigInboxSearch(t, configs, "sections.search.uiConfig.fields")
              
           return configs
        },
      }
  );
  

  //For local Update data to access searchConfig or searchWMS config
  // const configs = SearchBillWMSConfig?.SearchBillWMSConfig?.[0]
  // const configs = SearchPIConfigNew?.SearchPaymentInstructionConfig?.[0]

  

  if(isLoading) return <Loader />

  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        <Header className="works-header-search">{t(configs?.label)}</Header>
        {Digit.Utils.didEmployeeHasRole(configs?.actionRole) && (
            <Button
              label={t(configs?.actionLabel)}
              variation="secondary"
              // icon={<DownloadImgIcon style={{height : "20px", width : "20px"}}/>}
              onButtonClick={() => {
                history.push(`/${window?.contextPath}/employee/${configs?.actionLink}`);
              }}
              type="button"
            />
          )}
      </div>
      <div className="inbox-search-wrapper">
          <InboxSearchComposer configs={configs}></InboxSearchComposer>
      </div>
    </React.Fragment>
  )
}

export default SearchPaymentInstruction;