import React from 'react'
import { Header, InboxSearchComposer, Loader} from '@digit-ui/digit-ui-react-components';
import { DownloadBillConfig } from '../../../configs/DownloadBillConfig';
import { useTranslation } from 'react-i18next';

const DownloadBill = () => {
  const { t } = useTranslation();
  const tenant = Digit.ULBService.getStateId();
  const configModuleName = Digit.Utils.getConfigModuleName()
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(
    tenant,
    configModuleName,
    [
        {
            "name": "DownloadBillConfig"
        }
    ]
);
  const configs = data?.[configModuleName]?.DownloadBillConfig?.[0]

  if (isLoading) return <Loader />
  return (
    <React.Fragment>
         <Header className="works-header-search">{t(configs?.label)}</Header>
         <div className="inbox-search-wrapper">
          <InboxSearchComposer configs={configs}></InboxSearchComposer>
        </div>
    </React.Fragment>
  )
}

export default DownloadBill;
