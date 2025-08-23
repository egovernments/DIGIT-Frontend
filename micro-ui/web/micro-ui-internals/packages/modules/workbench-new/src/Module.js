import React from "react";
import { EmployeePages } from "./pages";
import { WorkbenchApp } from "./components";

const WorkbenchNewModule = {
  moduleName: "WorkbenchNew",
  
  components: {
    WorkbenchApp,
    MasterSelection: EmployeePages.MasterSelection,
  },

  pages: [
    {
      route: "workbench/master-selection",
      component: "MasterSelection",
      key: "workbench-master-selection",
    },
  ],

  routes: [
    {
      path: "/workbench",
      component: WorkbenchApp,
    },
  ],
};

export { WorkbenchNewModule };
export { EmployeePages, WorkbenchApp };
export default WorkbenchNewModule;