import React, { useState } from "react";
import { Switch, Route, useRouteMatch, useLocation } from "react-router-dom";
import { ActionBar, Menu, SubmitBar, BreadCrumb,PrivateRoute,Loader } from "@digit-ui/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Employee } from "../../constants/Routes";
import { CreateComplaint } from "./CreateComplaint";
import Inbox from "./Inbox";
import { ComplaintDetails } from "./ComplaintDetails";


const Complaint = ({path,...props}) => {

  const { t, i18n } = useTranslation();
  const { isLoading } = Digit.Hooks.core.useLocalization({
    params: {
      tenantId: Digit.ULBService.getStateId(),
      module: 'rainmaker-pgr',
      locale: i18n.language,
    },
    i18n,
  });

  

  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const match = useRouteMatch();

  
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

  let location = useLocation().pathname;

  if (isLoading) {
    return <Loader />;
  }
  console.log(`${path}/${Employee.ComplaintDetails}`);

  return (
    <React.Fragment>
      <div className="ground-container">
        {!location.includes(Employee.Response) && (
          <Switch>
            <Route
              path={path + Employee.CreateComplaint}
              component={() => <BreadCrumb crumbs={[breadcrumConfig.home, breadcrumConfig.createComplaint]}></BreadCrumb>}
            />
            <Route
              path={match.url + Employee.ComplaintDetails + ":id"}
              component={() => <BreadCrumb crumbs={[breadcrumConfig.home, breadcrumConfig.inbox, breadcrumConfig.complaintDetails]}></BreadCrumb>}
            />
            <Route
              path={match.url + Employee.Inbox}
              component={() => <BreadCrumb crumbs={[breadcrumConfig.home, breadcrumConfig.inbox]}></BreadCrumb>}
            />
            <Route
              path={match.url + Employee.Response}
              component={<BreadCrumb crumbs={[breadcrumConfig.home, breadcrumConfig.response]}></BreadCrumb>}
            />
          </Switch>
        )}
        <Switch>
          <PrivateRoute path={`${path}/sample`} component={() => <div>Sample Screen loaded</div>} />
          <PrivateRoute path={`${path}/create-complaint`} component={() => <CreateComplaint parentUrl={`${path}/create-complaint`}/>} />
          <PrivateRoute path={`${path}/inbox`} component={() => <Inbox parentUrl={`${path}/inbox`}/>} />
          <PrivateRoute path={`${path}${Employee.ComplaintDetails}`} component={() => <ComplaintDetails parentUrl={`${path}/${Employee.ComplaintDetails}id*`}/>} />
          {/* <Route path={match.url + Employee.CreateComplaint} component={() => <CreateComplaint parentUrl={match.url} />} />
          <Route path={match.url + Employee.ComplaintDetails + ":id*"} component={() => <ComplaintDetails />} />
          <Route path={match.url + Employee.Inbox} component={Inbox} />
          <Route path={match.url + Employee.Response} component={Response} /> */}
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
