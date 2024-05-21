import React from "react";
import { AppContainer, EmployeeAppContainer } from "@egovernments/digit-ui-react-components";
import Complaint from "./pages/employee/index";
import { Provider } from "react-redux";
import getStore from "./redux/store";
import { PGRReducers } from "./Module";

const App = ({ path }) => {
  const { isLoading, data: initData } = Digit.Hooks.useInitStore("pg", ["PT", "HRMS", "Workbench", "DSS", "Measurement", "PGR"]);
  const moduleReducers = (initData) => ({
    pgr: PGRReducers(initData),
  });

  return (
    <Provider store={getStore(initData, moduleReducers(initData))}>
      <EmployeeAppContainer>
        <Complaint path={path} />
      </EmployeeAppContainer>
    </Provider>
  );
};

export default App;
