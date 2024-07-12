import { getErrorCodes } from "../config";
import { logger } from "./logger";


export function capitalizeFirstLetter(str: string | undefined) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const throwError = (module = "COMMON", status = 500, code = "UNKNOWN_ERROR", description: any = null) => {
    const errorResult: any = getErrorCodes(module, code);
    status = errorResult?.code == "UNKNOWN_ERROR" ? 500 : status;
    let error: any = new Error(capitalizeFirstLetter(errorResult?.message));
    error = Object.assign(error, { status, code: errorResult?.code, description: capitalizeFirstLetter(description) });
    logger.error(error);
    throw error;
};