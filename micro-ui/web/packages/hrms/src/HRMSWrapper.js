import React from 'react';
import { QueryClientProvider } from 'react-query';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { initHRMSComponents } from './Module';
import EmployeeApp from './pages';

const App = ({ queryClient, title,t,i18n }) => {
  initHRMSComponents();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmployeeApp path={`/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/hrms/`} t={t} i18n={i18n}/>
      </Router>
    </QueryClientProvider>
  );
};

export default App;