import * as express from "express";
import { createCampaignService, createProjectTypeCampaignService, searchProjectTypeCampaignService, updateProjectTypeCampaignService } from "../../service/campaignManageService";



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
        this.router.post(`${this.path}/update`, this.updateProjectTypeCampaign);
        this.router.post(`${this.path}/search`, this.searchProjectTypeCampaign);
        this.router.post(`${this.path}/createCampaign`, this.createCampaign);
    }
    /**
 * Handles the creation of a project type campaign.
 * @param request The Express request object.
 * @param response The Express response object.
 */
    createProjectTypeCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {
        return await createProjectTypeCampaignService(request, response);
    };

    /**
     * Handles the update of a project type campaign.
     * @param request The Express request object.
     * @param response The Express response object.
     */
    updateProjectTypeCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {
        return await updateProjectTypeCampaignService(request, response);
    };

    /**
     * Handles the search for project type campaigns.
     * @param request The Express request object.
     * @param response The Express response object.
     */
    searchProjectTypeCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {
        return await searchProjectTypeCampaignService(request, response);
    };

    /**
     * Handles the creation of a campaign.
     * @param request The Express request object.
     * @param response The Express response object.
     */
    createCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {
        return await createCampaignService(request, response);
    };

};
export default campaignManageController;



