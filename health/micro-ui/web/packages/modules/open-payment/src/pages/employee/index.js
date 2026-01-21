import React, { useEffect } from "react";
import { Switch, useLocation,Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer, BreadCrumb,BackButton } from "@egovernments/digit-ui-react-components";
import OpenSearch from "../../components/OpenSearch";
import OpenView from "../../components/OpenView";
import { SuccessfulPayment,FailedPayment } from "../../components/Response";
import ResponseEmployee from "../../components/ResponseEmployee";


const EmployeeApp = ({ path }) => {
  const { t } = useTranslation();
  const location = useLocation();
  //const commonProps = { stateCode:"pb", cityCode:"pb.abianakhurd", moduleCode:"WS" };
  return (
    <React.Fragment>
      <style>
        {`.open-payment-employee-wrapper .digit-card-component { max-width: 100%; width: 100%; }`}
      </style>
      <div className="engagement-citizen-wrapper open-payment-employee-wrapper" style={{ width: "100%" }}>
      {!location.pathname.includes("response") && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
      <Switch>
          <Route path={`${path}/open-view`} render={()=><OpenView />} />
          <Route path={`${path}/success/:businessService/:consumerCode/:tenantId`}>
            <ResponseEmployee  />
          </Route>
          <Route path={`${path}/failure`}>
            <ResponseEmployee />
          </Route>
      </Switch>
      </div>
    </React.Fragment>
  );
};

export default EmployeeApp;
