import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const BoundaryHierarchyService = {
  searchBoundaryHierarchy: ({ ...filters }) =>
    Request({
      url: Urls.boundaryHierarchy.boundaryHierarchyDefinition,
      method: "POST",
      auth: true,
      useCache: true,
      userService: true,
      setTimeParam: true,
      userDownload: false,
      data: {
        ...filters,
      },
    }),
};

export default BoundaryHierarchyService;
