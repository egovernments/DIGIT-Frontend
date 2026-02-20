import { AppContainer } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation } from "react-router-dom";
import ViewAttendance from "./ViewAttendance";
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
    <AppContainer className="ground-container">
      <React.Fragment>
        <ProjectBreadCrumb location={location} />
      </React.Fragment>

      <Routes>
        <Route path="attendee-inbox" element={<InboxAttendeesSearch />} />
        <Route path="edit-register" element={<EditRegister />} />
        <Route path="view-attendance" element={<ViewAttendance />} />
        <Route path="edit-attendance" element={<ViewAttendance editAttendance={true} />} />
        <Route path="attendance-approve-success" element={<Response />} />
        <Route path="attendance-approve-failed" element={<Response />} />
        <Route path="registers-inbox" element={<AttendanceInbox />} />
        <Route path="generate-bill" element={<BillInbox />} />
        <Route path="my-bills" element={<MyBills />} />
        <Route path="project-selection" element={<ProjectSelect />} />
        <Route path="project-and-aggregation-selection" element={<ProjectSelect />} />
        <Route path="payment-setup" element={<PaymentSetUpPage />} />
        <Route path="payment-setup-success" element={<Response />} />
        <Route path="payment-setup-failed" element={<Response />} />
      </Routes>
    </AppContainer>
  );
};

export default App;
