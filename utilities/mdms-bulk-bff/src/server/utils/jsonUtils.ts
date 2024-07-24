import config from "../config";
import { httpRequest } from "./request";
import { throwError } from "./errorUtils";
import FormData from "form-data"; // Import FormData for handling multipart/form-data requests

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