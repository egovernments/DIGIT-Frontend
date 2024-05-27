import React from 'react';
import { QueryClientProvider } from 'react-query';
import { Switch, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { initEngagementComponents,EngagementModule } from './Module';

const App = ({ queryClient, title,userType }) => {
  initEngagementComponents();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <EngagementModule path={`/${window.contextPath ? window.contextPath : "core-digit-ui"}/${userType}/engagement`} userType={userType} stateCode={"pg"} tenants={[
  { code: "pg.citya", name: "City A" },
  { code: "pg.cityb", name: "City B" },
  { code: "pg.cityc", name: "City C" }
]}
 />
      </Router>
    </QueryClientProvider>
  );
};

export default App;