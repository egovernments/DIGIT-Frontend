import React from 'react';
import { initPGRComponents } from './Module';
import { QueryClientProvider } from 'react-query';
import EmployeeApp from './EmployeeApp';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';

const App = ({ queryClient, title }) => {
  initPGRComponents();
  //make way to do this job in container while registering remotes

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmployeeApp path={'/workbench-ui/employee/pgr/'} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
