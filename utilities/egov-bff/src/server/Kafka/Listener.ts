import { ConsumerGroup, ConsumerGroupOptions } from 'kafka-node';
import { logger } from '../utils/logger';
import { producer } from './Producer';
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

// Log that the Kafka consumer is attempting to connect
logger.info('Kafka consumer is attempting to connect...');

// Create a Kafka consumer
const consumerGroup = new ConsumerGroup(kafkaConfig, [topicName]);


// Exported listener function
function listener() {

    // Set up a message event handler
    // consumerGroup.on('message', async (message: Message) => {
    //     try {
    //         // // Parse the message value as an array of objects
    //         // const messageObject: any = JSON.parse(message.value?.toString() || '{}');
    //         // const ingestionDetails: any[] = messageObject?.Job?.ingestionDetails;
    //         // logger.info("IngestionDetails received:" + JSON.stringify(ingestionDetails));


    //         // // Find the first message with state 'inprogress'
    //         // const inProgressIndex = ingestionDetails.findIndex((msg) => msg.state === 'inprogress');

    //         // // Find the first message with state 'not-started'
    //         // const notStartedIndex = ingestionDetails.findIndex((msg) => msg.state === 'not-started');

    //         // if (inProgressIndex !== -1) {
    //         //     // Change 'inprogress' to 'done'
    //         //     ingestionDetails[inProgressIndex].state = 'done';

    //         //     // Log the modified message
    //         //     logger.info(`Modified message: ${JSON.stringify(ingestionDetails[inProgressIndex])}`);
    //         //     messageObject.Job.ingestionDetails = ingestionDetails;

    //         //     // Produce the modified messages back to the same topic
    //         //     await produceModifiedMessages(messageObject);
    //         // } else if (notStartedIndex !== -1) {
    //         //     // Change 'not-started' to 'inprogress'
    //         //     ingestionDetails[notStartedIndex].state = 'inprogress';

    //         //     // Log the modified message
    //         //     logger.info(`Modified message: ${JSON.stringify(ingestionDetails[notStartedIndex])}`);

    //         //     // Produce the modified messages back to the same topic
    //         //     messageObject.Job.ingestionDetails = ingestionDetails;
    //         //     await produceModifiedMessages(messageObject);
    //         // } else {
    //         //     // Log a message if no 'inprogress' or 'not-started' state is found
    //         //     logger.info('No message with state "inprogress" or "not-started" found.');
    //         // }
    //     } catch (error) {
    //         logger.info(`Error processing message: ${JSON.stringify(error)}`);
    //     }
    // });

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
