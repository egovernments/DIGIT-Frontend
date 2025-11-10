import React, { useEffect, useState, lazy, Suspense } from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import ReactDOM from "react-dom/client";
import { Hooks } from "@egovernments/digit-ui-libraries";
// import { BrowserRouter } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-components";

window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;
const DigitUILazy = lazy(() => import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI })));


const enabledModules = ["Utilities", "PT",
  "Birth",
  "Death",
  "FireNOC",
  "TL",
  "HRMS",
  "WS",
  "RECEIPTS",
  "PGR",
  "Bills",
  "BillAmendement",
  "Engagement",
  "Finance"
];

const initTokens = (stateCode) => {
  const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";
  const token = window.localStorage.getItem("token") || process.env[`REACT_APP_${userType}_TOKEN`];

  const citizenInfo = window.localStorage.getItem("Citizen.user-info");
  const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || stateCode;
  const employeeInfo = window.localStorage.getItem("Employee.user-info");
  const employeeTenantId = window.localStorage.getItem("Employee.tenant-id");

  const userTypeInfo = userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";
  window.Digit.SessionStorage.set("user_type", userTypeInfo);
  window.Digit.SessionStorage.set("userType", userTypeInfo);

  if (userType !== "CITIZEN") {
    window.Digit.SessionStorage.set("User", {
      access_token: token,
      info: userType !== "CITIZEN" ? JSON.parse(employeeInfo) : citizenInfo,
    });
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

  if (employeeTenantId && employeeTenantId.length) {
    window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
  }
};

const initDigitUI = () => {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "mseva-ui";

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || process.env.REACT_APP_STATE_LEVEL_TENANT_ID || "pb";

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<>

    <MainApp stateCode={stateCode} enabledModules={enabledModules} />

  </>);
};

const MainApp = ({ stateCode, enabledModules }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  debugger
  useEffect(() => {
    initLibraries().then(async () => {
      try {
        const { initPropertyTaxComponents } = await import("@egovernments/digit-ui-module-pt")
        const { initBirthComponents } = await import("@egovernments/digit-ui-module-birth")
        const { initDeathComponents } = await import("@egovernments/digit-ui-module-death")
        const { initFirenocComponents } = await import("@egovernments/digit-ui-module-firenoc")
        const { initTLComponents } = await import("@egovernments/digit-ui-module-tl")
        const { initWSComponents } = await import("@egovernments/digit-ui-module-ws")
        const { initHRMSComponents } = await import("@egovernments/digit-ui-module-hrms")
        const { initReceiptsComponents } = await import("@egovernments/digit-ui-module-receipts")
        const { initPGRComponents } = await import("@egovernments/digit-ui-module-pgr")
        const { initBillsComponents } = await import("@egovernments/digit-ui-module-bills")
        const { initEngagementComponents } = await import("@egovernments/digit-ui-module-engagement")
        const { initFinanceComponents } = await import("@egovernments/digit-ui-module-finance")
        initPropertyTaxComponents();
        initBirthComponents();
        initDeathComponents();
        initFirenocComponents();
        initTLComponents();
        initWSComponents();
        initHRMSComponents();
        initReceiptsComponents();
        initPGRComponents();
        initBillsComponents();
        initEngagementComponents();
        initFinanceComponents();
      } catch (error) {
        console.log("Error loading modules:", error);
        // Continue without modules if they fail to load
      }
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    initTokens(stateCode);
    setLoaded(true);
  }, [stateCode, isReady]);

  if (!loaded) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <Suspense fallback={<Loader page={true} variant={"PageLoader"} />}>
      {window.Digit && (
        <DigitUILazy stateCode={stateCode} enabledModules={enabledModules} allowedUserTypes={["employee", "citizen"]} defaultLanding="employee" />
      )}
    </Suspense>
  );
};

initDigitUI();