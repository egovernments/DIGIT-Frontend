import React from 'react';

// Import the main DigitUI from core-new
import { DigitUI } from '@egovernments/digit-ui-module-core-new';

// Simple App component that just initializes DigitUI
const App = () => {
  const stateCode = window?.globalConfigs?.getConfig?.('STATE_LEVEL_TENANT_ID') || 'mz';
  const enabledModules = ["assignment", "HRMS", "Workbench", "Utilities", "Campaign"];

  return (
    <DigitUI 
      stateCode={stateCode} 
      enabledModules={enabledModules}   
      allowedUserTypes={["employee", "citizen"]} 
      defaultLanding="employee" 
    />
  );
};

export default App;