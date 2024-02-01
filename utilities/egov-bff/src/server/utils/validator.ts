import * as express from "express";
import { searchMDMS } from "../api";
import { errorResponder } from "../utils/index";
import { logger } from "../utils/logger";





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


export { validateProcessMicroplan };