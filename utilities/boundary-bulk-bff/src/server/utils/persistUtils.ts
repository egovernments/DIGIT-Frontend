import { boundaryStatus } from '../config/constants';
import config from '../config';
import { produceModifiedMessages } from '../kafka/Producer';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';

export function processAndPersist(request: any) {
    const currentTime = Date.now();
    const boundaryDetails = {
        ...request?.body?.boundaryDetails,
        status: boundaryStatus.completed,
        auditDetails: {
            ...request?.body?.boundaryDetails?.auditDetails,
            lastModifiedTime: currentTime,
            lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid || null
        }
    };
    const producedMessage: any = {
        boundaryDetails
    };
    produceModifiedMessages(producedMessage, config.kafka.KAFKA_UPDATE_BOUNDARY_DETAILS_TOPIC);
}

export function enrichAndPersistBoundaryDetails(request: any) {
    const currentTime = Date.now();
    const boundaryDetails = {
        id: uuidv4(),
        tenantId: request?.query?.tenantId,
        hierarchyType: request?.query?.hierarchyType,
        fileStoreId: request?.query?.fileStoreId,
        status: boundaryStatus.inprogress,
        processedFileStoreId: null,
        additionalDetails: null,
        auditDetails: {
            createdTime: currentTime,
            lastModifiedTime: currentTime,
            createdBy: request?.body?.RequestInfo?.userInfo?.uuid || null,
            lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid || null
        }
    };
    request.body.boundaryDetails = boundaryDetails;
    const producedMessage: any = {
        boundaryDetails
    };
    produceModifiedMessages(producedMessage, config.kafka.KAFKA_SAVE_BOUNDARY_DETAILS_TOPIC);
}

export function persistError(error: any, request: any) {
    const currentTime = Date.now();
    const boundaryDetails = {
        ...request?.body?.boundaryDetails,
        status: boundaryStatus.failed,
        additionalDetails: {
            ...request?.body?.boundaryDetails?.additionalDetails,
            errorDetails: String((error?.message + (error?.description ? ` : ${error?.description}` : '')) || error)
        },
        auditDetails: {
            ...request?.body?.boundaryDetails?.auditDetails,
            lastModifiedTime: currentTime,
            lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid || null
        }
    };
    request.body.boundaryDetails = boundaryDetails;
    const producedMessage: any = {
        boundaryDetails
    };
    produceModifiedMessages(producedMessage, config.kafka.KAFKA_UPDATE_BOUNDARY_DETAILS_TOPIC);
}

export function persistRelationship(request: any, createdCount: number, totalBoundaryCount: number) {
    let logMessage = '';
    let isMultipleOf200 = false;
    let isCompletion = false;

    if (createdCount % 200 === 0) {
        logMessage = `Reached ${createdCount} boundary relationships created.`;
        isMultipleOf200 = true;
    } else if (createdCount === totalBoundaryCount) {
        logMessage = `All ${totalBoundaryCount} boundary relationships created.`;
        isCompletion = true;
    }

    logger.info(logMessage);
    const boundaryDetails = {
        ...request.body.boundaryDetails,
        auditDetails: {
            ...request.body.boundaryDetails?.auditDetails,
            lastModifiedTime: Date.now(),
            lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid || null
        },
        additionalDetails: {
            ...request.body.boundaryDetails?.additionalDetails,
            createdRelationshipCount: createdCount,
            totalRelationshipCount: totalBoundaryCount
        }
    }
    request.body.boundaryDetails = boundaryDetails;
    const produceMessage: any = {
        boundaryDetails
    };
    if (isMultipleOf200 || isCompletion) {
        produceModifiedMessages(produceMessage, config.kafka.KAFKA_UPDATE_BOUNDARY_DETAILS_TOPIC);
    }
}

export function persistEntityCreate(request: any, createdCount: number, totalBoundaryCount: number) {
    let logMessage = '';
    if (createdCount === totalBoundaryCount) {
        logMessage = `All ${totalBoundaryCount} boundary entity created.`;
    }
    else {
        logMessage = `Reached ${createdCount} boundary entity created.`
    }

    logger.info(logMessage);
    const boundaryDetails = {
        ...request.body.boundaryDetails,
        auditDetails: {
            ...request.body.boundaryDetails?.auditDetails,
            lastModifiedTime: Date.now(),
            lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid || null
        },
        additionalDetails: {
            ...request.body.boundaryDetails?.additionalDetails,
            createdEntityCount: createdCount,
            totalEntityCount: totalBoundaryCount
        }
    }
    request.body.boundaryDetails = boundaryDetails;
    const produceMessage: any = {
        boundaryDetails
    };
    produceModifiedMessages(produceMessage, config.kafka.KAFKA_UPDATE_BOUNDARY_DETAILS_TOPIC);
}
