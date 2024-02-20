import React from 'react';
import { QueryClientProvider } from 'react-query';
import EmployeeApp from './payments/employee/index'
import { BrowserRouter as Router } from 'react-router-dom';

const App = ({ queryClient, title }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmployeeApp path={'/workbench-ui/employee/common'} stateCode={"pg"} cityCode={"citya"} moduleCode={"Payment"}  />
      </Router>
       {/* <div>Common module running thru host {title}</div> */}
    </QueryClientProvider>
  );
};

export default App;
