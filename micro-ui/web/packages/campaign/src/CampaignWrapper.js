import React from 'react';
import { QueryClientProvider } from 'react-query';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { initCampaignComponents } from './Module';
//import EmployeeApp from './pages/employee/index';
import EmployeeApp from './pages/employee/index';
const App = ({ queryClient }) => {
    initCampaignComponents();
    console.log("Context Path:", window.contextPath);


    return (
        <QueryClientProvider client={queryClient}>
          <Router>
            <EmployeeApp path={`/${
                window.contextPath ? window.contextPath : 'core-digit-ui'
              }/employee/campaign`}
            />
          </Router>
        </QueryClientProvider>
      );
    };

export default App;