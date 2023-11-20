import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const UiSchemaSearchService = {
    search: (data) =>
        Request({
            data: { MdmsCriteria: data },
            url: Urls.uiSchemaSearch,
            useCache: false,
            method: "POST",
            auth: true,
            userService: true,
        }),
};
