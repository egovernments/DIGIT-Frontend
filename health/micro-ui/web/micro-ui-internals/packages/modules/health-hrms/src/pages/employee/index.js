import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";

const EmployeeApp = ({ path }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const EmployeeDetails = Digit?.ComponentRegistryService?.getComponent("EmployeeDetailScreen");
  const Inbox = Digit?.ComponentRegistryService?.getComponent("InboxSearch");
  const CreateEmployee = Digit?.ComponentRegistryService?.getComponent("HRCreateEmployee");
  const AssignCampaignInbox = Digit?.ComponentRegistryService?.getComponent("AssignCampaignInbox");
  const ResponseScreen = Digit?.ComponentRegistryService?.getComponent("ResponseScreen");

  const BreadCrumbs = Digit?.ComponentRegistryService?.getComponent("BreadCrumbs");
  
  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          {/*
            <p className="breadcrumb" style={{ marginLeft: mobileView ? "1vw" : "15px" }}>
              <Link to={`/${window.contextPath}/employee`} style={{ cursor: "pointer", color: "#666" }}>
                {t("HR_COMMON_BUTTON_HOME")}
              </Link>{" "}
              / <span>{location.pathname === `/${window.contextPath}/employee/hrms/inbox` ? t("HR_COMMON_HEADER") : t("HR_COMMON_HEADER")}</span>
            </p>
            */}
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
                  Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "INBOX" || location.pathname.includes("details") ||location.pathname.includes("update")||location.pathname.includes("edit"),
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
              // {
              //   content: t("HR_EDIT_CAMPAIGN_ASSIGNMENT"),
              //   internalLink: `/${window?.contextPath}/employee/hrms/update/assign-campaign`,
              //   show: location.pathname.includes("update"),
              // },
            ]}
          />
          <PrivateRoute path={`${path}/create`} component={() => <CreateEmployee />} />
          <PrivateRoute path={`${path}/response`} component={() => <ResponseScreen />} />
          <PrivateRoute path={`${path}/edit/:id`} component={() => <CreateEmployee editUser={true} />} />
          <PrivateRoute path={`${path}/assign-campaign/:id`} component={() => <AssignCampaignInbox />} />

          <PrivateRoute path={`${path}/update/assign-campaign/:id`} component={() => <AssignCampaignInbox editCampaign={true} />} />
          <PrivateRoute path={`${path}/inbox`} component={() => <Inbox />} />
          <PrivateRoute path={`${path}/details/:id`} component={() => <EmployeeDetails />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
