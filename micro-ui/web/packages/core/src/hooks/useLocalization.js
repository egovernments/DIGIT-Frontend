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
      //here check if the data is in session storage or not
      //Digit.module.locale.tenant
      //here if moduleName has commas in it that means multiple modules are requested
      const {locale,module:moduleName,tenantId} = params || {}
      console.log(localStorage.getItem(`Digit.${tenantId}.${moduleName}.${locale}`));
      if(localStorage.getItem(`Digit.${tenantId}.${moduleName}.${locale}`) && Object.keys(localStorage.getItem(`Digit.${tenantId}.${moduleName}.${locale}`)).length > 0){
        return JSON.parse(localStorage.getItem(`Digit.${tenantId}.${moduleName}.${locale}`))
      }
      const response = await LocalisationSearchUtil({ url, params, body, plainAccessRequest,state })
      const transformedResponse = TransformArrayToObj(response?.messages)
      //set transformedResponse to localStorage before returning
      localStorage.setItem(`Digit.${tenantId}.${moduleName}.${locale}`,JSON.stringify(transformedResponse))
      return transformedResponse
    } catch (error) {
      throw new Error(error?.response?.data?.Errors[0].message);
    }
  }
}

const useLocalization = ({url="/localization/messages/v1/_search", params, body, config = {}, plainAccessRequest,changeQueryName="Random",state,i18n }) => {
  console.log("i18n",i18n);
  const { isLoading, data, isFetching,refetch,error } = useQuery(
    [url,params,i18n.language].filter((e) => e),
    () => LocalisationSearch.fetchResults({ url, params, body, plainAccessRequest,state }),
    {
      cacheTime:Infinity,
      staleTime:Infinity,
      select:(data) => {
        i18n.addResourceBundle(i18n.language, 'translations', data);
        //example code to add hindi msg to debug change lang if not upserted
        // i18n.addResourceBundle('hi_IN', 'translations', {
        //   CORE_COMMON_PROFILE_NAME:"here"
        // });

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