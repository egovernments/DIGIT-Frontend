import * as express from "express";
import { logger } from "../../utils/logger";
import { validateCreateRequest, validateGenerateRequest } from "../../utils/validator";
import { enrichResourceDetails, errorResponder, generateProcessedFileAndPersist, processGenerate, sendResponse, modifyBoundaryData, getChildParentMap, getBoundaryTypeMap, addBoundaryCodeToData, prepareDataForExcel } from "../../utils/index";
import { createAndUploadFile, processGenericRequest, createBoundaryEntities, createBoundaryRelationship, createExcelSheet, getBoundaryCodesHandler, getBoundarySheetData, getHierarchy, getSheetData } from "../../api/index";
import config from "../../../server/config/index";
import { httpRequest } from "../../../server/utils/request";








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
        this.router.post(`${this.path}/_getboundarysheet`, this.getBoundaryData);
        this.router.post(`${this.path}/_autoGenerateBoundaryCode`, this.autoGenerateBoundaryCodes);
        this.router.post(`${this.path}/_create`, this.createData);
    }


    generateData = async (request: express.Request, response: express.Response) => {
        try {
            validateGenerateRequest(request);
            await processGenerate(request, response);
            return sendResponse(response, { GeneratedResource: request?.body?.generatedResource }, request);

        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
        }
    };


    getBoundaryData = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const boundarySheetData: any = await getBoundarySheetData(request);
            const BoundaryFileDetails: any = await createAndUploadFile(boundarySheetData?.wb, request);
            return BoundaryFileDetails;
        }
        catch (error: any) {
            logger.error(String(error));
            return errorResponder({ message: String(error) + "    Check Logs" }, request, response);
        }
    };

    autoGenerateBoundaryCodes = async (request: any, response: any) => {
        try {
            const fileResponse = await httpRequest(config.host.filestore + config.paths.filestore + "/url", {}, { tenantId: request?.body?.ResourceDetails?.tenantId, fileStoreIds: request?.body?.ResourceDetails?.fileStoreId }, "get");
            if (!fileResponse?.fileStoreIds?.[0]?.url) {
                throw new Error("Invalid file");
            }
            const boundaryData = await getSheetData(fileResponse?.fileStoreIds?.[0]?.url, "Sheet1");
            console.log(boundaryData, "plssssssssss")
            const modifiedBoundaryData = modifyBoundaryData(boundaryData);
            console.log(modifiedBoundaryData, "outttttttttttttt")
            const childParentMap = getChildParentMap(modifiedBoundaryData);
            console.log(childParentMap, "chillllllldddddddddddd")
            const boundaryMap = await getBoundaryCodesHandler(modifiedBoundaryData, childParentMap);
            console.log(boundaryMap, "mappppppppppppppppppppp")
            const boundaryTypeMap = getBoundaryTypeMap(boundaryData, boundaryMap);
            console.log(boundaryTypeMap, "mmmmmmmmmmmmmmmmm")
            await createBoundaryEntities(request, boundaryMap);

            const modifiedMap: Map<string, string | null> = new Map();

            childParentMap.forEach((value, key) => {
                const modifiedKey = boundaryMap.get(key);
                const modifiedValue = boundaryMap.get(value);
                modifiedMap.set(modifiedKey, modifiedValue);
            });

            await createBoundaryRelationship(request, boundaryTypeMap, modifiedMap);
            console.log("Boundary relationship createddddddddddddddddddddddddddddddd");
            const boundaryDataForSheet = addBoundaryCodeToData(modifiedBoundaryData, boundaryMap);
            console.log(boundaryDataForSheet, "ooooooooooooooooooooo");
            const hierarchy = await getHierarchy(request, request?.body?.ResourceDetails?.tenantId, request?.body?.ResourceDetails?.hierarchyType);
            console.log(hierarchy, "hhhhhhhhhhhhhh")
            const headers = [...hierarchy, "Boundary Code", "Target at the Selected Boundary level", "Start Date of Campaign (Optional Field)", "End Date of Campaign (Optional Field)"];
            const data = prepareDataForExcel(boundaryDataForSheet, hierarchy, boundaryMap);
            console.log(data, "dataaaaaaaaaaaaaaaaaaa")
            const boundarySheetData = await createExcelSheet(data, headers);
            const BoundaryFileDetails: any = await createAndUploadFile(boundarySheetData?.wb, request);
            return sendResponse(response, { BoundaryFileDetails: BoundaryFileDetails }, request);
        }
        catch (error) {
            return errorResponder({ message: String(error) + "    Check Logs" }, request, response);
        }
    }

    createData = async (request: any, response: any) => {
        try {
            await validateCreateRequest(request);
            await processGenericRequest(request);
            await enrichResourceDetails(request);
            await generateProcessedFileAndPersist(request);
            return sendResponse(response, { ResourceDetails: request?.body?.ResourceDetails }, request);
        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
        }
    }

};
export default dataManageController;



