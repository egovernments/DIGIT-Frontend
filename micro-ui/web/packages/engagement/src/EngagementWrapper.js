import React from 'react';
import { QueryClientProvider } from 'react-query';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { initEngagementComponents,EngagementModule } from './Module';

const App = ({ queryClient, title,userType }) => {
  initEngagementComponents();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EngagementModule path={`/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/engagement`} userType={userType} stateCode={"pg"} tenants={["pg.citya","pg.cityb","pg.cityc"]} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;