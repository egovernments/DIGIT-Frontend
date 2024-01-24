import { ConsumerGroup, ConsumerGroupOptions, Message } from 'kafka-node';
import { logger } from '../utils/logger';
import { producer } from './Producer';
import { produceIngestion } from '../utils';
import config from '../config';

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

const topicName = config.KAFKA_DHIS_UPDATE_TOPIC;
const delayTime: any = config.delayTime;


// Log that the Kafka consumer is attempting to connect
logger.info('Kafka consumer is attempting to connect...');

// Create a Kafka consumer
const consumerGroup = new ConsumerGroup(kafkaConfig, [topicName]);


// Exported listener function
function listener() {

    // Set up a message event handler
    consumerGroup.on('message', async (message: Message) => {
        try {
            // Parse the message value as an array of objects
            const messageObject: any = JSON.parse(message.value?.toString() || '{}');
            logger.info("IngestionDetails received:" + JSON.stringify(messageObject?.Job?.ingestionDetails?.history));
            if (messageObject?.Job?.executionStatus === "Completed") {
                if (messageObject?.Job?.ingestionDetails?.history && messageObject?.Job?.ingestionDetails?.userInfo) {
                    const startedIngestion = messageObject?.Job?.ingestionDetails?.history.find(
                        (detail: any) => detail.state === 'started'
                    );

                    if (startedIngestion) {
                        startedIngestion.state = 'Completed';
                        logger.info("Marked 'started' ingestion as 'Completed'.");
                        logger.info("Waiting for " + config.delayTime + " miliSeconds");
                        await new Promise(resolve => setTimeout(resolve, parseInt(delayTime, 10)));
                        const updatedJob = await produceIngestion(messageObject);
                        logger.info("Updated Ingestion details : " + JSON.stringify(updatedJob?.ingestionDetails?.history));
                    } else {
                        logger.info("No 'started' ingestion found.");
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
            }
        } catch (error) {
            logger.info(`Error processing message: ${JSON.stringify(error)}`);
        }
    });

    // Set up error event handlers
    consumerGroup.on('error', (err) => {
        logger.info(`Consumer Error: ${JSON.stringify(err)}`);
    });

    consumerGroup.on('offsetOutOfRange', (err) => {
        logger.info(`Offset out of range error: ${JSON.stringify(err)}`);
    });
    consumerGroup.on('connect', () => {
        logger.info('Kafka consumer connected successfully!');
    });

    process.on('SIGINT', () => {
        logger.info('Disconnecting from Kafka...');
        consumerGroup.close(true, () => {
            producer.close(() => {
                process.exit();
            });
        });
    });

    // Keep the process running to allow the consumer to receive messages
    process.stdin.resume();
}

// Function to produce modified messages back to the same topic
// async function produceModifiedMessages(modifiedMessages: any[]) {
//     return new Promise<void>((resolve, reject) => {
//         const payloads: ProduceRequest[] = [
//             {
//                 topic: topicName,
//                 messages: JSON.stringify(modifiedMessages),
//             },
//         ];

//         producer.send(payloads, (err, data) => {
//             if (err) {
//                 logger.info(`Producer Error: ${JSON.stringify(err)}`);
//                 reject(err);
//             } else {
//                 logger.info('Produced modified messages successfully.');
//                 resolve();
//             }
//         });
//     });
// }

export { listener, consumerGroup }
