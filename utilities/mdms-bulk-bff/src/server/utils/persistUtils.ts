import { v4 as uuidv4 } from 'uuid';
import { mdmsProcessStatus } from '../config/constants';
import config from '../config';
import { produceModifiedMessages } from '../kafka/Producer';

export function enrichAndPersistMDMSDetails(request: any) {
    const currentTime = Date.now();
    const mdmsDetails = {
        id: uuidv4(),
        tenantId: request?.query?.tenantId,
        schemaCode: request?.query?.schemaCode,
        fileStoreId: request?.query?.fileStoreId,
        status: mdmsProcessStatus.inprogress,
        processedFileStoreId: null,
        additionalDetails: null,
        auditDetails: {
            createdTime: currentTime,
            lastModifiedTime: currentTime,
            createdBy: request?.body?.RequestInfo?.userInfo?.uuid || null,
            lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid || null
        }
    };
    request.body.mdmsDetails = mdmsDetails;
    const producedMessage: any = {
        mdmsDetails
    };
    produceModifiedMessages(producedMessage, config.kafka.KAFKA_SAVE_MDMS_DETAILS_TOPIC);
}

export function persistDetailsOnCompletion(request: any) {
    const currentTime = Date.now();
    const mdmsDetails = request?.body?.mdmsDetails;
    mdmsDetails.auditDetails.lastModifiedTime = currentTime;
    const producedMessage: any = {
        mdmsDetails
    };
    produceModifiedMessages(producedMessage, config.kafka.KAFKA_UPDATE_MDMS_DETAILS_TOPIC);
}
