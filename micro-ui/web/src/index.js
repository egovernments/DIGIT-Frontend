import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client"; // Use createRoot from React 18
import { initLibraries } from "@egovernments/digit-ui-libraries";
//import "./index.css";

import App from './App';
import { TLCustomisations } from './Customisations/tl/TLCustomisation';



window.Digit.Customizations = { PGR: {} ,TL:TLCustomisations};


initGlobalConfigs(); // Ensure global configs are set first


const initTokens = (stateCode) => {
  console.log(window.globalConfigs, "window.globalConfigs");

  const user = window.Digit.SessionStorage.get("User");

  if (!user || !user.access_token || !user.info) {
    // login detection
  
    const parseValue = (value) => {
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    }
  
    const getFromStorage = (key) => {
      const value = window.localStorage.getItem(key);
      return value && value !== "undefined" ? parseValue(value) : null;
    }
  
    const token = getFromStorage("token")
  
    const citizenToken = getFromStorage("Citizen.token")
    const citizenInfo = getFromStorage("Citizen.user-info")
    const citizenTenantId = getFromStorage("Citizen.tenant-id")
  
    const employeeToken = getFromStorage("Employee.token")
    const employeeInfo = getFromStorage("Employee.user-info")
    const employeeTenantId = getFromStorage("Employee.tenant-id")
    const userType = token === citizenToken ? "citizen" : "employee";
  
    window.Digit.SessionStorage.set("user_type", userType);
    window.Digit.SessionStorage.set("userType", userType);
  
    const getUserDetails = (access_token, info) => ({ token: access_token, access_token, info })
  
    const userDetails = userType === "citizen" ? getUserDetails(citizenToken, citizenInfo) : getUserDetails(employeeToken, employeeInfo)
  
    window.Digit.SessionStorage.set("User", userDetails);
    window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);
    window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
    // end
  }
  
};

const MainApp = ({ stateCode, enabledModules }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  

  useEffect(() => {
    
    initLibraries().then(() => {
      console.log(Digit,window?.Digit);
      // initAssignmentComponents();
      
      setIsReady(true)
    });
    // initWorkbenchComponents();
    
  }, []);

  useEffect(() => {
    initTokens(stateCode);
     setLoaded(true);
  }, [stateCode,isReady]);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
    {window.Digit && (
        <App />
    )}
  </Suspense>
  );
};





const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ React 18 uses createRoot()
root.render(
  <React.StrictMode>
 <MainApp />
  </React.StrictMode>,
  document.getElementById('root')
);