import React from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";
import HierarchySelection from "../../components/HierarchySelection";

const EmployeeApp = ({ stateCode, userType, tenants }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const PGRCreateComplaint = Digit?.ComponentRegistryService?.getComponent("PGRCreateComplaint");
  const PGRComplaintDetails = Digit?.ComponentRegistryService?.getComponent("PGRComplaintDetails");
  const PGRSearchInbox = Digit?.ComponentRegistryService?.getComponent("PGRSearchInbox");
  const PGRResponse = Digit?.ComponentRegistryService?.getComponent("PGRResponse");
  const BreadCrumbs = Digit?.ComponentRegistryService?.getComponent("PGRBreadCrumbs");

  const hierarchySelected = Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED");

  if (!hierarchySelected && !location.pathname.includes("select-hierarchy")) {
    return <Navigate to="select-hierarchy" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="ground-container">
      <React.Fragment>
        <BreadCrumbs
          location={location}
          crumbs={[
            {
              content: t(I18N_KEYS.PAGES_INBOX.ACTION_TEST_HOME),
              internalLink: `/${window?.contextPath}/employee`,
              show: !location.pathname.includes("complaint-success"),
            },
            {
              content: t(I18N_KEYS.COMPONENTS.HCM_HIERARCHY_TYPE_BREADCRUMB),
              internalLink: `/${window?.contextPath}/employee/pgr/select-hierarchy`,
              show: !location.pathname.includes("complaint-success") && !location.pathname.includes("complaint-failed"),
            },
            {
              internalLink: `/${window?.contextPath}/employee/pgr/create-complaint`,
              content: t(I18N_KEYS.PAGES_INBOX.ACTION_TEST_CREATE_COMPLAINT),
              show: location.pathname.includes("create-complaint"),
            },
            {
              internalLink: `/${window?.contextPath}/employee/pgr/inbox-v2`,
              content: t(I18N_KEYS.PAGES_INBOX.PGR_INBOX),
              show: location.pathname.includes("inbox") || location.pathname.includes("complaint-details"),
            },
            {
              internalLink: `/${window?.contextPath}/employee/pgr/complaint-details`,
              content: t(I18N_KEYS.PAGES_INBOX.CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS),
              show: location.pathname.includes("complaint-details"),
            },
          ]}
        />
      </React.Fragment>

      <Routes>
        <Route path="select-hierarchy" element={<HierarchySelection />} />
        <Route path="create-complaint" element={<PGRCreateComplaint />} />
        <Route path="complaint-success" element={<PGRResponse />} />
        <Route path="complaint-failed" element={<PGRResponse />} />
        <Route path="complaint-details/:id" element={<PGRComplaintDetails />} />
        <Route path="inbox-v2" element={<PGRSearchInbox />} />
      </Routes>
    </div>
  );
};

export default EmployeeApp;
