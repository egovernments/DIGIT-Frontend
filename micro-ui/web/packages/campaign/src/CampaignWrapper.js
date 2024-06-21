import React from 'react';
import { QueryClientProvider } from 'react-query';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { initCampaignComponents, CampaignModule } from './Module';

const App = ({ queryClient,userType }) => {
    initCampaignComponents();

    return (
        <QueryClientProvider client={queryClient}>
          <Router>
            <CampaignModule path={`/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/campaign`} userType={userType} stateCode={"mz"} />
          </Router>
        </QueryClientProvider>
      );
    };

export default App;