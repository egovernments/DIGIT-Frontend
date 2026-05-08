import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BreadCrumb } from "@egovernments/digit-ui-react-components";
import { lazyWithFallback } from "@egovernments/digit-ui-components";
import { Employee } from "../../constants/Routes";

// Lazy-load all page components — same pattern as campaign-manager
const Inbox = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-inbox" */ "./Inbox"),
  () => require("./Inbox").default,
  { loaderText: "Loading Inbox..." }
);

const ComplaintDetails = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-complaint-details" */ "./ComplaintDetails").then((m) => ({ default: m.ComplaintDetails })),
  () => ({ default: require("./ComplaintDetails").ComplaintDetails }),
  { loaderText: "Loading Complaint Details..." }
);

const CreateComplaint = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-create-complaint" */ "./CreateComplaint").then((m) => ({ default: m.CreateComplaint })),
  () => ({ default: require("./CreateComplaint").CreateComplaint }),
  { loaderText: "Loading Create Complaint..." }
);

const Response = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-emp-response" */ "./Response"),
  () => require("./Response").default,
  { loaderText: "Loading Response..." }
);

const InboxV2 = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-inbox-v2" */ "./new-inbox"),
  () => require("./new-inbox").default,
  { loaderText: "Loading Inbox..." }
);

// Breadcrumb for PGR employee section
const PGRBreadCrumb = ({ defaultPath }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];

  const crumbs = [
    { path: `/${window?.contextPath}/employee`, content: t("HOME"), show: true },
    {
      path: pathVar.includes("pgr/complaint/details") ? `/${window?.contextPath}/employee/pgr/inbox` : "",
      content: t("PGR_INBOX_CRUMB"),
      show: pathVar.includes("pgr/inbox") || pathVar.includes("pgr/complaint/details"),
    },
    {
      path: "",
      content: t("PGR_CREATE_CRUMB"),
      show: pathVar.includes("pgr/complaint/create"),
    },
    {
      path: "",
      content: t("PGR_DETAILS_CRUMB"),
      show: pathVar.includes("pgr/complaint/details"),
    },
  ];

  return <BreadCrumb crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

// Employee app container — mounts at /{contextPath}/employee/pgr/*
// React Router v6: Routes + Route element={} instead of Switch + Route component={}
const EmployeePGRApp = () => {
  const location = useLocation();

  return (
    <div className="ground-container">
      <PGRBreadCrumb defaultPath={`/${window?.contextPath}/employee/pgr`} />
      <Routes>
        <Route path="inbox" element={<Inbox />} />
        <Route path="inbox-v2" element={<InboxV2 />} />
        <Route path="complaint/create" element={<CreateComplaint parentUrl={`/${window?.contextPath}/employee/pgr`} />} />
        {/* :id catches the serviceRequestId; no * needed in v6 */}
        <Route path="complaint/details/:id" element={<ComplaintDetails />} />
        <Route path="response" element={<Response />} />
      </Routes>
    </div>
  );
};

export default EmployeePGRApp;
