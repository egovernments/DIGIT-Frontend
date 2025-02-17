import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const inboxInitialState = {
    searchParams: {
      tenantId: tenantId,
    },
  };

  const HRMSResponse = Digit?.ComponentRegistryService?.getComponent("HRMSResponse");
  // const HRMSDetails = Digit?.ComponentRegistryService?.getComponent("HRMSDetails");
  // const Inbox = Digit?.ComponentRegistryService?.getComponent("HRInbox");
  const CreateEmployee = Digit?.ComponentRegistryService?.getComponent("HRCreateEmployee");
  //const EditEmpolyee = Digit?.ComponentRegistryService?.getComponent("HREditEmpolyee");
  const AssignCampaign = Digit?.ComponentRegistryService?.getComponent("AssignCampaign");
  const ResponseScreen = Digit?.ComponentRegistryService?.getComponent("ResponseScreen");
  
  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "1vw" : "15px" }}>
            <Link to={`/${window.contextPath}/employee`} style={{ cursor: "pointer", color: "#666" }}>
              {t("HR_COMMON_BUTTON_HOME")}
            </Link>{" "}
            / <span>{location.pathname === `/${window.contextPath}/employee/hrms/inbox` ? t("HR_COMMON_HEADER") : t("HR_COMMON_HEADER")}</span>
          </p>
          <PrivateRoute path={`${path}/create`} component={() => <CreateEmployee />} />
          <PrivateRoute path={`${path}/response`} component={(props) => <ResponseScreen />} />
          <PrivateRoute path={`${path}/edit/:tenantId/:id`} component={() => <CreateEmployee editUser={true} />} />
          <PrivateRoute path={`${path}/assign-campaign/:id`} component={() => <AssignCampaign />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
