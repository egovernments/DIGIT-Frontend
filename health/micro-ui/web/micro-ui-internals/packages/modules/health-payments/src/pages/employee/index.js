import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import ViewAttendance from "./ViewAttendance";
import { useLocation } from "react-router-dom";
import BreadCrumbs from "../../components/BreadCrumbs";
import Response from "../../components/Response";
import AttendanceInbox from "./attendance_inbox";
import BillInbox from "./bill_inbox";
import MyBills from "./my_bills";
import ProjectSelect from "./project_selection";
import EditRegister from "./EditRegister";
import InboxAttendeesSearch from "./AttendeeSearchAssign";
import PaymentSetUpPage from "./payment_setup";


const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();

  const local = useLocation();
  const { fromCampaignSupervisor } = local?.state || false;

  const crumbs = [
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      internalLink: `/${window?.contextPath}/employee/payments/project-selection`,
      content: t("HCM_AM_BREADCRUMBS_PROJECT_SELECTION"),
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "REGISTERS_INBOX" || ((Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VIEW_ATTENDANCE" ||
          Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "EDIT_ATTENDANCE") && !fromCampaignSupervisor)
    },
    {
      internalLink: `/${window?.contextPath}/employee/payments/project-and-aggregation-selection`,
      content: t("HCM_AM_BREADCRUMBS_PROJECT_AND_AGGREGATION_SELECTION"),
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "GENERATE_BILL" || ((Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VIEW_ATTENDANCE" ||
          Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "EDIT_ATTENDANCE") && fromCampaignSupervisor)
    },
    {
      internalLink: fromCampaignSupervisor ? `/${window?.contextPath}/employee/payments/generate-bill` : `/${window?.contextPath}/employee/payments/registers-inbox`,
      content: fromCampaignSupervisor ? t("HCM_AM_BREADCRUMBS_GENERATE_BILLS") : t("HCM_AM_BREADCRUMBS_REGISTERS_INBOX"),
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VIEW_ATTENDANCE" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "EDIT_ATTENDANCE" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "EDIT_REGISTER"
    },
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t(`HCM_AM_BREADCRUMBS_${Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop())}`),
      show: true,
    }
  ];
  return <BreadCrumbs crumbs={crumbs} />;
};

const App = ({ path, stateCode, userType, tenants }) => {

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        
        <PrivateRoute path={`${path}/attendee-inbox`} component={() => <InboxAttendeesSearch />} />
         <PrivateRoute path={`${path}/edit-register`} component={() => <EditRegister />} />
        <PrivateRoute path={`${path}/view-attendance`} component={() => <ViewAttendance />} />
        <PrivateRoute path={`${path}/edit-attendance`} component={() => <ViewAttendance editAttendance={true} />} />
        <PrivateRoute path={`${path}/attendance-approve-success`} component={() => <Response />} />
        <PrivateRoute path={`${path}/attendance-approve-failed`} component={() => <Response />} />
        <PrivateRoute path={`${path}/registers-inbox`} component={() => <AttendanceInbox />} />
        <PrivateRoute path={`${path}/generate-bill`} component={() => <BillInbox />} />
        <PrivateRoute path={`${path}/my-bills`} component={() => <MyBills />} />
        <PrivateRoute path={`${path}/project-selection`} component={() => <ProjectSelect />} />
        <PrivateRoute path={`${path}/project-and-aggregation-selection`} component={() => <ProjectSelect />} />
        <PrivateRoute path={`${path}/payment-setup`} component={() => <PaymentSetUpPage />} />
        <PrivateRoute path={`${path}/payment-setup-success`} component={() => <Response />} />
        <PrivateRoute path={`${path}/payment-setup-failed`} component={() => <Response />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
