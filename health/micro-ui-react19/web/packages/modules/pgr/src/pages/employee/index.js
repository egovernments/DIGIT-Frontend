import React from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation } from "react-router-dom";

const EmployeeApp = ({ stateCode, userType, tenants }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const PGRCreateComplaint = Digit?.ComponentRegistryService?.getComponent("PGRCreateComplaint");
  const PGRComplaintDetails = Digit?.ComponentRegistryService?.getComponent("PGRComplaintDetails");
  const PGRSearchInbox = Digit?.ComponentRegistryService?.getComponent("PGRSearchInbox");
  const PGRResponse = Digit?.ComponentRegistryService?.getComponent("PGRResponse");
  const BreadCrumbs = Digit?.ComponentRegistryService?.getComponent("PGRBreadCrumbs");

  return (
    <div className="ground-container">
      <React.Fragment>
        <BreadCrumbs
          location={location}
          crumbs={[
            {
              content: t("ACTION_TEST_HOME"),
              internalLink: `/${window?.contextPath}/employee`,
              show: !location.pathname.includes("complaint-success"),
            },
            {
              internalLink: `/${window?.contextPath}/employee/pgr/complaint/create`,
              content: t("ACTION_TEST_CREATE_COMPLAINT"),
              show: location.pathname.includes("complaint/create"),
            },
            {
              internalLink: `/${window?.contextPath}/employee/pgr/inbox-v2`,
              content: t("PGR_INBOX"),
              show: location.pathname.includes("inbox") || location.pathname.includes("complaint-details"),
            },
            {
              internalLink: `/${window?.contextPath}/employee/pgr/complaint-details`,
              content: t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS"),
              show: location.pathname.includes("complaint-details"),
            },
          ]}
        />
      </React.Fragment>

      <Routes>
        <Route path="complaint/create" element={<PGRCreateComplaint />} />
        <Route path="complaint-success" element={<PGRResponse />} />
        <Route path="complaint-failed" element={<PGRResponse />} />
        <Route path="complaint-details/:id" element={<PGRComplaintDetails />} />
        <Route path="inbox-v2" element={<PGRSearchInbox />} />
      </Routes>
    </div>
  );
};

export default EmployeeApp;
