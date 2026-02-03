import { useState, useEffect } from "react";
import { useQuery } from "react-query";
// import mergeConfig from "../../config/mergeConfig";
import { StoreService } from "../services/molecules/Store/service";

export const useStore = ({ stateCode, moduleCode, language ,modulePrefix = "rainmaker" }) => {
  return useQuery(["store", stateCode, moduleCode, language, modulePrefix], () => StoreService.defaultData(stateCode, moduleCode, language, modulePrefix));
};

export const useInitStore = (stateCode, enabledModules,modulePrefix = "rainmaker" ) => {
  const { isLoading, error, isError, data } = useQuery(
    ["initStore", stateCode, enabledModules,modulePrefix],
    () => StoreService.digitInitData(stateCode, enabledModules ,modulePrefix),
    {
      staleTime: Infinity,
    }
  );
  return { isLoading, error, isError, data };
};

export const useInitTenantConfig = (stateCode, enabledModules) => {
  const { isLoading, error, isError, data } = useQuery(
    ["initTenantConfig", stateCode, enabledModules],
    () => StoreService.getTenantConfig(stateCode, enabledModules),
    {
      staleTime: Infinity,
      enabled: Digit.Utils.getMultiRootTenant()
    }
  );
  return { isLoading, error, isError, data };
};
