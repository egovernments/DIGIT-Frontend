import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LocalisationSearch } from "../utils/LocalisationSearch";

const useLocalisationSearch = ({
  url,
  params,
  body,
  config = {},
  plainAccessRequest,
  changeQueryName = "Random",
  state
}) => {
  const client = useQueryClient();

  const queryKey = [url, changeQueryName].filter(Boolean);

  const queryFn = () =>
    LocalisationSearch.fetchResults({
      url,
      params,
      body,
      plainAccessRequest,
      state
    });

  const { isLoading, data, isFetching, refetch, error } = useQuery({
    queryKey,
    queryFn,
    cacheTime: 0,
    ...config
  });

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {
      data && client.invalidateQueries({ queryKey: [url].filter(Boolean) });
    },
    error
  };
};

export default useLocalisationSearch;
