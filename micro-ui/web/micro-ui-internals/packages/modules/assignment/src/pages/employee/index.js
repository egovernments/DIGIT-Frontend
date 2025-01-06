import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import AssignmentCreate from "./AssignmentCreate";
import AssignmentSearchs from "./AssignmentSearchs";
import AssignmentView from "./AssignmentView";

const EmployeeApp = ({ path, url, userType }) => {
    console.log(path);
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
  const HRMSDetails = Digit?.ComponentRegistryService?.getComponent("HRMSDetails");
  const Inbox = Digit?.ComponentRegistryService?.getComponent("HRInbox");
  const CreateEmployee = Digit?.ComponentRegistryService?.getComponent("HRCreateEmployee");
  const EditEmpolyee = Digit?.ComponentRegistryService?.getComponent("HREditEmpolyee");

  const employeeCreateSession = Digit.Hooks.useSessionStorage("NEW_EMPLOYEE_CREATE", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = employeeCreateSession;

  // remove session form data if user navigates away from the estimate create screen
  useEffect(() => {
    if (!window.location.href.includes("/hrms/create") && sessionFormData && Object.keys(sessionFormData) != 0) {
      clearSessionFormData();
    }
  }, [location]);

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "1vw" : "0px" }}>
            <Link to={`/${window?.contextPath}/employee`} style={{ cursor: "pointer", color: "#666" }}>
              {t("HR_COMMON_BUTTON_HOME")}
            </Link>{" "}
            / <span>{location.pathname === `/${window?.contextPath}/employee/hrms/inbox` ? t("HR_COMMON_HEADER") : t("HR_COMMON_HEADER")}</span>
          </p>
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <Inbox parentRoute={path} businessService="hrms" filterComponent="HRMS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />
            )}
          />
          <PrivateRoute path={`${path}/assignment-searchs`} component={() => <AssignmentSearchs />} />
          <PrivateRoute path={`${path}/assignment-view`} component={() => <AssignmentView />} />
          <PrivateRoute path={`${path}/assignment-create`} component={() => <AssignmentCreate />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
