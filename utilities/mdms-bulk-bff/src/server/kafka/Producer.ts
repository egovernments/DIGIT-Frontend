import config from '../config'; // Importing configuration settings
import { Producer, KafkaClient } from 'kafka-node'; // Importing Producer and KafkaClient from 'kafka-node' library
import { getFormattedStringForDebug, logger } from "../utils/logger";
import { shutdownGracefully } from '../utils/genericUtils';
import { throwError } from '../utils/errorUtils';

// Creating a new Kafka client instance using the configured Kafka broker host
const kafkaClient = new KafkaClient({
    kafkaHost: config?.host?.KAFKA_BROKER_HOST, // Configuring Kafka broker host
    connectRetryOptions: { retries: 1 }, // Configuring connection retry options
});

// Creating a new Kafka producer instance using the Kafka client
const producer = new Producer(kafkaClient, { partitionerType: 2 }); // Using partitioner type 2

// Event listener for 'ready' event, indicating that the producer is ready to send messages
producer.on('ready', () => {
    logger.info('Producer is ready'); // Log message indicating producer is ready
});

// Event listener for 'error' event, indicating that the producer encountered an error
producer.on('error', (err) => {
    logger.error('Producer is in error state'); // Log message indicating producer is in error state
    console.error(err.stack || err); // Log the error stack or message
    shutdownGracefully();
});


async function produceModifiedMessages(modifiedMessages: any[], topic: any) {
    try {
        logger.info(`KAFKA :: PRODUCER :: a message sent to topic ${topic}`);
        logger.debug(`KAFKA :: PRODUCER :: message ${getFormattedStringForDebug(modifiedMessages)}`);
        const payloads = [
            {
                topic: topic,
                messages: JSON.stringify(modifiedMessages), // Convert modified messages to JSON string
            },
        ];

        // Send payloads to the Kafka producer
        producer.send(payloads, (err: any) => {
            if (err) {
                logger.info('KAFKA :: PRODUCER :: Some Error Occurred ');
                logger.error(`KAFKA :: PRODUCER :: Error :  ${JSON.stringify(err)}`);
            } else {
                logger.info('KAFKA :: PRODUCER :: message sent successfully ');
            }
        });
    } catch (error) {
        logger.error(`KAFKA :: PRODUCER :: Exception caught: ${JSON.stringify(error)}`);
        throwError("COMMON", 400, "KAKFA_ERROR", "Some error occured in kafka"); // Re-throw the error after logging it
    }
}

export { producer, produceModifiedMessages }; // Exporting the producer instance for external use
