import axios from 'axios';
import * as XLSX from 'xlsx';
import { baseTimeOut } from '../configs/baseTimeOut';
export const useProcessData = async (data, hierarchyType, type, tenantId, id, baseTimeOut, additionalDetails = {}) => {
    let Error = {
        isError: false,
        error: {},
    };
    let response;
    try {
        // For unified-console-validation, use different API and referenceId instead of campaignId
        const isUnifiedConsole = type === "unified-console-validation";
        const resourceDetails = {
            type,
            hierarchyType: hierarchyType,
            tenantId: Digit.ULBService.getCurrentTenantId(),
            fileStoreId: data?.[0]?.filestoreId,
            additionalDetails: additionalDetails,
        };

        if (isUnifiedConsole) {
            resourceDetails.referenceId = id;
            resourceDetails.locale = Digit?.Utils?.getDefaultLanguage();
            resourceDetails.referenceType = "campaign"
        } else {
            resourceDetails.campaignId = id;
        }

        const apiUrl = isUnifiedConsole
            ? "/excel-ingestion/v1/data/process/_validation"
            : "/project-factory/v2/data/_process";

        const responseTemp = await Digit.CustomService.getResponse({
            url: apiUrl,
            body: {
                ResourceDetails: resourceDetails,
            },
        });
        response = responseTemp;

    } catch (error) {
        if (error?.response && error?.response?.data) {
            const errorMessage = error?.response?.data?.Errors?.[0]?.message;
            const errorDescription = error?.response?.data?.Errors?.[0]?.description;
            if (errorDescription) {
                Error.error = `${errorMessage} : ${errorDescription}`;
                Error.isError = true;
                return Error;
            } else {
                Error = { error: String(error.message) };
                Error.isError = true;
                return Error;
            }
        }
    }

    let searchResponse;
    let status = "inprogress";
    const baseDelay = baseTimeOut?.baseTimeout?.[0]?.baseTimeOut;
    const maxTime = baseTimeOut?.baseTimeout?.[0]?.maxTime;
    let retryInterval = 2000;

    // For unified-console, use different search API and response structure
    const isUnifiedConsole = type === "unified-console-validation";
    const searchUrl = isUnifiedConsole
        ? "/excel-ingestion/v1/data/process/_search"
        : "/project-factory/v1/data/_search";

    // Get the ID from the response - different field for unified-console
    const processId = isUnifiedConsole
        ? response?.ProcessResource?.id
        : response?.ResourceDetails?.id;

    await new Promise((resolve) => setTimeout(resolve, retryInterval));

    // Retry until a response is received
    // For unified-console, status can be "pending" instead of "inprogress"
    const isStatusPending = (s) => s === "inprogress" || s === "pending";

    while (isStatusPending(status)) {
        try {
            if (isUnifiedConsole) {
                searchResponse = await Digit.CustomService.getResponse({
                    url: searchUrl,
                    body: {
                        ProcessingSearchCriteria: {
                            tenantId: tenantId,
                            ids: [processId],
                            limit: 5,
                            offset: 0,
                        },
                    },
                });
                status = searchResponse?.ProcessingDetails?.[0]?.status;
            } else {
                searchResponse = await Digit.CustomService.getResponse({
                    url: searchUrl,
                    body: {
                        SearchCriteria: {
                            id: [processId],
                            tenantId: tenantId,
                            type,
                        },
                    },
                });
                status = searchResponse?.ResourceDetails?.[0]?.status;
            }

            if (isStatusPending(status)) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
            }
            else if(!status){
                status = "inprogress";
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
            }
        } catch (error) {
            console.error("Error while fetching data:", error);
        }
    }
    if (Error.isError) {
        return Error;
    }
    return isUnifiedConsole
        ? searchResponse?.ProcessingDetails?.[0]
        : searchResponse?.ResourceDetails?.[0];
};
