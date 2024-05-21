import React, { Fragment } from "react";
import ApplicationDetails from "../../../../../templates/ApplicationDetails";
import { useTranslation } from "react-i18next";
import { Header,Loader } from "@egovernments/digit-ui-react-components";

const ViewSupervisionbill = ({ ...props }) => {
  const { t } = useTranslation();
  const businessService = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("works.supervision");
  const { tenantId,billNumber } = Digit.Hooks.useQueryParams();

  const { isLoading, data: applicationDetails, isError } = Digit.Hooks.bills.useSupervisionBillScreen({ t,tenantId,billNumber });

  if(isLoading) return <Loader />

  return (
    <>
      <Header>{t("BILLS_SUPERVISION")}</Header>
      <ApplicationDetails
        applicationDetails={applicationDetails?.applicationDetailsCardOne}
        isLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        moduleCode="Expenditure"
        showTimeLine={false}
        timelineStatusPrefix={`WF_${businessService}_`}
        businessService={businessService}
        // forcedActionPrefix={"ACTION_"}
        tenantId={tenantId}
        applicationNo={""}
        statusAttribute={"state"}
      />

      <ApplicationDetails
        applicationDetails={applicationDetails?.applicationDetailsCardTwo}
        isLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        moduleCode="Expenditure"
        showTimeLine={true}
        timelineStatusPrefix={`WF_${businessService}_`}
        businessService={businessService}
        // forcedActionPrefix={"ACTION_"}
        tenantId={tenantId}
        applicationNo={billNumber}
        statusAttribute={"state"}
      />
    </>
  );
};

export default ViewSupervisionbill;