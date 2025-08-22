import React, {Suspense} from "react";
import {initGlobalConfigs} from "./globalConfig"; // adjust if needed
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { Loader } from "@egovernments/digit-ui-components";

const App = () => {
  initGlobalConfigs();

  return <DigitAppWrapper />;
};

const DigitAppWrapper = () => {
  const [DigitUIComponent, setDigitUIComponent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadApp = async () => {
      try {
        await initLibraries();

        // Phase 1: Initialize critical components immediately
        const coreModule = await import("@egovernments/digit-ui-module-core");
        if (coreModule.initCriticalComponents) {
          coreModule.initCriticalComponents();
          console.log("✅ Critical components ready for immediate use");
        }

        // Phase 2: Initialize remaining components when needed
        if (coreModule.initCoreComponents) {
          coreModule.initCoreComponents();
          console.log("✅ All core components registered");
        }

        // Phase 1: Initialize critical campaign components
        const campaignModule = await import("@egovernments/digit-ui-module-campaign-manager");
        if (campaignModule.initCriticalCampaignComponents) {
          campaignModule.initCriticalCampaignComponents();
          console.log("✅ Critical campaign components ready");
        }

        // Phase 2: Initialize remaining campaign components
        if (campaignModule.initNonCriticalCampaignComponents) {
          campaignModule.initNonCriticalCampaignComponents();
          console.log("✅ All campaign components registered");
        }

        const DigitUI = coreModule?.DigitUI || coreModule?.default;
        setDigitUIComponent(() => DigitUI);
        setLoading(false);
      } catch (error) {
        console.error("❌ Component initialization failed:", error);
        setLoading(false); // Continue with partial functionality
      }
    };

    loadApp();
  }, []);

  if (loading || !DigitUIComponent) {
    return <div><Loader page={true} variant={"PageLoader"} /></div>;
  }

  return (
    <DigitUIComponent
      stateCode="mz"
      enabledModules={[]}
      defaultLanding="employee"
      moduleReducers={{}}
    />
  );
};

export default App;