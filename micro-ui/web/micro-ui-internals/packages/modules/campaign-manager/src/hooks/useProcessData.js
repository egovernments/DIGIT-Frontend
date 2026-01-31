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
        const responseTemp = await Digit.CustomService.getResponse({
            url: "/project-factory/v2/data/_process",
            body: {
                ResourceDetails: {
                    type,
                    hierarchyType: hierarchyType,
                    tenantId: Digit.ULBService.getCurrentTenantId(),
                    fileStoreId: data?.[0]?.filestoreId,
                    // action: "validate",
                    campaignId: id,
                    additionalDetails: additionalDetails,
                },
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

    await new Promise((resolve) => setTimeout(resolve, retryInterval));

    // Retry until a response is received
    while (status == "inprogress") {
        try {
            searchResponse = await Digit.CustomService.getResponse({
                url: "/project-factory/v1/data/_search",
                body: {
                    SearchCriteria: {
                        id: [response?.ResourceDetails?.id],
                        tenantId: tenantId,
                        type,
                    },
                },
            });
            status = searchResponse?.ResourceDetails?.[0]?.status;
            if (status == "inprogress") {
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
    return searchResponse?.ResourceDetails?.[0];
};
