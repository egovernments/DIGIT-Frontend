

export const transformMeasurementData = async (mbNumber) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();

    try {

        const pagination = {
            "pagination": {
                "limit": 10,
                "offSet": 0,
                "sortBy": "string",
                "order": "DESC"
            }
        }
        const criteria = {
            "criteria": {
                tenantId: tenantId,
                // referenceId : [workOrderNumber],
                measurementNumber: mbNumber
            },
            ...pagination
        }

        // Make a search request using MeasurementService
        const measurementResponse = await Digit.MeasurementService.search(criteria, tenantId);
        // Check if the response is valid and contains data
        if (measurementResponse && measurementResponse.measurements) {
            // Perform your data transformation here
            const transformedData = transformData(measurementResponse);

            return transformedData;
        } else {
            console.error(t("MB_ERROR_INV_EMP"));
        }
    } catch (error) {
        console.error(t("MB_ERROR_FET_TRANF") , error);
    }
};