import React, { useEffect } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer, BreadCrumb,Route } from "@egovernments/digit-ui-react-components";


const OpenPaymentBreadCrumb = ({ location, defaultPath }) => {
  const { t } = useTranslation();
  const search = useLocation().search;
  const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];

  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    ];

  return <BreadCrumb className="campaign-breadcrumb" crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

const App = ({ path }) => {
  debugger
  const location = useLocation();

  return (
    <React.Fragment>
      <div className="wbh-header-container">
          <OpenPaymentBreadCrumb location={location} defaultPath={path} />
      </div>
      <Switch>
        <AppContainer className="campaign">
          <PrivateRoute path={`${path}/sample`} component={() => <div> In Open Payment Module</div> } />
        </AppContainer>
      </Switch>
    </React.Fragment>
  );
};

export default App;
