import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import HearingsResponse from "./HearingsResponse";
import HearingsCreate from "./HearingsCreate";
import HearingsSearch from "./HearingsSearch";
import InsideHearingMainPage from "./InsideHearingMainPage";
import GenerateOrders from "./GenerateOrders";
import MakeSubmission from "./MakeSubmission";
import AddParty from "./AddParty";
import AdjournHearing from "./AdjournHearing";
import EndHearing from "./EndHearing";
import Orders from "./Orders";
import Submission from "./Submission";
import CaseHistory from "./CaseHistory";
import Parties from "./Parties";
import HomeViewHearing from "./HomeViewHearing";
import ViewHearing from "./ViewHearing";
import RescheduleHearing from "./ReSchedulHearing";
import ViewTranscript from "./ViewTranscript";
import ViewWitnessDeposition from "./ViewWitnessDeposition";
import ViewPendingTask from "./ViewPendingTask";
import HearingPopup from "./HearingPopUp";
import InsideHearing from "./InsideHearing";
import ViewCase from "./ViewCase";
const bredCrumbStyle={ maxWidth: "min-content" };
const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      path: `/${window?.contextPath}/employee`,
      content: t(location.pathname.split("/").pop()),
      show: true,
    },
  ];
  return <BreadCrumb crumbs={crumbs} spanStyle={bredCrumbStyle} />;
};

const App = ({ path, stateCode, userType, tenants }) => {
  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/hearings-response`} component={() => <HearingsResponse></HearingsResponse>} />
        <PrivateRoute path={`${path}/hearings-create`} component={() => <HearingsCreate />} />
        <PrivateRoute path={`${path}/hearings-search`} component={() => <HearingsSearch></HearingsSearch>} />
        <PrivateRoute path={`${path}/inside-hearing`} component={() => <InsideHearingMainPage />} />
        <PrivateRoute path={`${path}/generate-orders`} component={() => <GenerateOrders />} />
        <PrivateRoute path={`${path}/make-submission`} component={() => <MakeSubmission />} />
        <PrivateRoute path={`${path}/end-hearing`} component={() => <EndHearing />} />
        <PrivateRoute path={`${path}/add-party`} component={() => <AddParty />} />
        <PrivateRoute path={`${path}/adjourn-hearing`} component={() => <AdjournHearing />} />
        <PrivateRoute path={`${path}/orders`} component={() => <Orders />} />
        <PrivateRoute path={`${path}/parties`} component={() => <Parties />} />
        <PrivateRoute path={`${path}/case-history`} component={() => <CaseHistory />} />
        <PrivateRoute path={`${path}/home`} component={() => <HomeViewHearing></HomeViewHearing>} />
        <PrivateRoute path={`${path}/view-hearing`} component={() => <ViewHearing></ViewHearing>} />
        <PrivateRoute path={`${path}/hearing-popup`} component={() => <HearingPopup></HearingPopup>} />
        <PrivateRoute path={`${path}/inside-hearings`} component={() => <InsideHearing></InsideHearing>} />
        <PrivateRoute path={`${path}/view-case`} component={() => <ViewCase></ViewCase>} />
        <PrivateRoute path={`${path}/reschedule-hearing`} component={() => <RescheduleHearing></RescheduleHearing>} />
        <PrivateRoute path={`${path}/view-transcript`} component={() => <ViewTranscript></ViewTranscript>} />
        <PrivateRoute path={`${path}/view-witness-deposition`} component={() => <ViewWitnessDeposition></ViewWitnessDeposition>} />
        <PrivateRoute path={`${path}/view-pending-task`} component={() => <ViewPendingTask></ViewPendingTask>} />
        <PrivateRoute path={`${path}/submission`} component={() => <Submission></Submission>} />
      </AppContainer>
    </Switch>
  );
};

export default App;
