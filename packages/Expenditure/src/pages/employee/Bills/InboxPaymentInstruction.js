import React, { useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { InboxPaymentInstructionConfig } from '../../../configs/InboxPaymentInstructionConfig';

const InboxPaymentInstruction = () => {
  const { t } = useTranslation();
  const { state } = useLocation()
  const stateTenant = Digit.ULBService.getStateId();

  const { isLoading, data:configs } = Digit.Hooks.useCustomMDMS(
      stateTenant,
      Digit.Utils.getConfigModuleName(),
      [
          {
              "name": "InboxBillConfig"
          }
      ],
      {
        select: (data) => {
            const config = InboxPaymentInstructionConfig?.InboxPaymentInstructionConfig[0];
            // const config =  data?.[Digit.Utils.getConfigModuleName()]?.InboxBillConfig[0];
            // const config =  data?.[Digit.Utils.getConfigModuleName()]?.InboxPaymentInstructionConfig[0];
            
            const updatedConfig = Digit.Utils.preProcessMDMSConfigInboxSearch(t, config, "sections.search.uiConfig.fields",{})
            return updatedConfig
        },
      }
  );
  

  //For local
  // let configs = useMemo( () => Digit.Utils.preProcessMDMSConfigInboxSearch(t, InboxBillConfig?.InboxBillConfig?.[0], "sections.search.uiConfig.fields",{}));


  if(isLoading) return <Loader />
  return (
      <React.Fragment>
          <Header styles={{ fontSize: "32px" }}>{t(configs?.label)}{state?.count ? <span className="inbox-count">{state?.count}</span> : null}</Header>
          <div className="inbox-search-wrapper">
            <InboxSearchComposer configs={configs}></InboxSearchComposer>
          </div>
      </React.Fragment>
  )
}

export default InboxPaymentInstruction;