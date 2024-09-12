import React from "react";
import { Switch, useLocation, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContainer, BreadCrumb } from "@egovernments/digit-ui-react-components";
import { Route } from "react-router-dom";
import Programs from "./Programs";
import Program from "./Program";
import Enroll from "./Enroll";
import Response from "./Response";

/**
 * The CampaignBreadCrumb function generates breadcrumb navigation for a campaign setup page in a React
 * application.
 * @returns The CampaignBreadCrumb component is returning a BreadCrumb component with the specified
 * crumbs array and spanStyle prop. The crumbs array contains two objects with path, content, and show
 * properties for each breadcrumb item. The spanStyle prop is set to { maxWidth: "min-content" }.
 */
const CampaignBreadCrumb = ({ location, defaultPath }) => {
  const { t } = useTranslation();
  const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];

  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("CAMPAIGN_HOME"),
      show: true,
    },

    {
      path: `/${window?.contextPath}/employee/${pathVar}`,
      content: t(pathVar),
      show: true,
    },
  ];

  return <BreadCrumb className="campaign-breadcrumb" crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

/**
 * The `App` function in JavaScript defines a component that handles different routes and renders
 * corresponding components based on the path provided.
 * @returns The `App` component is returning a JSX structure that includes a `div` with a className of
 * "wbh-header-container" containing a `CampaignBreadCrumb` component and a `Switch` component. Inside
 * the `Switch` component, there are several `PrivateRoute` components with different paths and
 * corresponding components such as `UploadBoundaryData`, `CycleConfiguration`, `DeliveryRule`, `
 */
const App = ({ path }) => {
  const location = useLocation();
  console.log(path, "path");

  return (
    <React.Fragment>
      {/* <CampaignBreadCrumb location={location} defaultPath={path} /> */}

      <Switch>
        <AppContainer className="programs-module">
          <Route path={`${path}/programs`} component={() => <Programs />} />
          <Route path={`${path}/program/:id`} component={() => <Program />} />
          <Route path={`${path}/enroll/:id`} component={() => <Enroll />} />
          <Route path={`${path}/enroll-response`} component={() => <Response />} />

          <Route>
            <Redirect to={`${path}/programs`} />
          </Route>
        </AppContainer>
      </Switch>
    </React.Fragment>
  );
};

export default App;
