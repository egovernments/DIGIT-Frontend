import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const UserPreferencesService = {
  Upsert: (data) =>
    Request({
      url: Urls.userPreference.upsert,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data: data,
    }),
  Search: (data) =>
    Request({
      url: Urls.userPreference.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data: data,
    }),
};

export default UserPreferencesService;
