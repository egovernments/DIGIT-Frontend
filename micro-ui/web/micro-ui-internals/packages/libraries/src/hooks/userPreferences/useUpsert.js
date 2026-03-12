import UserPreferencesService from "../../services/elements/UserPreferences";
import { useMutation } from "react-query";

const useUserPreferenceUpsert = () => {
  return useMutation((data) => UserPreferencesService.Upsert(data));
};

export default useUserPreferenceUpsert;
