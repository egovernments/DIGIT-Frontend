import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Container from "./components/container";
import {Header} from "@egovernments/digit-ui-react-components";

export const Card = (props) => (
  <Container
    style={{
      width: "auto",
      backgroundColor: "#fff",
      color: "#000",
      padding: "8px 12px",
    }}
  >
    {props.children}
  </Container>
);

const App = ({ login }) => {
  return (
    <Container style={{ maxWidth: "600px", margin: "80px auto 0 auto" }}>
      <Card>
        <Container type="h1" style={{ textAlign: "center", margin: "24px 0" }}>
        <Header>Test COmponents</Header>
          Auth microfrontend (2 routes)
        </Container>
        <Switch>
          <Route path="/auth/login">
            <Login login={login} />
          </Route>
          <Route path="/auth/register">
            <Register />
          </Route>
        </Switch>
      </Card>
    </Container>
  );
};

export default App;
