import { FormComposer, Header } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import ApplicationDetails from "../../../../../templates/ApplicationDetails";

const ViewBills = () => {
  const { t } = useTranslation();
  const billType = useLocation()?.state?.billType;
  const { applicationDetails, applicationData, workflowDetails } = Digit.Hooks.bills.useViewBills(billType); //pass required inputs when backend service is ready.

  return (
    <React.Fragment>
      <div className={"employee-main-application-details"}>
        <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
          <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("EXP_VIEW_BILL")}</Header>
        </div>
        <ApplicationDetails
          applicationDetails={applicationDetails}
          isLoading={false} //will come from backend
          applicationData={applicationData}
          moduleCode="Expenditure"
          isDataLoading={false}
          workflowDetails={workflowDetails}
          showTimeLine={true}
          timelineStatusPrefix={""}
          businessService={""}
          forcedActionPrefix={"EXP"}
        />
      </div>
    </React.Fragment>
  );
}

export default ViewBills;