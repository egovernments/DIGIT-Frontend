import React, { useState, useEffect, Suspense } from "react";
import { Switch, useLocation, Link, useRouteMatch } from "react-router-dom";
import { PrivateRoute, BreadCrumb, BackButton } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Inbox from "./Inbox";
import NewApplication from "./NewApplication";
import Search from "./Search";
// import Response from "../Response";
import ApplicationDetails from "./ApplicationDetails";
import ReNewApplication from "./ReNewApplication";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  const match = useRouteMatch();

  const InboxBackButton = ({ url, isInbox }) => {
    return (
      <Link to={url} style={{ textDecoration: "none" }}>
        <span className="back-btn" style={{ borderBottom: isInbox ? "none" : "1px solid #000000" }}>
          <svg style={{ verticalAlign: "bottom" }} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8L16.2929 8.29289L16.5858 8L16.2929 7.70711L16 8ZM0.292893 7.29289C-0.0976311 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM16 7L1 7V9L16 9V7Z" fill="#0B0C0C" />
          </svg>
          {t("CS_COMMON_BACK")}
        </span>
      </Link>
    );
  };

  const breadcrumb = null;
  // TODO: Add breadcrumb logic if needed.

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <BreadCrumb crumbs={[{ path: "/digit-ui/employee", content: t("ES_COMMON_HOME"), show: true }]} />
          </p>
          <PrivateRoute path={`${path}/inbox`} component={() => <Inbox parentRoute={path} businessService="TL" filterComponent="TL_INBOX_FILTER" initialStates={{}} isInbox={true} />} />
          <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
          <PrivateRoute path={`${path}/search/application`} component={() => <Search />} />
          <PrivateRoute path={`${path}/search/license`} component={() => <Search />} />
          {/* <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} parentRoute={path} />} /> */}
          <PrivateRoute path={`${path}/application-details/:id`} component={() => <ApplicationDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/renew-application-details/:id`} component={(props) => <ReNewApplication {...props} parentRoute={path} />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
