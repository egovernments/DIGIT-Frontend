import React from "react";
import { HRMSModule } from "./Module";
import { initHRMSComponents } from "./Module";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import Create from "./pages/CreateInd.js";
import { QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SearchIndividual from "./pages/SearchInd.js";
import globalConfigs from "./components/config/globalConfigs.js";

window.globalConfigs = globalConfigs;



const App = ({ title = "", stateCode, userType, tenants, queryClient }) => {
  initLibraries();
  //init lib
  // initHRMSComponents();
  // console.log("Props:", { stateCode, userType, tenants, queryClient });
  return (
    <Router>
      <div>
        <QueryClientProvider client={queryClient}>
          <h2>{title}</h2>
          {/* <HRMSModule
        stateCode="pg"
        userType="employee"
        tenants={[]}
        queryClient={queryClient}
      /> */}
          <Switch>
            <Route path="/create" component={Create} />
            {/* <Create /> */}
            <Route path="/search" component= {SearchIndividual} />
            <SearchIndividual/>
          </Switch>
        </QueryClientProvider>
      </div>
    </Router>
  );
};

export default App;
