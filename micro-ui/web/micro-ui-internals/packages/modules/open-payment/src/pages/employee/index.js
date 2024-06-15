import React, { useEffect } from "react";
import { Switch, useLocation,Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer, BreadCrumb } from "@egovernments/digit-ui-react-components";
import OpenSearch from "../../components/OpenSearch";
import OpenView from "../../components/OpenView";
import { SuccessfulPayment,FailedPayment } from "../../components/Response";

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
    {
      path: `/${window?.contextPath}/employee/hrms/`,
      content: t("OP_PAY_BILL"),
      show: true,
    },
    // {
    //   path: `/${window?.contextPath}/employee/open-view`,
    //   content: t("OP_PAY_BILL"),
    //   show: true,
    // },
    ];

  return <BreadCrumb className="campaign-breadcrumb" crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

const CitizenApp = ({ path }) => {
  const location = useLocation();
  const commonProps = { stateCode:"pb", cityCode:"pb.abianakhurd", moduleCode:"WS" };
  return (
    <React.Fragment>
      <div className="wbh-header-container">
          <OpenPaymentBreadCrumb location={location} defaultPath={path} />
      </div>
      <Switch>
        <AppContainer className="campaign">
          <PrivateRoute path={`${path}/sample`} component={() => <div> In Open Payment Module</div> } />
          <Route path={`${path}/open-search`} render={()=><OpenSearch />} />
          <Route path={`${path}/open-view`} render={()=><OpenView />} />
          <Route path={`${currentPath}/success`}>
            <SuccessfulPayment {...commonProps} />
          </Route>
          <Route path={`${currentPath}/failure`}>
            <FailedPayment {...commonProps} />
          </Route>
        </AppContainer>
      </Switch>
    </React.Fragment>
  );
};

export default CitizenApp;
