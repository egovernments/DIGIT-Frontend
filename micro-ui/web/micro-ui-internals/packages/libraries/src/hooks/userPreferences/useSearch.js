import UserPreferencesService from "../../services/elements/UserPreferences";
import { useQuery } from "react-query";

const useUserPreferenceSearch = (data, config) => {
  return useQuery(
    ["user_preference_search", data?.criteria?.userId, data?.criteria?.tenantId, data?.criteria?.preferenceCode],
    () => UserPreferencesService.Search(data),
    { ...config }
  );
};

export default useUserPreferenceSearch;
