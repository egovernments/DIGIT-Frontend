import config from "../config";
import { httpRequest } from "./request";
import { throwError } from "./errorUtils";
import FormData from "form-data"; // Import FormData for handling multipart/form-data requests
import { logger } from "./logger";
import { dataStatus } from "../config/constants";

export async function createAndUploadJSONFile(
    buffer: Buffer,
    request: any,
    tenantId?: any
) {
    // Create form data for file upload
    const formData = new FormData();
    formData.append("file", buffer, "schema.json"); // Changed to .txt
    formData.append(
        "tenantId",
        tenantId ? tenantId : request?.body?.RequestInfo?.userInfo?.tenantId
    );
    formData.append("module", "HCM-ADMIN-CONSOLE-SERVER");

    // Make HTTP request to upload file
    const fileCreationResult = await httpRequest(
        config.host.filestore + config.paths.filestoreCreate,
        formData,
        undefined,
        undefined,
        undefined,
        {
            "Content-Type": "multipart/form-data",
            "auth-token": request?.body?.RequestInfo?.authToken,
        }
    );

    // Extract response data
    const responseData = fileCreationResult?.files;
    if (!responseData?.[0]?.fileStoreId) {
        throwError("COMMON", 500, "INTERNAL_SERVER_ERROR", "File creation failed");
    }

    return responseData; // Return the response data
}

export const getJsonFromFileURL = async (fileUrl: any) => {
    // Define headers for HTTP request
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    logger.info("Loading JSON file based on fileUrl");

    try {
        // Make HTTP request to retrieve JSON file
        const responseFile = await httpRequest(
            fileUrl,
            null,
            {},
            "get",
            "arraybuffer",
            headers
        );
        logger.info("Received the JSON file response");

        const jsonData = Buffer.from(responseFile).toString('utf-8');
        const jsonObject = JSON.parse(jsonData);

        // Return the parsed JSON data
        return jsonObject;
    } catch (error) {
        logger.error("Error retrieving or parsing JSON file", error);
        throwError(
            "FILE",
            400,
            "INVALID_FILE_ERROR",
            `Failed to retrieve or parse JSON file from "${fileUrl}".`
        );
        return null;
    }
};

export async function addErrorsToJSON(datas: any, errors: any, errorStatus: any) {
    if (errors) {
        for (const data of datas) {
            const indexNumber = data?.["!index#number!"];
            if (errors[indexNumber]) {
                data["!status!"] = errorStatus;
                data["!errors!"] = errors[indexNumber];
                if (errorStatus == dataStatus.created) {
                    delete data["!errors!"];
                }
            } else if (errorStatus != dataStatus.created) {
                delete data["!status!"];
                delete data["!errors!"];
            }
        }
    }
}

export function putIndexNumber(dataToCreate: any) {
    for (let i = 0; i < dataToCreate.length; i++) {
        const data = dataToCreate[i];
        data["!index#number!"] = i;
    }
}

export function removeIndexNumber(dataToCreate: any) {
    for (const data of dataToCreate) {
        delete data["!index#number!"];
    }
}
