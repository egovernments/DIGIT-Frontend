import React from "react";
import { QueryClientProvider } from "react-query";
import { Switch, useLocation, BrowserRouter as Router } from "react-router-dom";
import { initEngagementComponents } from "./Module";
import { EmployeeApp } from "./Module";

const App = ({ queryClient, title }) => {
  initEngagementComponents();
  //make way to do this job in container while registering remotes

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmployeeApp path={"/digit-ui/employee/engagement/"} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
