import Ajv from "ajv";
import { throwError } from "../utils/errorUtils";
import { httpRequest } from "../utils/request";
import config from "../config";
import { logger } from "../utils/logger";

export function validateBodyViaSchema(schema: any, objectData: any) {
    const properties: any = { jsonPointers: true, allowUnknownAttributes: true, strict: false }
    const ajv = new Ajv(properties);
    const validate = ajv.compile(schema);
    const isValid = validate(objectData);
    if (!isValid) {
        const formattedError = validate?.errors?.map((error: any) => {
            let formattedErrorMessage = "";
            if (error?.dataPath) {
                // Replace slash with dot and remove leading dot if present
                const dataPath = error.dataPath.replace(/\//g, '.').replace(/^\./, '');
                formattedErrorMessage = `${dataPath} ${error.message}`;
            }
            else if (error?.instancePath) {
                // Replace slash with dot and remove leading dot if present
                const dataPath = error.instancePath.replace(/\//g, '.').replace(/^\./, '');
                formattedErrorMessage = `${dataPath} ${error.message}`;
            }
            else {
                formattedErrorMessage = `${error.message}`
            }
            if (error.keyword === 'enum' && error.params && error.params.allowedValues) {
                formattedErrorMessage += `. Allowed values are: ${error.params.allowedValues.join(', ')}`;
            }
            if (error.keyword === 'additionalProperties' && error.params && error.params.additionalProperty) {
                formattedErrorMessage += `, Additional property '${error.params.additionalProperty}' found.`;
            }
            // Capitalize the first letter of the error message
            formattedErrorMessage = formattedErrorMessage.charAt(0).toUpperCase() + formattedErrorMessage.slice(1);
            return formattedErrorMessage;
        }).join("; ");
        console.error(formattedError);
        throwError("COMMON", 400, "VALIDATION_ERROR", formattedError);
    }
}

export async function validateHierarchyType(request: any, hierarchyType: any, tenantId: any) {
    const searchBody = {
        RequestInfo: request?.body?.RequestInfo,
        BoundaryTypeHierarchySearchCriteria: {
            "tenantId": tenantId,
            "limit": 5,
            "offset": 0,
            "hierarchyType": hierarchyType
        }
    }
    const response = await httpRequest(config.host.boundaryHost + config.paths.boundaryHierarchy, searchBody);
    if (response?.BoundaryHierarchy && Array.isArray(response?.BoundaryHierarchy) && response?.BoundaryHierarchy?.length > 0) {
        logger.info(`hierarchyType : ${hierarchyType} :: got validated`);
    }
    else {
        throwError(`CAMPAIGN`, 400, "VALIDATION_ERROR", `hierarchyType ${hierarchyType} not found`);
    }
}