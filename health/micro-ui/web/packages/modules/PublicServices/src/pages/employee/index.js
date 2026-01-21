import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import DigitDemoComponent from "./DigitDemo/digitDemoComponent";
import DigitDemoSearch from "./DigitDemo/DigitDemoSearch";
import Response from "./Response";
import DigitDemoViewComponent from "./DigitDemo/digitDemoViewComponent";
import ModulePageComponent from "./DigitDemo/modulePageComponent";
import InboxService from "./DigitDemo/InboxService";
import ViewCheckListCards from "./CheckList/viewCheckListCards";
import CreateCheckList from "./CheckList/createCheckList";
import ViewApplication from "./CheckList/viewApplication";
import DigitDemoEditComponent from "./DigitDemo/digitDemoEditComponent";
import { useLocation } from "react-router-dom";

const SampleBreadCrumbs = ({ location }) => {
  const { t } = useTranslation();
  const queryStrings = Digit.Hooks.useQueryParams();
  const loc = useLocation();
  // Extract module and service from the pathname
  const pathParts = location.pathname.split('/').filter(Boolean);
  const publicServicesIndex = pathParts.findIndex(part => part === 'publicservices');
  const moduleFromPath = publicServicesIndex !== -1 ? pathParts[publicServicesIndex + 1] : undefined;
  const serviceFromPath = publicServicesIndex !== -1 ? pathParts[publicServicesIndex + 2] : undefined;

  // Prefer query params over path extraction
  const module = queryStrings?.module || moduleFromPath;
  const service = queryStrings?.service || serviceFromPath;

  // Check if we're in a specific module/service context
  const isModuleContext = queryStrings?.selectedModule === 'true' && module && service;

  // Check if user came from search or inbox (for ViewScreen breadcrumbs)
  const cameFromSearch = queryStrings?.from === 'search' || window.location.href.toLowerCase().includes("search");
  const cameFromInbox = queryStrings?.from === 'inbox' || window.location.href.toLowerCase().includes("inbox");
  const cameFromDashboard = queryStrings?.from === 'AppDashboard' || window.location.href.toLowerCase().includes("AppDashboard");
  const cameFromViewScreen = queryStrings?.from === 'viewScreen';


  const allCrumbs = [
    {
      internalLink: `/${window?.contextPath}/employee`,
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
        ? `/${window?.contextPath}/employee/publicservices/modules?selectedPath=Apply&module=${module}&service=${service}`
        : `/${window?.contextPath}/employee/publicservices/modules?selectedPath=Apply`,
      content: t("ALL_APPLICATION"),
      show: true,
    },
    {
      externalLink: isModuleContext
        ? `/${window?.contextPath}/employee/publicservices/${module}/search?selectedModule=true&module=${module}&service=${service}`
        : `/${window?.contextPath}/employee/publicservices/${module}/search`,
      content: t("STUDIO_SEARCH"),
      show: cameFromSearch,
    },
    {
      externalLink: isModuleContext
        ? `/${window?.contextPath}/employee/publicservices/${module}/inbox?selectedModule=true&module=${module}&service=${service}`
        : `/${window?.contextPath}/employee/publicservices/${module}/inbox`,
      content: t("STUDIO_INBOX"),
      show: cameFromInbox,
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
      externalLink: queryStrings?.applicationNumber ? `/${window?.contextPath}/employee/publicservices/${module}/${service}/ViewScreen?applicationNumber=${queryStrings?.applicationNumber}&serviceCode=${queryStrings?.serviceCode}&selectedModule=true&from=edit` : `/${window?.contextPath}/employee${loc.state?.redirectionUrl?.split(/\/employee|\/citizen/)[1]}`,
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


const App = ({ path, stateCode, userType, tenants }) => {
  const location = window.location;

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <SampleBreadCrumbs location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/:module/:service/Apply`} component={() => <DigitDemoComponent />} />
        <PrivateRoute path={`${path}/:module/:service/response`} component={() => <Response />} />
        <PrivateRoute path={`${path}/:module/search`} component={() => <DigitDemoSearch />} />
        <PrivateRoute path={`${path}/:module/:service/ViewScreen`} component={() => <DigitDemoViewComponent />} />
        <PrivateRoute path={`${path}/modules`} component={() => <ModulePageComponent />} />
        <PrivateRoute path={`${path}/:module/inbox`} component={() => <InboxService />} />
        <PrivateRoute path={`${path}/viewapp`} component={() => <ViewCheckListCards />} />
        <PrivateRoute path={`${path}/checklist`} component={() => <CreateCheckList />} />
        <PrivateRoute path={`${path}/viewresponse`} component={() => <ViewApplication />} />
        <PrivateRoute path={`${path}/:module/:service/Edit`} component={() => <DigitDemoEditComponent />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
