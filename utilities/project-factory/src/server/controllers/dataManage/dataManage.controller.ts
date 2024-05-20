import * as express from "express";
import { createDataService, downloadDataService, generateDataService, getBoundaryDataService, searchDataService } from "../../service/dataManageService";

// Define the MeasurementController class
class dataManageController {
    // Define class properties
    public path = "/v1/data";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/_generate`, this.generateData);
        this.router.post(`${this.path}/_download`, this.downloadData)
        this.router.post(`${this.path}/_getboundarysheet`, this.getBoundaryData);
        this.router.post(`${this.path}/_create`, this.createData);
        this.router.post(`${this.path}/_search`, this.searchData);
    }
    /**
* Generates data based on the request and sends the response.
* @param request The Express request object.
* @param response The Express response object.
*/
    generateData = async (request: express.Request, response: express.Response) => {
        return await generateDataService(request, response);
    };

    /**
    * Downloads data based on the request and sends the response.
    * @param request The Express request object.
    * @param response The Express response object.
    */
    downloadData = async (request: express.Request, response: express.Response) => {
        return await downloadDataService(request, response);
    }

    /**
     * Retrieves boundary data based on the request.
     * @param request The Express request object.
     * @param response The Express response object.
     */
    getBoundaryData = async (
        request: express.Request,
        response: express.Response
    ) => {
        return await getBoundaryDataService(request, response);
    };

    /**
   * Creates data based on the request and sends the response.
   * @param request The Express request object.
   * @param response The Express response object.
   */
    createData = async (request: any, response: any) => {
        return await createDataService(request, response);
    }

    /**
         * Searches for data based on the request and sends the response.
         * @param request The Express request object.
         * @param response The Express response object.
         */
    searchData = async (request: any, response: any) => {
        return await searchDataService(request, response);
    }

};
export default dataManageController;



