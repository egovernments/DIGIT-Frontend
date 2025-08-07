import React, {Suspense} from "react";
import {initGlobalConfigs} from "./globalConfig"; // adjust if needed
import { initLibraries } from "@egovernments/digit-ui-libraries";

const App = () => {
  initGlobalConfigs();

  return <DigitAppWrapper />;
};

const DigitAppWrapper = () => {
  const [DigitUIComponent, setDigitUIComponent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadApp = async () => {
      await initLibraries();

      const module = await import("@egovernments/digit-ui-module-core");
      const DigitUI = module?.DigitUI || module?.default;

      setDigitUIComponent(() => DigitUI);
      setLoading(false);
    };

    loadApp();
  }, []);

  if (loading || !DigitUIComponent) {
    return <div>Loading App...</div>;
  }

  return (
    <DigitUIComponent
      stateCode="pb"
      enabledModules={[]}
      defaultLanding="employee"
      moduleReducers={{}}
    />
  );
};

export default App;