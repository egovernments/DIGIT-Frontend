import { useQuery, useQueryClient } from "react-query";

const TransformArrayToObj = (traslationList) => {
  if(!traslationList){
    return {}
  }
  return traslationList.reduce(
    // eslint-disable-next-line
    (obj, item) => ((obj[item.code] = item.message), obj),
    {}
  );
  // return trasformedTraslation;
};

const consolidateObjectsByKey = (arr, key="module") =>  {
  const result = {};
  
  arr.forEach(obj => {
      const keyValue = obj[key];
      if (!result[keyValue]) {
          result[keyValue] = [];
      }
      result[keyValue].push(obj);
  });
  
  return result;
}

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
      //separate out the modules and set separately

      //basically here what we are doing is caching the already fetched modules in localStorage so that we don't have to make api calls to localization service if same modules are requested more than once
      const {locale,module:moduleName,tenantId} = params || {}
      const modulesRequested = moduleName.split(",")
      const modulesToRequest = []
      let consolidatedResponse = {}

      const modulesAlreadyPresent = modulesRequested.filter(mod => {
        if(localStorage.getItem(`Digit.${tenantId}.${mod}.${locale}`) && Object.keys(localStorage.getItem(`Digit.${tenantId}.${mod}.${locale}`)).length > 0){
          consolidatedResponse = {...consolidatedResponse,...JSON.parse(localStorage.getItem(`Digit.${tenantId}.${mod}.${locale}`))}
          return true
        }else{
           modulesToRequest.push(mod)
           return false
        }
      })
      
      const modulesToRequestStr = modulesToRequest.join(',')
      if(modulesToRequest.length===0) {
        return consolidatedResponse
      }

      params.module = modulesToRequestStr
      
      const response = await LocalisationSearchUtil({ url, params, body, plainAccessRequest,state })
      //before transforming we need to separate out the messages based on module key and then set them on storage before transforming them
      const transformedResponseBasedOnModule = consolidateObjectsByKey(response.messages)
      modulesToRequest.forEach(mod => {
        
        const transformedResponse = TransformArrayToObj(transformedResponseBasedOnModule?.[mod])
        consolidatedResponse = {...consolidatedResponse,...transformedResponse}
        //setting messages corresponding to each module requested
        localStorage.setItem(`Digit.${tenantId}.${mod}.${locale}`,JSON.stringify(transformedResponse))
      })
      return consolidatedResponse
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const useLocalization = ({url="/localization/messages/v1/_search", params, body, config = {}, plainAccessRequest,changeQueryName="Random",state,i18n }) => {
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