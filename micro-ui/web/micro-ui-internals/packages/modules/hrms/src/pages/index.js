import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation, useHistory } from "react-router-dom";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
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
          <div style={{ marginBottom: "16px", marginLeft: mobileView ? "1vw" : "0px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              padding: "4px 14px",
              borderRadius: "5px",
              backgroundColor: "#efefef",
              border: "1px solid #efefef",
            }}>
              <span
                style={{ color: "#F47738", cursor: "pointer" }}
                onClick={() => history.goBack()}
              >
                {t("CS_COMMON_HOME")}
              </span>
              <span style={{ color: "#333", margin: "0 2px" }}>/</span>
              <span style={{ color: "#0B0C0C" }}>
                {t("HR_COMMON_HEADER")}
              </span>
            </div>
          </div>
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <Inbox parentRoute={path} businessService="hrms" filterComponent="HRMS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />
            )}
          />
          <PrivateRoute path={`${path}/create`} component={() => <CreateEmployee />} />
          <PrivateRoute path={`${path}/response`} component={(props) => <HRMSResponse {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/details/:tenantId/:id`} component={() => <HRMSDetails />} />
          <PrivateRoute path={`${path}/edit/:tenantId/:id`} component={() => <EditEmpolyee />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
