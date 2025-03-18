import Urls from "../../utils/urls";
import { Request } from "@egovernments/digit-ui-libraries";

const PGRService = {
  search: (tenantId, filters, searchParams) =>
    Request({
      url: Urls.pgr.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, ...filters, ...searchParams },
    }),
  create: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.pgr.create,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId },
    })
};

export default PGRService;