import React from 'react';
import { initWorkbenchComponents } from './Module';
import { QueryClientProvider } from 'react-query';
import EmployeeApp from './pages/employee';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { Loader } from '@egovernments/digit-ui-react-components';

const App = ({ queryClient, title,t,i18n }) => {
  initWorkbenchComponents();
  //make way to do this job in container while registering remotes

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmployeeApp path={'/workbench-ui/employee/workbench/'} t={t} i18n={i18n} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
