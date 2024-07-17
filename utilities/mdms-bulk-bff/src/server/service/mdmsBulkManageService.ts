import express from "express";
import { logger } from "../utils/logger";
import { enrichAndPersistMDMSDetails } from "../utils/persistUtils";
import { validateCreateMdmsDatasRequest, validateGenerateMdmsTemplateRequest } from "../validators/mdmsValidator";
import { generateMdmsTemplate } from "../utils/mdmsBulkUploadServiceUtil";

export async function createMdmsDatasService(request: express.Request) {

    // Validate the request for creating a project type campaign
    await validateCreateMdmsDatasRequest(request);
    enrichAndPersistMDMSDetails(request);
    logger.info("VALIDATED THE MDMS CREATE REQUEST");
}

export async function generateMdmsTemplateService(request: any) {
    await validateGenerateMdmsTemplateRequest(request);
    logger.info("VALIDATED THE MDMS TEMPLATE GENERATE REQUEST");
    await generateMdmsTemplate(request);
}
