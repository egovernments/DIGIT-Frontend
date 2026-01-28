import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation } from "react-router-dom";
import DigitDemoComponent from "../employee/DigitDemo/digitDemoComponent";
import Response from "../employee/Response";
import DigitDemoViewComponent from "../employee/DigitDemo/digitDemoViewComponent";
import ViewCheckListCards from "../employee/CheckList/viewCheckListCards";
import CreateCheckList from "../employee/CheckList/createCheckList";
import ViewApplication from "../employee/CheckList/viewApplication";
import DigitDemoEditComponent from "../employee/DigitDemo/digitDemoEditComponent";
import CitizenInbox from "./CitizenInbox";

const SampleBreadCrumbs = ({ location }) => {
  const { t } = useTranslation();
  const queryStrings = Digit.Hooks.useQueryParams();
  const loc = useLocation();

  // Extract module and modulecode from the pathname
  const pathParts = location.pathname.split('/').filter(Boolean);
  const publicServicesIndex = pathParts.findIndex(part => part === 'publicservices');
  const moduleFromPath = publicServicesIndex !== -1 ? pathParts[publicServicesIndex + 1] : undefined;
  const modulecodeFromPath = publicServicesIndex !== -1 ? pathParts[publicServicesIndex + 2] : undefined;

  // Prefer query params over path extraction
  const module = queryStrings?.module || moduleFromPath;
  const modulecode = queryStrings?.serviceCode || modulecodeFromPath;
  const service = queryStrings?.service;

  // Check if we're in a specific module/service context
  const isModuleContext = module && modulecode;

  // Check if user came from search or inbox (for ViewScreen breadcrumbs)
  const cameFromDashboard = queryStrings?.from === 'AppDashboard' || window.location.href.toLowerCase().includes("AppDashboard");
  const cameFromViewScreen = queryStrings?.from === 'viewScreen';

  const allCrumbs = [
    {
      externalLink: `/${window?.contextPath}/citizen/all-services`,
      content: t("HOME"),
      show: true,
    },
    {
      externalLink: `/${window?.contextPath}/employee/servicedesigner/LandingPage`,
      content: t("SERVICE_DESIGNER"),
      show: cameFromDashboard,
    },
    {
      externalLink: isModuleContext
        ? `/${window?.contextPath}/citizen/publicservices/${module}/${modulecode}/my-application?serviceCode=${modulecode}`
        : `/${window?.contextPath}/citizen/all-services`,
      content: t("MY_APPLICATIONS"),
      show: true,
    },
    {
      content: t("STUDIO_APPLY"),
      show: window.location.href.toLowerCase().includes("/apply"),
    },
    {
      content: t("STUDIO_RESPONSE"),
      show: window.location.href.toLowerCase().includes("/response"),
    },
    {
      content: t("STUDIO_VIEW"),
      show: window.location.href.toLowerCase().includes("/viewscreen"),
    },
    {
      externalLink: queryStrings?.applicationNumber
        ? `/${window?.contextPath}/citizen/publicservices/${module}/${service}/ViewScreen?applicationNumber=${queryStrings?.applicationNumber}&serviceCode=${modulecode || queryStrings?.serviceCode}&from=edit`
        : `/${window?.contextPath}/citizen${loc.state?.redirectionUrl?.split(/\/citizen/)[1]}`,
      content: t("STUDIO_VIEW"),
      show: cameFromViewScreen && window.location.href.toLowerCase().includes("/edit") || window.location.href.toLowerCase().includes("/checklist?") || window.location.href.toLowerCase().includes("/viewresponse?"),
    },
    {
      content: t("STUDIO_EDIT"),
      show: window.location.href.toLowerCase().includes("/edit"),
    },
    {
      content: t("STUDIO_CHECKLIST"),
      show: window.location.href.toLowerCase().includes("/checklist?"),
    },
    {
      content: t("STUDIO_CHECKLIST_VIEW"),
      show: window.location.href.toLowerCase().includes("/viewresponse?"),
    }
  ];

  // Filter out breadcrumbs with show: false to fix index issues in BreadCrumb component
  const crumbs = allCrumbs.filter(crumb => crumb.show);

  return <BreadCrumb crumbs={crumbs} />;
};


const App = ({ stateCode, userType, tenants }) => {
  const location = useLocation();

  return (
    <AppContainer className="ground-container" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
      <React.Fragment>
        <SampleBreadCrumbs location={location} />
      </React.Fragment>
      <Routes>
        <Route path=":module/:service/Apply" element={<PrivateRoute><DigitDemoComponent /></PrivateRoute>} />
        <Route path=":module/:service/response" element={<PrivateRoute><Response /></PrivateRoute>} />
        <Route path=":module/:service/ViewScreen" element={<PrivateRoute><DigitDemoViewComponent /></PrivateRoute>} />
        <Route path="viewapp" element={<PrivateRoute><ViewCheckListCards /></PrivateRoute>} />
        <Route path="checklist" element={<PrivateRoute><CreateCheckList /></PrivateRoute>} />
        <Route path="viewresponse" element={<PrivateRoute><ViewApplication /></PrivateRoute>} />
        <Route path=":module/:modulecode/my-application" element={<PrivateRoute><CitizenInbox /></PrivateRoute>} />
        <Route path=":module/:service/Edit" element={<PrivateRoute><DigitDemoEditComponent /></PrivateRoute>} />
      </Routes>
    </AppContainer>
  );
};

export default App;