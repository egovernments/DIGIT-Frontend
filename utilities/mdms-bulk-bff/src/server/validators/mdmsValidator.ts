import { httpRequest } from "server/utils/request";
import { mdmsCreateBodySchema } from "../config/schemas/mdmsCreateBody";
import { validateBodyViaSchema } from "./genericValidator";
import config from "server/config";
import { throwError } from "server/utils/errorUtils";

export async function validateCreateMdmsDatasRequest(request: any) {
    validateBodyViaSchema(mdmsCreateBodySchema, request.query);
    await validateMdmsSchema(request);
}

async function validateMdmsSchema(request: any) {
    const { schemaName, tenantId } = request.query;
    const searchBody = {
        RequestInfo: request.body.RequestInfo,
        SchemaDefCriteria: {
            tenantId,
            codes: [schemaName]
        }
    }
    const schemaResponse = await httpRequest(config.host.mdmsHost + config.paths.mdmsSchemaSearch, searchBody);
    if (schemaResponse && schemaResponse.SchemaDefinitions && schemaResponse.SchemaDefinitions.length > 0) {
        const schema = schemaResponse.SchemaDefinitions[0];
        if (!schema.isActive) {
            throwError("MDMS", 400, "INVALID_MDMS_SCHEMA", `Schema ${schemaName} is not active`);
        }
    }
    else {
        throwError("MDMS", 400, "INVALID_MDMS_SCHEMA", `Schema ${schemaName} not found`);
    }
}