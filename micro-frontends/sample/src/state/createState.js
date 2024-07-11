import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./stateConfigs";

export function createGlobalState(queryKey, initialData = null) {
  return function () {
    const { data } = useQuery({
      queryKey: [queryKey],
      queryFn: () => Promise.resolve(initialData),
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    });

    function setData(data) {
      queryClient.setQueryData([queryKey], data);
    }

    function resetData() {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.refetchQueries({
        queryKey: [queryKey],
      });
    }

    return { data, setData, resetData };
  };
}
