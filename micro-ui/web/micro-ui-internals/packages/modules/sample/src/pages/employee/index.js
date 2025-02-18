import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import Inbox from "./SampleInbox";
import SearchWageSeeker from "./SampleSearch";
import AdvancedCreate from "./SampleAdvancedSearch";
import Response from "./Response";
import ViewIndividual from "../../configs/ViewIndividual";
import Create from "./SampleCreate";
import View from "./SampleView";
import SampleComponents from "./SampleComponents";
import PanelCardResponse from "./PanelCardResponse";
import TabIndividualSearch from "./TabIndividualSearch";
import HRMSCreate from "./hrms/HrmsCreate";
import HRMSSearch from "./hrms/HrmsSearch";
import HRMSViewDetails from "./hrms/HrmsView";
import IndividualCreate from "./individual/IndividualCreate";
import IndividualSearch from "./individual/IndividualSearch";
import IndividualViewDetails from "./individual/IndividualView";

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
  return <BreadCrumb crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

const App = ({ path, stateCode, userType, tenants }) => {
  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>

        <PrivateRoute path={`${path}/hrms-create`} component={() => <HRMSCreate></HRMSCreate>} />
        <PrivateRoute path={`${path}/hrms-search`} component={() => <HRMSSearch></HRMSSearch>} />
        <PrivateRoute path={`${path}/hrms-view`} component={() => <HRMSViewDetails></HRMSViewDetails>} />

        <PrivateRoute path={`${path}/individual-create`} component={() => <IndividualCreate></IndividualCreate>} />
        <PrivateRoute path={`${path}/individual-search`} component={() => <IndividualSearch></IndividualSearch>} />
        <PrivateRoute path={`${path}/individual-view`} component={() => <IndividualViewDetails></IndividualViewDetails>} />

        <PrivateRoute path={`${path}/response`} component={() => <Response></Response>} />

        <PrivateRoute path={`${path}/sample-create`} component={() => <Create></Create>} />
        <PrivateRoute path={`${path}/sample-search`} component={() => <SearchWageSeeker></SearchWageSeeker>} />    
        <PrivateRoute path={`${path}/sample-view`} component={() =>  <ViewIndividual />} />
        <PrivateRoute path={`${path}/sample-components`} component={() => <SampleComponents />} />
        <PrivateRoute path={`${path}/sample-success`} component={() => <PanelCardResponse />} />
        <PrivateRoute path={`${path}/tab-search-individual`} component={() => <TabIndividualSearch />} />
        <PrivateRoute path={`${path}/advanced`} component={() => <AdvancedCreate></AdvancedCreate>} />
        <PrivateRoute path={`${path}/inbox`} component={() => <Inbox></Inbox>} />
        <PrivateRoute path={`${path}/view`} component={() => <View />} />

      </AppContainer>
    </Switch>
  );
};

export default App;
