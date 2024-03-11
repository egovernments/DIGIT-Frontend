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

const dhisUpdateTopicName = config.KAFKA_DHIS_UPDATE_TOPIC;
const dhisCreateTopicName = config.KAFKA_DHIS_CREATE_TOPIC;


// Log that the Kafka consumer is attempting to connect
logger.info('Kafka consumer is attempting to connect...');

// Create a Kafka consumer
const consumerGroupUpdate = new ConsumerGroup(kafkaConfig, [dhisUpdateTopicName, dhisCreateTopicName]);


// Exported listener function
function listener() {

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
