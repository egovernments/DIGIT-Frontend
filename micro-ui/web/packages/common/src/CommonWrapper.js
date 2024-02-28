import React from 'react';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { PaymentModule } from './payments';
const App = ({ queryClient, title,userType }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <PaymentModule path={`/workbench-ui/${userType}/common`} stateCode={"pg"} cityCode={"citya"} moduleCode={"Payment"} userType={userType}  />
      </Router>
       {/* <div>Common module running thru host {title}</div> */}
    </QueryClientProvider>
  );
};

export default App;
