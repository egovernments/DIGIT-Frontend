import { v4 as uuidv4 } from 'uuid';
import { mdmsProcessStatus } from '../config/constants';
import config from '../config';

export function enrichAndPersistMDMSDetails(request: any) {
    const currentTime = Date.now();
    const mdmsDetails = {
        id: uuidv4(),
        tenantId: request?.query?.tenantId,
        schemaName: request?.query?.schemaName,
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
    produceModifiedMessages(producedMessage, config.kafka.KAFKA_SAVE_BOUNDARY_DETAILS_TOPIC);
}
