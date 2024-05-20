import React from "react";
import { AppContainer, EmployeeAppContainer,Loader } from "@digit-ui/digit-ui-react-components";
import Complaint from "./pages/employee/index";
import { Provider } from "react-redux";
import getStore from "./redux/store";
import { PGRReducers } from "./Module";
import { useTranslation } from "react-i18next";
import CitizenApp from "./pages/citizen"
const App = ({ path,userType }) => {
  // const { isLoading, data: initData } = Digit.Hooks.useInitStore("pg", ["PT", "HRMS", "Workbench", "DSS", "Measurement", "PGR"]);
  const {t,i18n} = useTranslation()
  const { isLoading } = Digit.Hooks.core.useLocalization({
    params:{
      tenantId: Digit.ULBService.getStateId(),
      module: 'rainmaker-pgr',
      locale:i18n.language,
    },
    i18n,
  })
  const moduleReducers = (initData) => ({
    pgr: PGRReducers(initData),
  });

  if(isLoading){
    return <Loader />
  }

  if (userType === "citizen") {
    return <CitizenApp path={path} />;
  }

  return (
    <Provider store={getStore(initData, moduleReducers(initData))}>
      <EmployeeAppContainer>
        <Complaint path={path} />
      </EmployeeAppContainer>
    </Provider>
  );
};

export default App;
