import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContainer } from "@egovernments/digit-ui-react-components";
import { BreadCrumb } from "@egovernments/digit-ui-components";

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
import SampleComponentsNew from "./uiComponentsSample/SampleComponentsNew";
import SampleCreate from "./uiComponentsSample/SampleCreate";
import SampleSearch from "./uiComponentsSample/SampleSearch";
import SampleInbox from "./uiComponentsSample/SampleInbox";
import SampleView from "./uiComponentsSample/SampleView";

const SampleBreadCrumbs = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const crumbs = [
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      content: t(location.pathname.split("/").pop()),
      show: true,
    },
  ];

  return <BreadCrumb crumbs={crumbs} />;
};

const App = () => {

  return (
    <AppContainer className="ground-container">
      <SampleBreadCrumbs />
      <Routes>
        <Route path="/hrms-create" element={<HRMSCreate />} />
        <Route path="/hrms-search" element={<HRMSSearch />} />
        <Route path="/hrms-view" element={<HRMSViewDetails />} />

        <Route path="/individual-create" element={<IndividualCreate />} />
        <Route path="/individual-search" element={<IndividualSearch />} />
        <Route path="/individual-view" element={<IndividualViewDetails />} />

        <Route path="/response" element={<Response />} />

        <Route path="/sample-create" element={<Create />} />
        <Route path="/sample-search" element={<SearchWageSeeker />} />
        <Route path="/sample-view" element={<ViewIndividual />} />
        <Route path="/sample-components" element={<SampleComponents />} />
        <Route path="/sample-success" element={<PanelCardResponse />} />
        <Route path="/tab-search-individual" element={<TabIndividualSearch />} />
        <Route path="/advanced" element={<AdvancedCreate />} />
        <Route path="/inbox" element={<Inbox />} />

        <Route path="/demo" element={<div>deweew</div>} />

        <Route path="/components" element={<SampleComponentsNew />} />
        <Route path="/create" element={<SampleCreate />} />
        <Route path="/search" element={<SampleSearch />} />
        <Route path="/sample-inbox" element={<SampleInbox />} />
        <Route path="/view" element={<SampleView />} />
      </Routes>
    </AppContainer>
  );
};

export default App;
