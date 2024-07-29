import express from "express";
import { logger } from "../utils/logger";
import { enrichAndPersistMDMSDetails } from "../utils/persistUtils";
import { validateCreateMdmsDatasRequest, validateCreateMdmsDatasRequestForJson, validateGenerateMdmsTemplateRequest, validateSearchRequest } from "../validators/mdmsValidator";
import { generateJSONMdmsTemplate, generateMdmsTemplate, processAfterValidation, processAfterValidationForJson } from "../utils/mdmsBulkUploadServiceUtil";

export async function createMdmsDatasService(request: express.Request) {

    // Validate the request for creating a project type campaign
    await validateCreateMdmsDatasRequest(request);
    enrichAndPersistMDMSDetails(request);
    logger.info("VALIDATED THE MDMS CREATE REQUEST");

    processAfterValidation(request);
}

export async function createMdmsDatasFromJsonService(request: express.Request) {

    // Validate the request for creating a project type campaign
    await validateCreateMdmsDatasRequestForJson(request);
    enrichAndPersistMDMSDetails(request);
    logger.info("VALIDATED THE MDMS CREATE REQUEST");

    processAfterValidationForJson(request);
}

export async function generateMdmsTemplateService(request: any) {
    await validateGenerateMdmsTemplateRequest(request);
    logger.info("VALIDATED THE MDMS TEMPLATE GENERATE REQUEST");
    await generateMdmsTemplate(request);
}

export async function generateMdmsJSONTemplateService(request: any) {
    await validateGenerateMdmsTemplateRequest(request);
    logger.info("VALIDATED THE MDMS JSON TEMPLATE GENERATE REQUEST");
    await generateJSONMdmsTemplate(request);
}

export async function searchMdmsBulkDetailService(request: any) {
    await validateSearchRequest(request);
}
