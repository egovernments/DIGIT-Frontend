import React from 'react';
import { initWorkbenchComponents } from './Module';
import { QueryClientProvider } from 'react-query';
import EmployeeApp from './pages/employee';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';

const App = ({ queryClient, title }) => {
  initWorkbenchComponents();
  //make way to do this job in container while registering remotes

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmployeeApp path={'/digit-ui/employee/workbench/'} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
