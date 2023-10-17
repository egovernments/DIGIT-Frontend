import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { Header, Toast } from '@egovernments/digit-ui-react-components';
import ApplicationDetails from '../../../../../templates/ApplicationDetails';

const ViewWageBill = () => {
  const { t } = useTranslation();
  const businessService = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("works.wages");
  const { tenantId, billNumber } = Digit.Hooks.useQueryParams();
  const [showDataError, setShowDataError] = useState(null)

  const payload = {
    billCriteria: {
      tenantId,
      billNumbers: [ billNumber ],
      businessService: businessService,
    },
    pagination: { limit: 10, offSet: 0, sortBy: "ASC", order: "ASC"}
  }
  const {isLoading, data, isError, isSuccess, error} = Digit.Hooks.bills.useViewWageBill({tenantId, data: payload, config: { cacheTime:0 }})
  
  useEffect(() => {
    if(isError) {
      setShowDataError(true)
    }
  }, [error])

  return (
    <React.Fragment>
      <Header className="works-header-view">{t("EXP_VIEW_BILL")}</Header>
      {
        showDataError === null && (
          <ApplicationDetails
            applicationDetails={data?.applicationDetails}
            isLoading={isLoading}
            applicationData={data?.applicationData}
            moduleCode="AttendenceMgmt"
            isDataLoading={false}
            workflowDetails={data?.workflowDetails}
            showTimeLine={true}
            timelineStatusPrefix={`WF_${businessService}_`}
            applicationNo={billNumber}
            businessService={businessService}
            statusAttribute={"state"}
            mutate={()=>{}}
            tenantId={tenantId}
          />
        )
      }
      {
        showDataError && <Toast error={true} label={t("COMMON_ERROR_FETCHING_BILL_DETAILS")} isDleteBtn={true} onClose={() => setShowDataError(false)} />
      }
    </React.Fragment>
  )
}

export default ViewWageBill;