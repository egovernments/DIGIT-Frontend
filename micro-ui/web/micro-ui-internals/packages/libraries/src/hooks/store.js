import { useState, useEffect } from "react";
import { useQuery, QueryClient } from "@tanstack/react-query";
// import mergeConfig from "../../config/mergeConfig";
import { StoreService } from "../services/molecules/Store/service";

export const useStore = ({ stateCode, moduleCode, language ,modulePrefix = "rainmaker" }) => {
  return useQuery({
    queryKey : ['store', stateCode, moduleCode, language, modulePrefix], // queryKey
    queryFn : () => StoreService.defaultData(stateCode, moduleCode, language, modulePrefix), // query function
    // {
    //   // You can add other options here if needed, such as `enabled`, `staleTime`, etc.
    // }
  }
  );
};

export const useInitStore = () => {
  console.log("inside useInitStore");
  const { isLoading, error, isError, data } = useQuery({
    queryKey: ["initStore"],
    queryFn: async () => {
      console.log("Fetching data...");
      const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    },
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
