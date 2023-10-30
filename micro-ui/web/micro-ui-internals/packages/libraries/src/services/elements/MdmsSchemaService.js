import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const MdmsSchemaService = {

    create: (data) =>
        Request({
            data: data,
            url: Urls.mdmsSchema.create,
            useCache: false,
            method: "POST",
            auth: true,
            userService: true
        }),
    search: (data) =>
        Request({
            data: data,
            url: Urls.mdmsSchema.search,
            useCache: false,
            method: "POST",
            auth: true,
            userService: true,
        }),
};

export default MdmsSchemaService;
