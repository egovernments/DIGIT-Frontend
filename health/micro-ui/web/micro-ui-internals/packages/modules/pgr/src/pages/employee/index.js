/**
 * EmployeeApp - Main Routing Component for PGR Employee Module
 * 
 * Purpose:
 * This component handles all route-level rendering for PGR employee-facing features like:
 * - Creating a complaint
 * - Viewing complaint inbox
 * - Viewing complaint details
 * - Handling success/failure response screens
 * 
 * Functionalities:
 * - Dynamically loads feature components using Digit's ComponentRegistryService
 * - Sets up breadcrumbs based on current route
 * - Renders private routes with layout wrapper (AppContainer)
 */

import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";

const EmployeeApp = ({ path, stateCode, userType, tenants }) => {
  const { t } = useTranslation(); // Hook for translations
  const location = useLocation(); // Used to determine the current pathname for conditional rendering

  // Dynamically fetch PGR module screens from the registry
  const PGRCreateComplaint = Digit?.ComponentRegistryService?.getComponent("PGRCreateComplaint");
  const PGRComplaintDetails = Digit?.ComponentRegistryService?.getComponent("PGRComplaintDetails");
  const PGRSearchInbox = Digit?.ComponentRegistryService?.getComponent("PGRSearchInbox");
  const PGRResponse = Digit?.ComponentRegistryService?.getComponent("PGRResponse");
  const BreadCrumbs = Digit?.ComponentRegistryService?.getComponent("PGRBreadCrumbs");

  return (
    <Switch>
      {/* AppContainer provides a consistent layout and styling */}
      <AppContainer className="ground-container">

        {/* Render dynamic breadcrumbs based on route path */}
        <React.Fragment>
          <BreadCrumbs
            location={location}
            crumbs={[
              {
                content: t("ACTION_TEST_HOME"), // Home label
                internalLink: `/${window?.contextPath}/employee`, // Link to employee home
                show: !location.pathname.includes("complaint-success"),
              },
              {
                internalLink: `/${window?.contextPath}/employee/pgr/create-complaint`,
                content: t("ACTION_TEST_CREATE_COMPLAINT"),
                show: location.pathname.includes("create-complaint"),
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
              }
            ]}
          />
        </React.Fragment>

        {/* Route for Create Complaint Form */}
        <PrivateRoute
          path={`${path}/create-complaint`}
          component={() => <PGRCreateComplaint />}
        />

        {/* Routes for Complaint submission success/failure response */}
        <PrivateRoute
          path={`${path}/complaint-success`}
          component={() => <PGRResponse />}
        />
        <PrivateRoute
          path={`${path}/complaint-failed`}
          component={() => <PGRResponse />}
        />

        {/* Route for Complaint Details view by complaint ID */}
        <PrivateRoute
          path={`${path}/complaint-details/:id`}
          component={() => <PGRComplaintDetails />}
        />

        {/* Route for Complaint Search Inbox */}
        <PrivateRoute
          path={`${path}/inbox-v2`}
          component={() => <PGRSearchInbox />}
        />

      </AppContainer>
    </Switch>
  );
};

export default EmployeeApp;
