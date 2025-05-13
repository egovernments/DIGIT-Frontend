// import { useQuery, useQueryClient } from "react-query";
// import { LocalisationSearch } from "../utils/LocalisationSearch";

// const useLocalisationSearch = ({url, params, body, config = {}, plainAccessRequest,changeQueryName="Random",state }) => {
//   const client = useQueryClient();
//   const CustomService = Digit.CustomService
//   const { isLoading, data, isFetching,refetch,error } = useQuery(
//     [url,changeQueryName].filter((e) => e),
//     () => LocalisationSearch.fetchResults({ url, params, body, plainAccessRequest,state }),
//     {
//       cacheTime:0,
//       ...config,
//     }
//   );

//   return {
//     isLoading,
//     isFetching,
//     data,
//     refetch,
//     revalidate: () => {
//       data && client.invalidateQueries({ queryKey: [url].filter((e) => e) });
//     },
//     error
//   };
// };



// export default useLocalisationSearch;

import { useQuery, useQueryClient } from "@tanstack/react-query"; // Importing from the new @tanstack/react-query package
import { LocalisationSearch } from "../utils/LocalisationSearch";

const useLocalisationSearch = ({ url, params, body, config = {}, plainAccessRequest, changeQueryName = "Random", state }) => {
  const client = useQueryClient();
  const CustomService = Digit.CustomService;

  // Updated: Using the options object structure for useQuery
  const {
    isLoading,
    data,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: [url, changeQueryName].filter((e) => e), // Updated: Using queryKey for unique identification
    queryFn: () => LocalisationSearch.fetchResults({ url, params, body, plainAccessRequest, state }), // Updated: Using queryFn for data fetching
    cacheTime: 0,
    ...config,
  });

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {
      // Updated: Using client.invalidateQueries with the queryKey
      client.invalidateQueries({ queryKey: [url].filter((e) => e) });
    },
    error,
  };
};

export default useLocalisationSearch;