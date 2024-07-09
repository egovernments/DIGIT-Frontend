import React from 'react';
import { initWorkbenchComponents } from './Module';
import { QueryClientProvider } from 'react-query';
import EmployeeApp from './pages/employee';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { Loader } from '@digit-ui/digit-ui-react-components';
// import './engagement.css';
// import './styles.tw.css';

import './workbench.css';
import './styles.tw.css';
const App = ({ queryClient }) => {
  initWorkbenchComponents();
  //make way to do this job in container while registering remotes

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmployeeApp path={`/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/workbench/`}/>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
