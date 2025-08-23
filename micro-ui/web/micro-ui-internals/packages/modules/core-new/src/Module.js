import React from "react";

// Import pages
import { EmployeePages, CitizenPages } from "./pages";

// Import components
import { CoreNewApp } from "./components";

const CoreNewModule = {
  /**
   * Module configuration
   */
  moduleName: "CoreNew",
  
  /**
   * Component registry for the core new module
   */
  components: {
    // Main App Component
    CoreNewApp,
    
    // Employee Components
    EmployeeLanguageSelection: EmployeePages.LanguageSelection,
    // Employee Components
    EmployeeLogin: EmployeePages.Login,
    
    // Citizen Components
    CitizenLanguageSelection: CitizenPages.LanguageSelection,
  },

  /**
   * Page definitions for routing
   */
  pages: [
    // Employee pages
    {
      route: "employee/language-selection",
      component: "EmployeeLanguageSelection",
      key: "employee-language-selection",
      hideHeader: true,
    },
        {
      route: "employee/login",
      component: "EmployeeLogin",
      key: "employee-login",
      hideHeader: true,
    },
    
    // Citizen pages
    {
      route: "citizen/language-selection", 
      component: "CitizenLanguageSelection",
      key: "citizen-language-selection",
      hideHeader: true,
    },
  ],

  /**
   * Module routes configuration
   */
  routes: [
    {
      path: "/core-new",
      component: CoreNewApp,
    },
  ],
};

export { CoreNewModule };

// Export individual components for direct usage
export { EmployeePages, CitizenPages, CoreNewApp };

// Default export for module registration
export default CoreNewModule;