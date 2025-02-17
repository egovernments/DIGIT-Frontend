import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import Inbox from "./SampleInbox";
import SearchWageSeeker from "./SampleSearch";
import AdvancedCreate from "./SampleAdvancedSearch";
import Response from "./Response";
import IndividualCreate from "./IndividualCreate";
import IndividualSearch from "./IndividualSearch";
import ViewIndividual from "../../configs/ViewIndividual";
import Create from "./SampleCreate";
import View from "./SampleView";
import SampleComponents from "./SampleComponents";
import PanelCardResponse from "./PanelCardResponse";
import TabIndividualSearch from "./TabIndividualSearch";
import IndividualViewDetails from "./IndividualViewDetails";
import EmployeeViewDetails from "./EmployeeViewDetails";

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
        <PrivateRoute path={`${path}/sample-create`} component={() => <Create></Create>} />
        <PrivateRoute path={`${path}/advanced`} component={() => <AdvancedCreate></AdvancedCreate>} />
        <PrivateRoute path={`${path}/inbox`} component={() => <Inbox></Inbox>} />
        <PrivateRoute path={`${path}/sample-search`} component={() => <SearchWageSeeker></SearchWageSeeker>} />
        <PrivateRoute path={`${path}/response`} component={() => <Response></Response>} />
        <PrivateRoute path={`${path}/create-individual`} component={() => <IndividualCreate />} />
        <PrivateRoute path={`${path}/search-individual`} component={() => <IndividualSearch></IndividualSearch>} />
        <PrivateRoute path={`${path}/individual-details`} component={() => <ViewIndividual />} />
        <PrivateRoute path={`${path}/sample-view`} component={() => <View />} />
        <PrivateRoute path={`${path}/sample-components`} component={() => <SampleComponents />} />
        <PrivateRoute path={`${path}/sample-success`} component={() => <PanelCardResponse />} />
        <PrivateRoute path={`${path}/tab-search-individual`} component={() => <TabIndividualSearch />} />
        {/* <PrivateRoute path={`${path}/individual-details-view`} component={() => <IndividualViewDetails />} /> */}
        <PrivateRoute path={`${path}/individual-details-view`} component={() => <EmployeeViewDetails />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
