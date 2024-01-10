import { KafkaClient, Consumer, Message, ProduceRequest } from 'kafka-node';
import { logger } from '../utils/logger';
import { producer } from './Producer';
import config from '../config';

const kafkaConfig = {
    // connect directly to kafka broker (instantiates a KafkaClient)
    kafkaHost: config.KAFKA_BROKER_HOST,
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    sessionTimeout: 15000,
    fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
    // An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
    // built ins (see below to pass in custom assignment protocol)
    protocol: ["roundrobin"],
    // Offsets to use for new groups other options could be 'earliest' or 'none'
    // (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
    fromOffset: "latest",
    // how to recover from OutOfRangeOffset error (where save offset is past server retention)
    // accepts same value as fromOffset
    outOfRangeOffset: "earliest"
};

const topicName = config.KAFKA_DHIS_UPDATE_TOPIC;

// Create a Kafka client
const kafkaClient = new KafkaClient(kafkaConfig);

// Create a Kafka consumer
const consumer = new Consumer(kafkaClient, [{ topic: topicName }], { autoCommit: true });


// Exported listener function
export function listener() {
    // Set up a message event handler
    consumer.on('message', async (message: Message) => {
        try {
            // Parse the message value as an array of objects
            const messageObject: any = JSON.parse(message.value?.toString() || '{}');
            const ingestionDetails: any[] = messageObject?.Job?.ingestionDetails;
            logger.info("IngestionDetails received:" + JSON.stringify(ingestionDetails));


            // Find the first message with state 'inprogress'
            const inProgressIndex = ingestionDetails.findIndex((msg) => msg.state === 'inprogress');

            // Find the first message with state 'not-started'
            const notStartedIndex = ingestionDetails.findIndex((msg) => msg.state === 'not-started');

            if (inProgressIndex !== -1) {
                // Change 'inprogress' to 'done'
                ingestionDetails[inProgressIndex].state = 'done';

                // Log the modified message
                logger.info(`Modified message: ${JSON.stringify(ingestionDetails[inProgressIndex])}`);
                messageObject.Job.ingestionDetails = ingestionDetails;

                // Produce the modified messages back to the same topic
                await produceModifiedMessages(messageObject);
            } else if (notStartedIndex !== -1) {
                // Change 'not-started' to 'inprogress'
                ingestionDetails[notStartedIndex].state = 'inprogress';

                // Log the modified message
                logger.info(`Modified message: ${JSON.stringify(ingestionDetails[notStartedIndex])}`);

                // Produce the modified messages back to the same topic
                messageObject.Job.ingestionDetails = ingestionDetails;
                await produceModifiedMessages(messageObject);
            } else {
                // Log a message if no 'inprogress' or 'not-started' state is found
                logger.info('No message with state "inprogress" or "not-started" found.');
            }
        } catch (error) {
            logger.info(`Error processing message: ${JSON.stringify(error)}`);
        }
    });

    // Set up error event handlers
    consumer.on('error', (err) => {
        logger.info(`Consumer Error: ${JSON.stringify(err)}`);
    });

    consumer.on('offsetOutOfRange', (err) => {
        logger.info(`Offset out of range error: ${JSON.stringify(err)}`);
    });
}

// Function to produce modified messages back to the same topic
async function produceModifiedMessages(modifiedMessages: any[]) {
    return new Promise<void>((resolve, reject) => {
        const payloads: ProduceRequest[] = [
            {
                topic: topicName,
                messages: JSON.stringify(modifiedMessages),
            },
        ];

        producer.send(payloads, (err, data) => {
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

// Gracefully disconnect from the Kafka broker when the process is terminated
process.on('SIGINT', () => {
    logger.info('Disconnecting from Kafka...');
    consumer.close(true, () => {
        producer.close(() => {
            process.exit();
        });
    });
});

// Keep the process running to allow the consumer to receive messages
process.stdin.resume();
