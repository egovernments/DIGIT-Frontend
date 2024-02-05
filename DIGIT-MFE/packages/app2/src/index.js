import React from "react";
import ReactDOM from "react-dom";
import { QueryClient } from "react-query";
import App from "./ModuleWrapper";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { BrowserRouter as Router } from "react-router-dom";
import Dummy from "./Dummy";
initLibraries();
const c = new QueryClient();
const stateCode = "pg";
const userType = "employee";
const tenants = "";

ReactDOM.render(
  <Router>
    <App
      stateCode={stateCode}
      userType={userType}
      tenants={tenants}
      queryClient={c}
    />
    ,
  </Router>,
  document.getElementById("app")
);
