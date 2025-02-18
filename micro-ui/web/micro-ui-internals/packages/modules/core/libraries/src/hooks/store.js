import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
// import mergeConfig from "../../config/mergeConfig";
import { StoreService } from "../services/molecules/Store/service";

export const useStore = ({ stateCode, moduleCode, language ,modulePrefix = "rainmaker" }) => {
  return useQuery(
    ['store', stateCode, moduleCode, language, modulePrefix], // queryKey
    () => StoreService.defaultData(stateCode, moduleCode, language, modulePrefix), // query function
    {
      // You can add other options here if needed, such as `enabled`, `staleTime`, etc.
    }
  );
};

export const useInitStore = (stateCode, enabledModules,modulePrefix = "rainmaker" ) => {
  const { isLoading, error, isError, data } = useQuery({
    queryKey: ["initStore", stateCode, enabledModules, modulePrefix],
    queryFn: () => StoreService.digitInitData(stateCode, enabledModules, modulePrefix),
    staleTime: Infinity,
  });
  return { isLoading, error, isError, data };
};

export const useInitTenantConfig = (stateCode, enabledModules) => {
  const { isLoading, error, isError, data } = useQuery({
    queryKey: ["initTenantConfig", stateCode, enabledModules],
    queryFn: () => StoreService.getTenantConfig(stateCode, enabledModules),
    staleTime: Infinity,
    enabled: Digit.Utils.getMultiRootTenant(),
  });
  return { isLoading, error, isError, data };
};
