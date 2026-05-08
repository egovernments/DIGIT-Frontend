import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom";
import { lazyWithFallback } from "@egovernments/digit-ui-components";
import BreadCrumbs from "../../components/pageComponents/BreadCrumb";

const EmployeeDetailScreen = lazyWithFallback(
  () => import(/* webpackChunkName: "hrms-details" */ "./employeeDetails"),
  () => require("./employeeDetails").default,
  { loaderText: "Loading Employee Details..." }
);

const InboxSearch = lazyWithFallback(
  () => import(/* webpackChunkName: "hrms-inbox" */ "./Inbox"),
  () => require("./Inbox").default,
  { loaderText: "Loading Inbox..." }
);

const CreateEmployee = lazyWithFallback(
  () => import(/* webpackChunkName: "hrms-create" */ "./createEmployee"),
  () => require("./createEmployee").default,
  { loaderText: "Loading Create Employee..." }
);

const ResponseScreen = lazyWithFallback(
  () => import(/* webpackChunkName: "hrms-response" */ "./Response"),
  () => require("./Response").default,
  { loaderText: "Loading Response..." }
);

const AssignCampaignInbox = lazyWithFallback(
  () => import(/* webpackChunkName: "hrms-assign-campaign" */ "./CampaignAssignmentInbox"),
  () => require("./CampaignAssignmentInbox").default,
  { loaderText: "Loading Campaign Assignment..." }
);

const EmployeeApp = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="ground-container">
      <BreadCrumbs
        crumbs={[
          {
            content: t("HR_COMMON_BUTTON_HOME"),
            internalLink: `/${window?.contextPath}/employee`,
            show: true,
          },
          {
            content: t("CS_COMMON_INBOX"),
            internalLink: `/${window?.contextPath}/employee/hrms/inbox`,
            show:
              Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "INBOX" ||
              location.pathname.includes("details") ||
              location.pathname.includes("update") ||
              location.pathname.includes("edit"),
          },
          {
            content: t("details"),
            internalLink: `/${window?.contextPath}/employee/hrms/details`,
            show: location.pathname.includes("details"),
          },
          {
            content: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
            internalLink: `/${window?.contextPath}/employee/hrms/create`,
            show: location.pathname.includes("create"),
          },
          {
            content: t("HR_COMMON_EDIT_EMPLOYEE_HEADER"),
            internalLink: `/${window?.contextPath}/employee/hrms/edit`,
            show: location.pathname.includes("edit"),
          },
          {
            content: t("HR_CAMPAIGN_ASSIGNMENT"),
            internalLink: `/${window?.contextPath}/employee/hrms/assign-campaign`,
            show: location.pathname.includes("assign-campaign"),
          },
        ]}
      />
      <Routes>
        <Route path="inbox" element={<InboxSearch />} />
        <Route path="response" element={<ResponseScreen />} />
        <Route path="create" element={<CreateEmployee />} />
        <Route path="edit/:id" element={<CreateEmployee editUser={true} />} />
        <Route path="assign-campaign/:id" element={<AssignCampaignInbox />} />
        <Route path="update/assign-campaign/:id" element={<AssignCampaignInbox editCampaign={true} />} />
        <Route path="details/:id" element={<EmployeeDetailScreen />} />
      </Routes>
    </div>
  );
};

export default EmployeeApp;
