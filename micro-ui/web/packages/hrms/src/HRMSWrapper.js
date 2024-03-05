import React from 'react';
import { QueryClientProvider } from 'react-query';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { initHRMSComponents } from './Module';
import EmployeeApp from './pages';

const App = ({ queryClient, title }) => {

    console.log("qc in remote hrms",queryClient);

initHRMSComponents();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmployeeApp path={'/workbench-ui/employee/hrms/'} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;