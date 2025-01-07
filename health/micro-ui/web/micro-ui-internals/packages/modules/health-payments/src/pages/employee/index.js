import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import ViewAttendance from "./ViewAttendance";
import BreadCrumbs from "../../components/BreadCrumbs";
import Response from "../../components/Response";
import AttendanceInbox from "./attendance_inbox";
import BillInbox from "./bill_inbox";
import MyBills from "./my_bills";


const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();

  const crumbs = [
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      internalLink: `/${window?.contextPath}/employee/payments/registers-inbox`,
      content: t("HCM_AM_BREADCRUMBS_REGISTERS_INBOX"),
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VIEW_ATTENDANCE" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "EDIT_ATTENDANCE"
    },
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t(`HCM_AM_BREADCRUMBS_${location.pathname.split("/").pop()}`),
      show: true,
    }
  ];
  return <BreadCrumbs crumbs={crumbs} />;
};

const App = ({ path, stateCode, userType, tenants }) => {


  useEffect(() => {
    if (window.location.pathname !== `/${window.contextPath}/employee/`) {
      window.Digit.SessionStorage.del("selectedLevel");
      window.Digit.SessionStorage.del("selectedProject");
      window.Digit.SessionStorage.del("selectedBoundaryCode");
      sessionStorage.removeItem("selectedValues");
    }
  }, []);

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/view-attendance`} component={() => <ViewAttendance />} />
        <PrivateRoute path={`${path}/edit-attendance`} component={() => <ViewAttendance editAttendance={true} />} />
        <PrivateRoute path={`${path}/attendance-approve-success`} component={() => <Response />} />
        <PrivateRoute path={`${path}/attendance-approve-failed`} component={() => <Response />} />
        <PrivateRoute path={`${path}/registers-inbox`} component={() => <AttendanceInbox />} />
        <PrivateRoute path={`${path}/generate-bill`} component={() => <BillInbox />} />
        <PrivateRoute path={`${path}/my-bills`} component={() => <MyBills />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
