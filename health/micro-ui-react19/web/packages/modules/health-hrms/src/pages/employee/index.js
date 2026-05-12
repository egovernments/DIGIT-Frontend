import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Routes, Route, useLocation } from "react-router-dom";

const EmployeeApp = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const EmployeeDetails = Digit?.ComponentRegistryService?.getComponent("EmployeeDetailScreen");
  const Inbox = Digit?.ComponentRegistryService?.getComponent("InboxSearch");
  const CreateEmployee = Digit?.ComponentRegistryService?.getComponent("HRCreateEmployee");
  const AssignCampaignInbox = Digit?.ComponentRegistryService?.getComponent("AssignCampaignInbox");
  const ResponseScreen = Digit?.ComponentRegistryService?.getComponent("ResponseScreen");

  const BreadCrumbs = Digit?.ComponentRegistryService?.getComponent("BreadCrumbs");
  
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
              Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "INBOX" || location.pathname.includes("details") || location.pathname.includes("update") || location.pathname.includes("edit"),
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
        <Route path="create" element={<CreateEmployee />} />
        <Route path="response" element={<ResponseScreen />} />
        <Route path="edit/:id" element={<CreateEmployee editUser={true} />} />
        <Route path="assign-campaign/:id" element={<AssignCampaignInbox />} />
        <Route path="update/assign-campaign/:id" element={<AssignCampaignInbox editCampaign={true} />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="details/:id" element={<EmployeeDetails />} />
      </Routes>
    </div>
  );
};

export default EmployeeApp;
