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
  const [loadingStage, setLoadingStage] = React.useState("Initializing...");

  React.useEffect(() => {
    const loadApp = async () => {
      const startTime = performance.now();
      try {
        setLoadingStage("Loading core libraries...");
        await initLibraries();

        setLoadingStage("Initializing critical components...");
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

        setLoadingStage("Loading campaign components...");
        // Phase 1: Initialize critical campaign components
        const campaignModule = await import("@egovernments/digit-ui-module-campaign-manager");
        if (campaignModule.initCriticalCampaignComponents) {
          campaignModule.initCriticalCampaignComponents();
          console.log("✅ Critical campaign components ready");
        }

        setLoadingStage("Finalizing setup...");
        // Phase 2: Initialize remaining campaign components (progressive loading)
        setTimeout(() => {
          if (campaignModule.initNonCriticalCampaignComponents) {
            campaignModule.initNonCriticalCampaignComponents();
            console.log("✅ All campaign components registered");
          }
        }, 100); // Non-blocking initialization

        const DigitUI = coreModule?.DigitUI || coreModule?.default;
        setDigitUIComponent(() => DigitUI);
        
        const loadTime = performance.now() - startTime;
        console.log(`🚀 App initialization completed in ${loadTime.toFixed(2)}ms`);
        setLoading(false);
      } catch (error) {
        console.error("❌ Component initialization failed:", error);
        const errorTime = performance.now() - startTime;
        console.log(`⚠️ App initialization failed after ${errorTime.toFixed(2)}ms`);
        setLoading(false); // Continue with partial functionality
      }
    };

    loadApp();
  }, []);

  if (loading || !DigitUIComponent) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: '16px'
      }}>
        <Loader page={true} variant={"PageLoader"} />
        <div style={{ 
          color: '#666', 
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {loadingStage}
        </div>
      </div>
    );
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