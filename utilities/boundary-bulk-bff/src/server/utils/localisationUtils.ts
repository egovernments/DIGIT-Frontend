import config from "../config";
import { logger } from "./logger";
import { httpRequest } from "./request";


export const getLocaleFromRequest = (request: any) => {
    // Extract msgId from request body
    const msgId = request?.body?.RequestInfo?.msgId;
    // Split msgId by '|' delimiter and get the second part (index 1)
    // If splitting fails or no second part is found, use default locale from config
    return msgId.split("|")?.[1] || config?.localisation?.defaultLocale;
};

async function fetchLocalisationMessage(
    module: string,
    locale: string,
    tenantId: string
) {
    logger.info(
        `Received Localisation fetch for module ${module}, locale ${locale}, tenantId ${tenantId}`
    );
    const params = {
        tenantId,
        locale,
        module,
    };
    const url = config.host.localizationHost + config.paths.localizationSearch;
    const localisationResponse = await httpRequest(url, {}, params);
    logger.info(
        `Fetched Localisation Message for module ${module}, locale ${locale}, tenantId ${tenantId} with count ${localisationResponse?.messages?.length}`
    );
    return localisationResponse;
};

export const convertLocalisationResponseToMap = (messages: any = []) => {
    const localizationMap: any = {};
    messages.forEach((message: any) => {
        localizationMap[message.code] = message.message;
    });
    return localizationMap;
}

export async function getLocalizedMessagesHandler(request: any, tenantId: any, module = config.localisation.localizationModule) {
    const locale = getLocaleFromRequest(request);
    const localizationResponse: any = await fetchLocalisationMessage(module, locale, tenantId);
    const convertedMessages = convertLocalisationResponseToMap(localizationResponse?.messages)
    return convertedMessages;
}

export function getLocalizedName(expectedName: string, localizationMap?: { [key: string]: string }) {
    if (!localizationMap || !(expectedName in localizationMap)) {
        return expectedName;
    }
    const localizedName = localizationMap[expectedName];
    return localizedName;
}

export function getLocalizedHeaders(headers: any, localizationMap?: { [key: string]: string }) {
    const messages = headers.map((header: any) => (localizationMap ? localizationMap[header] || header : header));
    return messages;
}

export const getTransformedLocale = (label: string) => {
    // Trim leading and trailing whitespace from the label
    label = label?.trim();
    // If label is not empty, convert to uppercase and replace special characters with underscores
    return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};


export const getLocalisationModuleName = (hierarchyType: any) => {
    // Construct module name using boundary prefix from config and hierarchy type
    // Convert module name to lowercase
    return `${config.localisation.boundaryPrefix}-${getTransformedLocale(hierarchyType)}`?.toLowerCase();
};

export async function createLocalisation(
    messages: any[] = [],
    tenantId: string,
    request: any = {}
) {
    try {
        // Extract RequestInfo from request body
        const { RequestInfo } = request.body;
        // Construct request body with RequestInfo and localisation messages
        const requestBody = { RequestInfo, messages, tenantId };
        // Construct URL for localization create endpoint
        const url =
            config.host.localizationHost + config.paths.localizationCreate;
        // Log the start of the localisation messages creation process
        logger.info("Creating the localisation messages");
        // Send HTTP POST request to create localisation messages

        await httpRequest(url, requestBody);
        // Log the completion of the localisation messages creation process
        logger.info("Localisation messages created successfully");
    } catch (e: any) {
        // Log and handle any errors that occur during the process
        console.log(e);
        logger.error(String(e));
    }
};

export async function transformAndCreateLocalisation(
    boundaryMap: any,
    request: any
) {
    logger.info("transforming localisation messages from the boundary map")
    const { tenantId, hierarchyType } = request?.query || {};

    // Get localisation module name based on hierarchy type
    const module = getLocalisationModuleName(hierarchyType);

    // Get locale from request object
    const locale = getLocaleFromRequest(request);

    // Array to store localisation messages
    const localisationMessages: any = [];
    // Iterate over boundary map to transform into localisation messagess
    boundaryMap.forEach((code: string, boundary: any) => {    // Add transformed message to localisation messages array
        logger.info(`Adding message for code ${code} and boundary ${boundary.value}`)
        localisationMessages.push({
            code,
            message: boundary.value,
            module,
            locale,
        });

    })

    logger.info("localisation message transformed successfully from the boundary map")

    // Call method to create localisation entries
    await createLocalisation(localisationMessages, tenantId, request);
};
