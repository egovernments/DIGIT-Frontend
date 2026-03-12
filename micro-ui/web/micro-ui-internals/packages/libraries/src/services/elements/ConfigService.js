import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const ConfigServiceService = {
  Search: (data) =>
    Request({
      url: Urls.configService.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data: data,
    }),
};

export default ConfigServiceService;
