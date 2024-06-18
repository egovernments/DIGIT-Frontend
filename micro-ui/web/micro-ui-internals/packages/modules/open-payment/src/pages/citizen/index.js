import React, { useEffect } from "react";
import { Switch, useLocation,Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer, BreadCrumb,BackButton } from "@egovernments/digit-ui-react-components";
import OpenSearch from "../../components/OpenSearch";
import OpenView from "../../components/OpenView";
import { SuccessfulPayment,FailedPayment } from "../../components/Response";


const CitizenApp = ({ path }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const commonProps = { stateCode:"pb", cityCode:"pb.abianakhurd", moduleCode:"WS" };
  return (
    <React.Fragment>
      <div className="engagement-citizen-wrapper">
      {!location.pathname.includes("response") && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
      <Switch>
          <PrivateRoute path={`${path}/sample`} component={() => <div> In Open Payment Module</div> } />
          <Route path={`${path}/open-search`} render={()=><OpenSearch />} />
          <Route path={`${path}/open-view`} render={()=><OpenView />} />
          <Route path={`${path}/success/:businessService/:consumerCode/:tenantId`}>
            <SuccessfulPayment {...commonProps} />
          </Route>
          <Route path={`${path}/failure`}>
            <FailedPayment {...commonProps} />
          </Route>
      </Switch>
      </div>
    </React.Fragment>
  );
};

export default CitizenApp;
