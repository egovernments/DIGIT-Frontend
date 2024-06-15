import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch } from "react-router-dom";
//import sample from sample
import Inbox from "./SampleInbox";
import SearchWageSeeker from "./SampleSearch";
import AdvancedCreate from "./SampleAdvancedSearch";
import Response from "./Response";
// import IndividualCreate from "./IndividualCreate";
import ProgramCreate from "./ProgramCreate";
import ProjectCreate from "./ProjectCreate";
import OrganizationCreate from "./OrganizationCreate";
import IndividualSearch from "./IndividualSearch";
import ViewIndividual from "../../configs/ViewIndividual";
import Create from "./SampleCreate";
import ProgramInbox from "./ProgramSearch";
import ViewOrganization from "./OrganizationView";
import EstimateCreate from "./EstimateCreate";
import SanctionCreate from "./SanctionCreate";
import AllocationCreate from "./AllocationCreate";
import DisburseCreate from "./DisburseCreate";
import ProjectInbox from "./ProjectSearch";
import OrganizationInbox from "./OrganizationSearch";
import EstimateInbox from "./EstimateSearch";
import AllocationInbox from "./AllocationSearch";
import DisburseInbox from "./DisburseSearch";
import SanctionInbox from "./SanctionSearch";
// import Response from "./Response";
import AgencyCreate from "./AgencyCreate";
import OrganizationUpdate from "./OrganizationUpdate";


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
  const commonProps = { stateCode, userType, tenants, path };
  


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
        <PrivateRoute path={`${path}/create-program`} component={() => <ProgramCreate />} />
        <PrivateRoute path={`${path}/create-agency`} component={() => <AgencyCreate />} />
        <PrivateRoute path={`${path}/create-project`} component={() => <ProjectCreate />} />
        <PrivateRoute path={`${path}/create-organization`} component={() => <OrganizationCreate />} />
        <PrivateRoute path={`${path}/create-estimate`} component={() => <EstimateCreate />} />
        <PrivateRoute path={`${path}/create-sanction`} component={() => <SanctionCreate />} />
        <PrivateRoute path={`${path}/create-allocation`} component={() => <AllocationCreate />} />
        <PrivateRoute path={`${path}/create-disburse`} component={() => <DisburseCreate />} />
        <PrivateRoute path={`${path}/program-search`} component={() => <ProgramInbox />} />
        <PrivateRoute path={`${path}/project-search`} component={() => <ProjectInbox />} />
        <PrivateRoute path={`${path}/organization-search`} component={() => <OrganizationInbox />} />
        <PrivateRoute path={`${path}/estimate-search`} component={() => <EstimateInbox />} />
        <PrivateRoute path={`${path}/allocation-search`} component={() => <AllocationInbox />} />
        <PrivateRoute path={`${path}/disburse-search`} component={() => <DisburseInbox />} />
        <PrivateRoute path={`${path}/sanction-search`} component={() => <SanctionInbox />} />
        <PrivateRoute path={`${path}/search-individual`} component={() => <IndividualSearch></IndividualSearch>} />
        <PrivateRoute path={`${path}/individual-details`} component={() => <ViewIndividual />} />
        <PrivateRoute path={`${path}/organization-view`} component={() => <ViewOrganization />} />
        <PrivateRoute path={`${path}/update-organization`} component={() => <OrganizationUpdate />} />
        
      </AppContainer>
    </Switch>
  );
};

export default App;
