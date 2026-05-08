import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BackButton } from "@egovernments/digit-ui-react-components";
import { lazyWithFallback } from "@egovernments/digit-ui-components";

// Lazy-load all citizen page components
const CreateComplaint = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-citizen-create" */ "./Create").then((m) => ({ default: m.CreateComplaint })),
  () => ({ default: require("./Create").CreateComplaint }),
  { loaderText: "Loading..." }
);

const ComplaintsList = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-complaints-list" */ "./ComplaintsList").then((m) => ({ default: m.ComplaintsList })),
  () => ({ default: require("./ComplaintsList").ComplaintsList }),
  { loaderText: "Loading..." }
);

const ComplaintDetailsPage = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-citizen-details" */ "./ComplaintDetails"),
  () => require("./ComplaintDetails").default,
  { loaderText: "Loading..." }
);

const SelectRating = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-rating" */ "./Rating/SelectRating"),
  () => require("./Rating/SelectRating").default,
  { loaderText: "Loading..." }
);

const Response = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-citizen-response" */ "./Response"),
  () => require("./Response").default,
  { loaderText: "Loading..." }
);

const ReopenComplaint = lazyWithFallback(
  () => import(/* webpackChunkName: "pgr-reopen" */ "./ReopenComplaint"),
  () => require("./ReopenComplaint").default,
  { loaderText: "Loading..." }
);

// Citizen PGR app — mounts at /{contextPath}/citizen/pgr/*
// React Router v6: Routes + Route element={} — no Switch, no PrivateRoute wrapper needed
// BackButton hidden on the /response page (same logic as React 17 version).
const CitizenPGRApp = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isResponsePage = location.pathname.includes("/response");

  const basePath = `/${window?.contextPath}/citizen/pgr`;

  return (
    <div className="pgr-citizen-wrapper">
      {!isResponsePage && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
      <Routes>
        {/* Multi-step create flow — uses nested Routes internally */}
        <Route path="create-complaint/*" element={<CreateComplaint />} />
        {/* Complaints list */}
        <Route path="complaints" element={<ComplaintsList />} />
        {/* Complaint details by ID */}
        <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
        {/* Rating after resolution */}
        <Route path="rate/:id" element={<SelectRating parentRoute={basePath} />} />
        {/* Reopen a complaint */}
        <Route path="reopen" element={<ReopenComplaint parentRoute={basePath} />} />
        {/* Response/confirmation page */}
        <Route path="response" element={<Response />} />
      </Routes>
    </div>
  );
};

export default CitizenPGRApp;
