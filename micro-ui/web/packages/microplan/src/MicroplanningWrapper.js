import React from 'react';
import { QueryClientProvider } from 'react-query';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { initMicroplanningComponents } from './Module';
import EmployeeApp from './pages/employee/index';
import { ProviderContext } from './utils/context';
import { TourProvider } from "@digit-ui/digit-ui-react-components";

const App = ({ queryClient, userType, title }) => {
  initMicroplanningComponents();
  console.log("qc in microplan",queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ProviderContext>
          <TourProvider>
            <EmployeeApp
              path={`/${
                window.contextPath ? window.contextPath : 'core-digit-ui'
              }/employee/microplan`}
            />
          </TourProvider>
        </ProviderContext>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
