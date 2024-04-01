import React from "react";
import { QueryClientProvider } from "react-query";
import { Switch, useLocation, BrowserRouter as Router } from "react-router-dom";
import { initTQMComponents } from "./Module";
import EmployeeApp from "./pages/employee";

const App = ({ queryClient, title }) => {
  initTQMComponents();
  //make way to do this job in container while registering remotes
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <EmployeeApp path={`/${window.contextPath}/employee/tqm`} />
      </QueryClientProvider>
    </Router>
  );
};

export default App;
