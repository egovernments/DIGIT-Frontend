import config from './../config';
import { produceModifiedMessages } from '../kafka/Listener';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from './db';

async function getProcessDetails(id: any): Promise<any> {
    const query = `SELECT * FROM ${config?.DB_CONFIG.DB_CAMPAIGN_PROCESS_TABLE_NAME} WHERE id = $1`;
    const values = [id];
    const queryResponse = await executeQuery(query, values);
    if (queryResponse.rows.length === 0) {
        return {
            id: uuidv4(),
            campaignId: id,
            details: {},
            additionalDetails: {},
            createdTime: Date.now(),
            lastModifiedTime: Date.now(),
            isNew: true
        }
    }
    return queryResponse.rows[0]; // Assuming only one row is expected
}

async function persistTrack(
    campaignId: any,
    type: any,
    status: any,
    details?: any,
    additionalDetails?: any
): Promise<void> {
    let processDetails: any;

    if (campaignId) {
        processDetails = await getProcessDetails(campaignId);
        details = { ...processDetails?.details, ...details } || {};
        additionalDetails = { ...processDetails?.additionalDetails, ...additionalDetails } || {};
    }

    const processId = processDetails?.id ? processDetails?.id : uuidv4();
    const createdTime = processDetails?.createdTime ? processDetails?.createdTime : Date.now();
    const lastModifiedTime = Date.now();
    processDetails.lastModifiedTime = processDetails.isNew ? processDetails.lastModifiedTime : lastModifiedTime;

    processDetails = {
        id: processId,
        campaignId,
        type,
        status,
        details,
        additionalDetails,
        createdTime,
        lastModifiedTime
    };

    const produceObject: any = {
        processDetails
    };

    const topic = processDetails.isNew ? config?.kafka?.KAFKA_SAVE_PROCESS_TRACK_TOPIC : config?.kafka?.KAFKA_UPDATE_PROCESS_TRACK_TOPIC;
    produceModifiedMessages(produceObject, topic);
}

export { persistTrack };