import { useQuery, useQueryClient } from "react-query";


const TransformArrayToObj = (traslationList) => {
  return traslationList.reduce(
    // eslint-disable-next-line
    (obj, item) => ((obj[item.code] = item.message), obj),
    {}
  );
  // return trasformedTraslation;
};

const LocalisationSearchUtil = async ({ url, params, body, plainAccessRequest,state } ) => {
  const data = await Digit.CustomService.getResponse({ url, params, body, plainAccessRequest })
  return data;
}

const LocalisationSearch = {
  fetchResults : async ({ url, params, body, plainAccessRequest,state }) => {
    try {
      const response = await LocalisationSearchUtil({ url, params, body, plainAccessRequest,state })
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.Errors[0].message);
    }
  }
}

const useLocalization = ({url="/localization/messages/v1/_search", params, body, config = {}, plainAccessRequest,changeQueryName="Random",state,i18n }) => {
  const { isLoading, data, isFetching,refetch,error } = useQuery(
    [url,changeQueryName].filter((e) => e),
    () => LocalisationSearch.fetchResults({ url, params, body, plainAccessRequest,state }),
    {
      cacheTime:Infinity,
      staleTime:Infinity,
      select:(data) => {
        const res=TransformArrayToObj(data?.data?.messages)
        i18n.addResourceBundle('en', 'translations', res);
        return []
      },
      ...config,
    }
  );

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    error
  };
};



export default useLocalization;