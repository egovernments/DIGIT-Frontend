import React from "react";
import { QueryClientProvider } from "react-query";
import { Switch, useLocation, BrowserRouter as Router } from "react-router-dom";
import { initDSSComponents } from "./Module";
import { DSSModule } from "./Module";

const App = ({ queryClient, title,userType }) => {
  initDSSComponents();
  //make way to do this job in container while registering remotes

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DSSModule path={`/${window.contextPath}/${userType}/dss/`} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
