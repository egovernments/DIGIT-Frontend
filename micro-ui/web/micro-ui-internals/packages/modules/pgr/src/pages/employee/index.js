import React, { useState } from "react";
import { Switch, Route, useRouteMatch, useLocation } from "react-router-dom";
import { ActionBar, Menu, SubmitBar, BreadCrumb } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import { ComplaintDetails } from "./ComplaintDetails";
// import { CreateComplaint } from "./CreateComplaint";
// import Inbox from "./Inbox";
import { Employee } from "../../constants/Routes";
import InboxV2 from "./new-inbox";
// import Response from "./Response";

const PGRBreadCrumb = ({ location, defaultPath }) => {
  const { t } = useTranslation();
  const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];

  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      path: "",
      content: t("PGR_CREATE_CRUMB"),
      show: pathVar.includes("pgr/complaint/create") ? true : false,
    },
    {
      path: pathVar.includes("pgr/complaint/details") ? `/${window?.contextPath}/employee/pgr/inbox` : "",
      content: t("PGR_INBOX_CRUMB"),
      show: pathVar.includes("pgr/inbox") || pathVar.includes("pgr/complaint/details") ? true : false,
    },
    {
      path: "",
      content: t("PGR_DETAILS_CRUMB"),
      show: pathVar.includes("pgr/complaint/details") ? true : false,
    },
  ];

  const bredCrumbStyle = { maxWidth: "min-content" };

  return <BreadCrumb crumbs={crumbs} spanStyle={bredCrumbStyle} />;
};

const Complaint = () => {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const match = useRouteMatch();
  const { t } = useTranslation();

  const breadcrumConfig = {
    home: {
      content: t("CS_COMMON_HOME"),
      path: Employee.Home,
    },
    inbox: {
      content: t("CS_COMMON_INBOX"),
      path: match.url + Employee.Inbox,
    },
    createComplaint: {
      content: t("CS_PGR_CREATE_COMPLAINT"),
      path: match.url + Employee.CreateComplaint,
    },
    complaintDetails: {
      content: t("CS_PGR_COMPLAINT_DETAILS"),
      path: match.url + Employee.ComplaintDetails + ":id",
    },
    response: {
      content: t("CS_PGR_RESPONSE"),
      path: match.url + Employee.Response,
    },
  };
  function popupCall(option) {
    setDisplayMenu(false);
    setPopup(true);
  }

  const CreateComplaint = Digit?.ComponentRegistryService?.getComponent("PGRCreateComplaintEmp");
  const ComplaintDetails = Digit?.ComponentRegistryService?.getComponent("PGRComplaintDetails");
  const Inbox = Digit?.ComponentRegistryService?.getComponent("PGRInbox");
  const Response = Digit?.ComponentRegistryService?.getComponent("PGRResponseEmp");
  return (
    <React.Fragment>
      <div className="ground-container">
        <React.Fragment>
          <PGRBreadCrumb location={window.location} defaultPath={match} />
        </React.Fragment>
        <Switch>
          <Route path={match.url + Employee.CreateComplaint} component={() => <CreateComplaint parentUrl={match.url} />} />
          <Route path={match.url + Employee.ComplaintDetails + ":id*"} component={() => <ComplaintDetails />} />
          <Route path={match.url + Employee.Inbox} component={Inbox} />
          <Route path={match.url + Employee.Response} component={Response} />
          <Route path={match.url + Employee.InboxV2} component={InboxV2} />
        </Switch>
      </div>
      {/* <ActionBar>
        {displayMenu ? <Menu options={["Assign Complaint", "Reject Complaint"]} onSelect={popupCall} /> : null}
        <SubmitBar label="Take Action" onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar> */}
    </React.Fragment>
  );
};

export default Complaint;
