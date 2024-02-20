import * as express from "express";
import { searchMDMS } from "../api";
import { errorResponder } from "../utils/index";
import { logger } from "../utils/logger";
import Ajv from "ajv";





const validateProcessMicroplan = async (
    request: express.Request,
    response: express.Response
) => {
    try {
        const { HCMConfig } = request.body;
        // Ensure that the request body is not empty
        if (!request.body || Object.keys(request.body).length === 0) {
            throw new Error('Request body is empty');
        }

        // Ensure that HCMConfig is present in the request body
        if (!request.body.HCMConfig) {
            throw new Error('HCMConfig is missing in the request body');
        }
        validateField(HCMConfig.tenantId, 'TenantId');
        validateField(HCMConfig.campaignName, 'CampaignName');
        validateField(HCMConfig.projectType, 'ProjectType');
        validateField(HCMConfig.projectTypeId, 'ProjectTypeId');
        validateField(HCMConfig.fileStoreId, 'FileStoreId');
        validateSelectedRows(HCMConfig.selectedRows);
        validateField(HCMConfig.campaignType, 'CampaignType');
        validateProjectType(HCMConfig.projectTypeId, request, response);

    } catch (error: any) {
        response.status(400).send(error.message);
    }
};

const validateField = (field: any, fieldName: string): void => {
    if (!field) {
        throw new Error(`${fieldName} is missing in HCMConfig`);
    }
}
const validateSelectedRows = (selectedRows: any[]): void => {
    if (!selectedRows || selectedRows.length === 0) {
        throw new Error('SelectedRows is missing or empty in HCMConfig');
    }
}

const validateProjectType = async (projectTypeId: any, request: express.Request,
    response: express.Response) => {
    const result: any = await searchMDMS([projectTypeId], "HCM-PROJECT-TYPES.projectTypes", request.body.RequestInfo, response);
    try {
        if (result.mdms.length == 0) {
            // Throw an error with a proper message
            throw new Error("Invalid Project Type ID.");
        }
        const projectTypeFromMDMS = result?.mdms?.[0]?.data?.code;
        if (projectTypeFromMDMS != request?.body?.HCMConfig?.projectType) {
            throw new Error("Invalid Project Type.")
        }
    }
    catch (e: any) {
        logger.error(String(e))
        return errorResponder({ message: String(e) + "  Check Logs" }, request, response);
    }
}

const validateTransformedData = (transformedData: any[]): void => {
    const duplicates: Map<string, number[]> = new Map(); // Map to store duplicates

    for (let i = 0; i < transformedData.length; i++) {
        const rowData1 = transformedData[i];
        const rowNumber1 = rowData1['#row!number#']; // Get the row number of rowData1

        // Iterate over other elements to compare with rowData1
        for (let j = i + 1; j < transformedData.length; j++) {
            const rowData2 = transformedData[j];
            const rowNumber2 = rowData2['#row!number#']; // Get the row number of rowData2

            // Check if rowData1 and rowData2 have the same values for all keys except '#row!number#'
            let isDuplicate = true;
            for (const key of Object.keys(rowData1)) {
                if (key !== '#row!number#' && rowData1[key] !== rowData2[key]) {
                    isDuplicate = false;
                    break;
                }
            }

            // If rowData1 and rowData2 are duplicates, store the row numbers in the duplicates map
            if (isDuplicate) {
                if (!duplicates.has(rowNumber1.toString())) {
                    duplicates.set(rowNumber1.toString(), [rowNumber1]);
                }
                duplicates.get(rowNumber1.toString())?.push(rowNumber2);
            }
        }
    }

    // If duplicates are found, throw an error
    if (duplicates.size > 0) {
        const errorMessage = Array.from(duplicates.entries())
            .map(([rowNumber, duplicateRowNumbers]) => {
                return `Duplicate data in row ${rowNumber} and ${duplicateRowNumbers.slice(1).join(', ')}`;
            })
            .join('; ');
        throw new Error(errorMessage);
    }
};

function validateDataWithSchema(data: any, schema: any): { isValid: boolean; error: Ajv.ErrorObject[] | null | undefined } {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const isValid: any = validate(data);
    if (!isValid) {
        logger.error(JSON.stringify(validate.errors));
    }
    return { isValid, error: validate.errors };
}

function processValidationWithSchema(processResult: any, validationErrors: any, validatedData: any, schemaDef: any) {
    if (schemaDef) {
        processResult.updatedDatas.forEach((data: any) => {
            const validationResult = validateDataWithSchema(data, schemaDef);
            if (!validationResult.isValid) {
                validationErrors.push({ data, error: validationResult.error });
            }
            else {
                validatedData.push(data)
            }
        });
    }
    else {
        logger.info("Skipping Validation of Data as Schema is not defined");
        validationErrors.push("NO_VALIDATION_SCHEMA_FOUND");
        processResult.updatedDatas.forEach((data: any) => {
            validatedData.push(data)
        });
    }
}

async function getTransformAndParsingTemplates(APIResource: any, request: any, response: any) {
    if (!APIResource.mdms || Object.keys(APIResource.mdms).length === 0) {
        const errorMessage = "Invalid APIResourceType Type";
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    const transformTemplate = APIResource?.mdms?.[0]?.data?.transformTemplateName;
    const parsingTemplate = APIResource?.mdms?.[0]?.data?.parsingTemplateName;

    return { transformTemplate, parsingTemplate };
}





export { validateProcessMicroplan, validateTransformedData, validateDataWithSchema, processValidationWithSchema, getTransformAndParsingTemplates };