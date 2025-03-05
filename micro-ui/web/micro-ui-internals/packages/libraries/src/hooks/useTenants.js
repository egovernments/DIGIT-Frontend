import { useQuery } from "@tanstack/react-query";

const alphabeticalSortFunctionForTenantsBasedOnName = (firstEl, secondEl) =>{
    if (firstEl.name.toUpperCase() < secondEl.name.toUpperCase() ) {
        return -1
    }
    if (firstEl.name.toUpperCase() > secondEl.name.toUpperCase() ) {
        return 1
    }
        return 0
}

export const useTenants = () => {
    return useQuery({
      queryKey: ["ALL_TENANTS"],
      queryFn: () => {
        const data = Digit.SessionStorage.get("initData");
        return data.tenants.sort(alphabeticalSortFunctionForTenantsBasedOnName);
      },
    });
  };