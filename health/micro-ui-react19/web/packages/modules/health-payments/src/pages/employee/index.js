import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { lazyWithFallback } from "@egovernments/digit-ui-components";
import BreadCrumbs from "../../components/BreadCrumbs";

const ViewAttendance = lazyWithFallback(
  () => import(/* webpackChunkName: "view-attendance" */ "./ViewAttendance"),
  () => require("./ViewAttendance").default,
  { loaderText: "Loading View Attendance..." }
);

const AttendanceInbox = lazyWithFallback(
  () => import(/* webpackChunkName: "attendance-inbox" */ "./attendance_inbox"),
  () => require("./attendance_inbox").default,
  { loaderText: "Loading Attendance Inbox..." }
);

const BillInbox = lazyWithFallback(
  () => import(/* webpackChunkName: "bill-inbox" */ "./bill_inbox"),
  () => require("./bill_inbox").default,
  { loaderText: "Loading Bill Inbox..." }
);

const MyBills = lazyWithFallback(
  () => import(/* webpackChunkName: "my-bills" */ "./my_bills"),
  () => require("./my_bills").default,
  { loaderText: "Loading My Bills..." }
);

const ProjectSelect = lazyWithFallback(
  () => import(/* webpackChunkName: "project-selection" */ "./project_selection"),
  () => require("./project_selection").default,
  { loaderText: "Loading Project Selection..." }
);

const EditRegister = lazyWithFallback(
  () => import(/* webpackChunkName: "edit-register" */ "./EditRegister"),
  () => require("./EditRegister").default,
  { loaderText: "Loading Edit Register..." }
);

const InboxAttendeesSearch = lazyWithFallback(
  () => import(/* webpackChunkName: "attendee-search-assign" */ "./AttendeeSearchAssign"),
  () => require("./AttendeeSearchAssign").default,
  { loaderText: "Loading Attendee Search..." }
);

const PaymentSetUpPage = lazyWithFallback(
  () => import(/* webpackChunkName: "payment-setup" */ "./payment_setup"),
  () => require("./payment_setup").default,
  { loaderText: "Loading Payment Setup..." }
);

const Response = lazyWithFallback(
  () => import(/* webpackChunkName: "response" */ "../../components/Response"),
  () => require("../../components/Response").default,
  { loaderText: "Loading..." }
);

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

const App = ({ stateCode, userType, tenants }) => {
  const location = useLocation();

  return (
    <div className="ground-container">
      <ProjectBreadCrumb location={location} />
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
    </div>
  );
};

export default App;
