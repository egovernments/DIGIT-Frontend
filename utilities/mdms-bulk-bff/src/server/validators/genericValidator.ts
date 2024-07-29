import Ajv from "ajv";
import { throwError } from "../utils/errorUtils";

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


export function validateBodyViaSchemaOfSheetData(schema: any, datas: any) {
    const properties: any = { jsonPointers: true, allowUnknownAttributes: true, strict: false }
    const ajv = new Ajv(properties);
    const validate = ajv.compile(schema);
    let allErrors = [];
    for (const data of datas) {
        const rowNumber = data['!row#number!'];
        const isValid = validate(data);
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
                formattedErrorMessage += ` at row ${rowNumber}`
                return formattedErrorMessage;
            }).join("; ");
            if (formattedError) {
                console.error(formattedError);
                allErrors.push(formattedError);
            }
        }
    }
    if (allErrors.length > 0) {
        throwError("COMMON", 400, "VALIDATION_ERROR", allErrors.join("; "));
    }
}

export function validateBodyViaSchemaOfJSONData(schema: any, datas: any) {
    const properties: any = { jsonPointers: true, allowUnknownAttributes: true, strict: false }
    const ajv = new Ajv(properties);
    const validate = ajv.compile(schema);
    let allErrors = [];
    for (const data of datas) {
        const indexNumber = data['!index#number!'];
        const isValid = validate(data);
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
                formattedErrorMessage += ` at index ${indexNumber}`
                return formattedErrorMessage;
            }).join("; ");
            if (formattedError) {
                console.error(formattedError);
                allErrors.push(formattedError);
            }
        }
    }
    if (allErrors.length > 0) {
        throwError("COMMON", 400, "VALIDATION_ERROR", allErrors.join("; "));
    }
}