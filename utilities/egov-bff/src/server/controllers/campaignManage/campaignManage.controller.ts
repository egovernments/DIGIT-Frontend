import * as express from "express";
import { logger } from "../../utils/logger";
import {
    enrichAndPersistProjectCampaignRequest,
    errorResponder,
    searchProjectCampaignResourcData,
    sendResponse,
} from "../../utils/index";
import { validateCampaignRequest, validateProjectCampaignRequest, validateSearchProjectCampaignRequest } from "../../utils/validator";
import { createProjectCampaignResourcData, createProjectIfNotExists, createRelatedResouce, enrichCampaign } from "../../api";
import { httpRequest } from "../../utils/request";
import config from "../../config/index";
import { v4 as uuidv4 } from 'uuid';







// Define the MeasurementController class
class campaignManageController {
    // Define class properties
    public path = "/v1/project-type";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/create`, this.createProjectTypeCampaign);
        this.router.post(`${this.path}/search`, this.searchProjectTypeCampaign);
        this.router.post(`${this.path}/createCampaign`, this.createCampaign);
    }
    createProjectTypeCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {
        function reorderBoundaries(request: any) {
            const { boundaries } = request?.body?.CampaignDetails;
            const rootBoundary = boundaries.find((boundary: any) => boundary.isRoot);
            if (rootBoundary) {
                const index = boundaries.indexOf(rootBoundary);
                if (index !== 0) {
                    boundaries.unshift(boundaries.splice(index, 1)[0]);
                }
            } else {
                throw new Error("Root boundary not found");
            }
        }

        async function projectCreate(projectCreateBody: any, request: any) {
            logger.info("Project creation url " + config.host.projectHost + config.paths.healthProjectCreate)
            logger.info("Project creation body " + JSON.stringify(projectCreateBody))
            const projectCreateResponse = await httpRequest(config.host.projectHost + config.paths.healthProjectCreate, projectCreateBody);
            logger.info("Project creation response" + JSON.stringify(projectCreateResponse))
            if (projectCreateResponse?.Project[0]?.id) {
                logger.info("Project created successfully with id " + projectCreateResponse?.Project[0]?.id)
                return projectCreateResponse?.Project[0]?.id
            }
            else {
                throw new Error("Project creation failed, for the request: " + JSON.stringify(projectCreateBody))
            }
        }
        async function createProject(request: any) {
            const { tenantId, boundaries, projectType, startDate, endDate } = request?.body?.CampaignDetails;
            request.body.CampaignDetails.id = uuidv4()
            var Projects: any = [{
                tenantId,
                projectType,
                startDate,
                endDate,
                "projectSubType": "Campaign",
                "department": "Campaign",
                "description": "Campaign ",
            }]
            const projectCreateBody = {
                RequestInfo: request?.body?.RequestInfo,
                Projects
            }
            reorderBoundaries(request)
            var previousParentId = null;
            for (const boundary of boundaries) {
                Projects[0].address = { tenantId: tenantId, boundary: boundary?.code, boundaryType: boundary?.type }
                Projects[0].parent = previousParentId
                Projects[0].referenceID = request?.body?.CampaignDetails?.id
                previousParentId = await projectCreate(projectCreateBody, request)
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

        }
        try {
            await validateProjectCampaignRequest(request);
            await createProjectCampaignResourcData(request);
            await createProject(request)
            await enrichAndPersistProjectCampaignRequest(request)
            return sendResponse(response, { CampaignDetails: request?.body?.CampaignDetails }, request);
        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
        }

    };

    searchProjectTypeCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {

        try {
            await validateSearchProjectCampaignRequest(request);
            await searchProjectCampaignResourcData(request);
            return sendResponse(response, { CampaignDetails: request?.body?.CampaignDetails }, request);
        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
        }

    };

    createCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            await validateCampaignRequest(request.body)
            await createProjectIfNotExists(request.body)
            await createRelatedResouce(request.body)
            await enrichCampaign(request.body)
            return sendResponse(response, { Campaign: request?.body?.Campaign }, request);
        }
        catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);

        }
    };
};
export default campaignManageController;



