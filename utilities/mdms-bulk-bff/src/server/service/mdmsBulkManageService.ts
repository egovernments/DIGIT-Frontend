import express from "express";
import { logger } from "../utils/logger";
import { getLocalizedMessagesHandler } from "../utils/localisationUtils";
import { boundaryBulkUpload, getBoundaryDetails } from "../utils/boundaryUtils";
import { enrichAndPersistBoundaryDetails } from "../utils/persistUtils";
import { validateCreateMdmsDatasRequest } from "../validators/mdmsValidator";

export async function createMdmsDatasService(request: express.Request) {

    // Validate the request for creating a project type campaign
    await validateCreateMdmsDatasRequest(request);
    enrichAndPersistMDMSDetails(request);
    logger.info("VALIDATED THE BOUNDARY CREATE REQUEST");

    boundaryBulkUpload(request, localizationMap);
}

export async function searchBoundaryDetailService(request: express.Request) {
    validateSearchBoundaryDetailRequest(request);
    await getBoundaryDetails(request);
}
