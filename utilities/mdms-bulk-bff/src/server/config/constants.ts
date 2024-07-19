import Error from "./error.interface"


export const mdmsProcessStatus = {
    inprogress: "inprogress",
    failed: "failed",
    completed: "completed",
    invalid: "invalid",
    partiallyFailed: "partiallyFailed"
}

export const sheetDataStatus = {
    invalid: "INVALID",
    created: "CREATED",
    failed: "FAILED"
}

export const CONSTANTS = {
    ERROR_CODES: {
        COMMON: {
            UNKNOWN_ERROR: "Unknown error. Check logs",
            IDGEN_ERROR: "Error during generating campaign number",
            VALIDATION_ERROR: "Validation error",
            INTERNAL_SERVER_ERROR: "Internal server error",
            INVALID_PAGINATION: "Invalid pagination",
            KAFKA_ERROR: "Some error occured in kafka",
            SCHEMA_ERROR: " Schema related error",
            RESPONSE_NOT_FOUND_ERROR: "Response not found",
            GENERATE_ERROR: "Error while generating user/facility/boundary"
        },
        FILE: {
            INVALID_FILE: "No download URL returned for the given fileStoreId",
            INVALID_SHEETNAME: "Invalid sheet name",
            STATUS_FILE_CREATION_ERROR: "Error in creating status file",
            FETCHING_SHEET_ERROR: "Error occured while fetching sheet data",
            INVALID_FILE_ERROR: "Invalid file",
            DOWNLOAD_URL_NOT_FOUND: "Not any download URL returned for the given fileStoreId",
            INVALID_FILE_FORMAT: "The uploaded file is not a valid excel file (xlsx or xls).",
            INVALID_COLUMNS: "Columns are invalid",
            FETCHING_COLUMN_ERROR: "Error fetching Column Headers From Schema",
            FILE_CREATION_ERROR: "Error in creating file"
        },
        MDMS: {
            INVALID_README_CONFIG: "Invalid readme config",
            MDMS_DATA_NOT_FOUND_ERROR: "Mdms Data not present",
            INVALID_MDMS_SCHEMA: "Invalid mdms schema"
        }
    }
}


const unknownError = "Unknown Error. Check Logs";


//  Retrieves the error message associated with the given error key.
const getMessage = (key: any) => {
    // Retrieve the error codes from the CONSTANTS object
    const errors: any = CONSTANTS.ERROR_CODES;

    // Iterate over each module and error key to find the matching error message
    for (const moduleKey in errors) {
        for (const errorKey in errors[moduleKey]) {
            if (key === errorKey) {
                return errors[moduleKey][errorKey];
            }
        }
    }

    // Return 'unknownError' if the error key is not found
    return unknownError;
}


// Retrieves the error object containing the error code, message, and notFound flag.
export const getErrorCodes = (module: string, key: string): Error => {
    // Retrieve the error message from the CONSTANTS object
    const constants: any = CONSTANTS;
    const message = constants?.ERROR_CODES?.[module]?.[key] || getMessage(key)

    // Determine the error code based on whether the message is 'unknownError' or not
    const code = message == unknownError ? "UNKNOWN_ERROR" : key

    // Return the error object
    return {
        code: code,
        notFound: true,
        message: message
    }
}
