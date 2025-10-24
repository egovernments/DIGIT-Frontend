import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Switch, Route } from "react-router-dom";

const App = ({ path }) => {
  return (
    <Switch>
      <AppContainer className="ground-container">
        <PrivateRoute path={`${path}`} component={() => <div>HRMS Module</div>} />
      </AppContainer>
    </Switch>
  );
};

export default App;
