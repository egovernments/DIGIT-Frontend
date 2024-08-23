import { AppContainer, BreadCrumb } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch } from "react-router-dom";
import DynamicSearchComponent from "./DynamicSearchComponent";
import WorkflowCompTest from "./WorkflowComponentTest";
import DocViewer from "./DocViewer.js";
import NonIFrameInterface from "./IFrameInterface/RenderCustom";
import AuditHistory from "./AuditHistory.js";
import KibanaChart from "./KibanaChart.js";

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
        <Route path={`${path}/search/:moduleName/:masterName`} component={() => <DynamicSearchComponent parentRoute={path} />} />
        <Route path={`${path}/create/:moduleName/:masterName`} component={() => <DynamicCreateComponent parentRoute={path} />} />
        <Route path={`${path}/iframe/:moduleName/:pageName`}>
          <KibanaChart {...commonProps} />
        </Route>
        <Route path={`${path}/non-iframe/:moduleName/:pageName`}>
          <NonIFrameInterface {...commonProps} />
        </Route>
        <Route path={`${path}/doc-viewer`}>
          <DocViewer {...commonProps} />
        </Route>
        <Route path={`${path}/audit-log`}>
          <AuditHistory {...commonProps} />
        </Route>
        <Route path={`${path}/workflow`} component={() => <WorkflowCompTest parentRoute={path} />} />
      </AppContainer>
    </Switch>
  );
};

export default App;