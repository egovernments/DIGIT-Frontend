import { ConsumerGroup, ConsumerGroupOptions, Message } from 'kafka-node';
import { logger } from '../utils/logger';
import { producer } from './Producer';
import { produceIngestion } from '../utils';
import config from '../config';
import { getEventHistory } from '../api';
import { handleEventHistoryMessage } from '../utils';

const kafkaConfig: ConsumerGroupOptions = {
    kafkaHost: config.KAFKA_BROKER_HOST,
    groupId: 'your_consumer_group',
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    sessionTimeout: 15000,
    fetchMaxBytes: 10 * 1024 * 1024,
    protocol: ['roundrobin'],
    fromOffset: 'latest',
    outOfRangeOffset: 'earliest',
};

const dhisUpdateTopicName = config.KAFKA_DHIS_UPDATE_TOPIC;
const dhisCreateTopicName = config.KAFKA_DHIS_CREATE_TOPIC;
const updateCampaignTopic = config.KAFKA_UPDATE_CAMPAIGN_DETAILS_TOPIC;
const saveIngestionTopic = config.KAFKA_SAVE_INGESTION_TOPIC;
const updateIngestionTopic = config.KAFKA_UPDATE_INGESTION_TOPIC;
const delayTime: any = config.delayTime;


// Log that the Kafka consumer is attempting to connect
logger.info('Kafka consumer is attempting to connect...');

// Create a Kafka consumer
const consumerGroupUpdate = new ConsumerGroup(kafkaConfig, [dhisUpdateTopicName, dhisCreateTopicName]);


// Exported listener function
function listener() {

    // Set up a message event handler
    consumerGroupUpdate.on('message', async (message: Message) => {
        try {
            // Parse the message value as an array of objects
            const messageObject: any = JSON.parse(message.value?.toString() || '{}');
            if (message?.topic == dhisUpdateTopicName) {
                logger.info("IngestionDetails received:" + JSON.stringify(messageObject?.Job?.ingestionDetails?.history));
                if (messageObject?.Job?.executionStatus === "Completed") {
                    if (messageObject?.Job?.ingestionDetails?.history) {
                        const startedIngestion = messageObject?.Job?.ingestionDetails?.history.find(
                            (detail: any) => detail.state === 'Started'
                        );

                        if (startedIngestion) {
                            startedIngestion.state = 'Completed';
                            logger.info("Marked 'Started' ingestion as 'Completed'.");
                            logger.info("Waiting for " + config.delayTime + " miliSeconds");
                            await new Promise(resolve => setTimeout(resolve, parseInt(delayTime, 10)));
                            const updatedJob = await produceIngestion(messageObject);
                            logger.info("Updated Ingestion details : " + JSON.stringify(updatedJob?.ingestionDetails?.history));


                            const ingestionData = JSON.parse(JSON.stringify(startedIngestion));
                            ingestionData.campaignId = messageObject?.Job?.ingestionDetails?.campaignDetails?.id;
                            ingestionData.ingestionNumber = messageObject?.Job?.ingestionNumber;
                            ingestionData.jobId = messageObject?.Job?.jobID;
                            messageObject.Job.ingestionDetails.ingestionData = ingestionData;
                            logger.info("Updating Ingestion details to Completed, ingestion details : " + JSON.stringify(messageObject?.Job?.ingestionDetails));
                            produceModifiedMessages(messageObject.Job.ingestionDetails, updateIngestionTopic)
                        } else {
                            logger.info("No 'Started' ingestion found.");
                            logger.info("Waiting for " + config.delayTime + " miliSeconds");
                            await new Promise(resolve => setTimeout(resolve, parseInt(delayTime, 10)));
                            const updatedJob = await produceIngestion(messageObject);
                            logger.info("Updated Ingestion details : " + JSON.stringify(updatedJob?.ingestionDetails?.history));
                        }
                    }
                    else {
                        logger.info("Ingestion details not found for Job : " + JSON.stringify(messageObject));
                    }
                }
                else {
                    logger.error("Some error occured in ingesting : " + JSON.stringify(messageObject));
                    messageObject.Job.ingestionDetails.campaignDetails.status = "Failed";
                    messageObject.Job.ingestionDetails.campaignDetails.lastModifiedTime = new Date().getTime();
                    const updateHistory: any = messageObject.Job.ingestionDetails;
                    const jobId = messageObject?.Job?.jobID;
                    const eventHistoryMessage = await getEventHistory(messageObject?.RequestInfo, jobId);
                    handleEventHistoryMessage(messageObject, eventHistoryMessage);
                    logger.info("Updating campaign details  with status failed: " + JSON.stringify(messageObject.Job.ingestionDetails.campaignDetails));
                    produceModifiedMessages(updateHistory, updateCampaignTopic);

                    const startedIngestion = messageObject?.Job?.ingestionDetails?.history.find(
                        (detail: any) => detail.state === 'Started'
                    );

                    if (startedIngestion) {
                        startedIngestion.state = messageObject?.Job?.executionStatus;
                        logger.info("Marked 'Started' ingestion as " + String(messageObject?.Job?.executionStatus));

                        const ingestionData = JSON.parse(JSON.stringify(startedIngestion));
                        ingestionData.campaignId = messageObject?.Job?.ingestionDetails?.campaignDetails?.id;
                        ingestionData.ingestionNumber = messageObject?.Job?.ingestionNumber;
                        ingestionData.jobId = messageObject?.Job?.jobID;
                        messageObject.Job.ingestionDetails.ingestionData = ingestionData;
                        logger.info("Updating Ingestion details : " + JSON.stringify(messageObject?.Job?.ingestionDetails));
                        produceModifiedMessages(messageObject.Job.ingestionDetails, updateIngestionTopic)
                    }
                }
            }
            else if (message?.topic == dhisCreateTopicName) {
                if (messageObject?.Job?.executionStatus === "Started") {
                    if (messageObject?.Job?.ingestionDetails?.history) {
                        const startedIngestion = messageObject?.Job?.ingestionDetails?.history.find(
                            (detail: any) => detail.state === 'Started'
                        );

                        if (startedIngestion) {
                            const ingestionData = JSON.parse(JSON.stringify(startedIngestion));
                            ingestionData.campaignId = messageObject?.Job?.ingestionDetails?.campaignDetails?.id;
                            ingestionData.ingestionNumber = messageObject?.Job?.ingestionNumber;
                            ingestionData.jobId = messageObject?.Job?.jobID;
                            messageObject.Job.ingestionDetails.ingestionData = ingestionData;
                            logger.info("Saving Ingestion details : " + JSON.stringify(messageObject?.Job?.ingestionDetails));
                            produceModifiedMessages(messageObject.Job.ingestionDetails, saveIngestionTopic)
                        }
                    }
                    else {
                        logger.info("Ingestion details not found for Job : " + JSON.stringify(messageObject));
                    }
                }
            }
        } catch (error) {
            logger.info(`Error processing message: ${JSON.stringify(error)}`);
        }
    });

    // Set up error event handlers
    consumerGroupUpdate.on('error', (err) => {
        logger.info(`Consumer Error: ${JSON.stringify(err)}`);
    });

    consumerGroupUpdate.on('offsetOutOfRange', (err) => {
        logger.info(`Offset out of range error: ${JSON.stringify(err)}`);
    });
    consumerGroupUpdate.on('connect', () => {
        logger.info('Kafka consumer connected successfully!');
    });

    process.on('SIGINT', () => {
        logger.info('Disconnecting from Kafka...');
        consumerGroupUpdate.close(true, () => {
            producer.close(() => {
                process.exit();
            });
        });
    });

    // Keep the process running to allow the consumer to receive messages
    process.stdin.resume();
}

// Function to produce modified messages back to the same topic
async function produceModifiedMessages(modifiedMessages: any[], topic: any) {
    return new Promise<void>((resolve, reject) => {
        const payloads = [
            {
                topic: topic,
                messages: JSON.stringify(modifiedMessages),
            },
        ];

        producer.send(payloads, (err) => {
            if (err) {
                logger.info(`Producer Error: ${JSON.stringify(err)}`);
                reject(err);
            } else {
                logger.info('Produced modified messages successfully.');
                resolve();
            }
        });
    });
}

export { listener, consumerGroupUpdate, produceModifiedMessages }
