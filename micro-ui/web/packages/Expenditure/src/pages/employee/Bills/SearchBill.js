import React, { useMemo } from 'react'
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from 'react-router-dom';
import { Header, InboxSearchComposer, Loader, Button, DownloadImgIcon} from "@egovernments/digit-ui-react-components";
import { SearchBillConfig } from '../../../configs/SearchBillConfig';
import { SearchBillWMSConfig } from '../../../configs/SearchBillWMSConfig';
import { SearchExpenseBillConfig } from '../../../configs/SearchExpenseBillConfig';

const SearchBill = () => {
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
              "name": "SearchBillConfig"
          }
      ],
      {
        select: (data) => {
            const result =  data?.[Digit.Utils.getConfigModuleName()]?.SearchBillConfig[0];
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
           configs.sections.searchResult.uiConfig.showCheckBox = Digit.Utils.didEmployeeHasRole(configs?.actionRole)
           return configs
        },
      }
  );
  

  //For local Update data to access searchConfig or searchWMS config
  // const configs = SearchBillConfig?.SearchBillConfig?.[0]

  

  if(isLoading) return <Loader />

  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        <Header className="works-header-search">{t(configs?.label)}</Header>
        {Digit.Utils.didEmployeeHasRole(configs?.actionRole) && (
            <Button
              label={t(configs?.actionLabel)}
              variation="secondary"
              icon={<DownloadImgIcon style={{height : "20px", width : "20px"}}/>}
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

export default SearchBill;