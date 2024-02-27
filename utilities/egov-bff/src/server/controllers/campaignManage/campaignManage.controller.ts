import * as express from "express";
import { logger } from "../../utils/logger";
import {
    sendResponse,
} from "../../utils/index";
import { httpRequest } from "../../utils/request";
import config from "../../config/index";





// Define the MeasurementController class
class campaignManageController {
    // Define class properties
    public path = "/process/v1";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/create`, this.createCampaign);
    }
    createCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {
        async function validateCampaignRequest(requestBody: any) {
            const { projectType } = requestBody?.Campaign
            if (!projectType) {
                throw new Error("Enter ProjectType")
            }
            for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
                var { startDate, endDate } = campaignDetails;
                startDate = parseInt(startDate);
                endDate = parseInt(endDate);

                // Check if startDate and endDate are valid integers
                if (isNaN(startDate) || isNaN(endDate)) {
                    throw new Error("Start date or end date is not a valid epoch timestamp");
                }
            }

        }

        function validatedProjectResponse(projectResponse: any, projectBody: any) {
            if (projectBody?.Projects?.length != projectResponse?.Project?.length) {
                throw new Error("Project creation failed. Check Logs")
            }
            else {
                for (const project of projectResponse?.Project) {
                    if (!project?.id) {
                        throw new Error("Project creation failed. Check Logs")
                    }
                }
            }
        }

        async function createProjectIfNotExists(requestBody: any) {
            const projectBody: any = {
                RequestInfo: requestBody.RequestInfo,
                Projects: []
            }
            const { projectType, tenantId } = requestBody?.Campaign

            for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
                var { startDate, endDate, isTaskEnabled = true, documents = [], rowVersion = 0 } = campaignDetails;
                startDate = parseInt(startDate);
                endDate = parseInt(endDate);
                projectBody.Projects.push({
                    tenantId, projectType, startDate, endDate, isTaskEnabled, documents, rowVersion
                })
            }

            const projectCreateUrl = `${config.host.projectHost}` + `${config.paths.projectCreate}`
            logger.info("Project Creation url " + projectCreateUrl)
            logger.info("Project Creation body " + JSON.stringify(projectBody))
            const projectResponse = await httpRequest(projectCreateUrl, projectBody, undefined, "post", undefined, undefined);
            logger.info("Project Creation response" + JSON.stringify(projectResponse))
            validatedProjectResponse(projectResponse, projectBody);
        }
        try {
            await validateCampaignRequest(request.body)
            await createProjectIfNotExists(request.body)
            return sendResponse(response, {}, request);
        }
        catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "error": error.message }, request);
        }
    };
};
export default campaignManageController;



