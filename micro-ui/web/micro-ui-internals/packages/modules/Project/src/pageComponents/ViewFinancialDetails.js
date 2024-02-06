import { Loader, Card } from '@egovernments/digit-ui-react-components';
import React, { Fragment, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import ApplicationDetails from '../../../templates/ApplicationDetails';

const ViewFinancialDetails = (props) => {
  const { tenantId, projectNumber } = Digit.Hooks.useQueryParams();
  const searchParams = {
    Projects: [
      {
        tenantId,
        projectNumber: projectNumber
      }
    ]
  }
  const filters = {
    limit: 11,
    offset: 0,
    includeAncestors: true,
    includeDescendants: true
  }

  const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
  const { t } = useTranslation()
  const { data, isLoading } = Digit.Hooks.works.useViewProjectDetails(t, tenantId, searchParams, filters, headerLocale);
  
  return (
    <>
        <ApplicationDetails
            applicationDetails={data?.projectDetails?.searchedProject?.details?.financialDetails}
            isLoading={isLoading} 
            applicationData={{}}
            moduleCode="works"
            isDataLoading={isLoading}
            workflowDetails={{}}
            showTimeLine={false}
            timelineStatusPrefix={""}
            businessService={""}
            forcedActionPrefix={"WORKS"}
            noBoxShadow={true}
        />
    </>
  )
}

export default ViewFinancialDetails;