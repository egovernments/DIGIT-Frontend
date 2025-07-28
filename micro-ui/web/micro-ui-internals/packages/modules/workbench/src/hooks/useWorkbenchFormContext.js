import React, { useContext } from "react";
export const WorkbenchProvider = React.createContext({});

/**
 * Custom hook which can gives the workbench functions to access
 *
 * @author jagankumar-egov
 *
 * Feature :: Workbench
 * 
 * @example
 *         const { configs , updateConfigs } = Digit.Hooks.workbench.useWorkbenchFormContext()
 *
 * @returns {Object} Returns the object which contains configs state and updateConfigs method
 */
export const useWorkbenchFormContext = () => {
  const { configs , updateConfigs, ...rest } = useContext(WorkbenchProvider);
  return { configs , updateConfigs, ...rest };
};
