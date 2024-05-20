import React from 'react';
import { initPGRComponents } from './Module';
import { QueryClientProvider } from 'react-query';
import EmployeeApp from './EmployeeApp';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';

const App = ({ queryClient, title,userType }) => {
  initPGRComponents();
  //make way to do this job in container while registering remotes

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmployeeApp path={`/${window.contextPath ? window.contextPath : "core-digit-ui"}/${userType}/pgr`} userType={userType} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
