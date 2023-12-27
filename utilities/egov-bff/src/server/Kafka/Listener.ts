import { KafkaClient, Consumer, Message, ProduceRequest } from 'kafka-node';
import { producer } from './Producer';
import config from '../config';

// Replace with the correct Kafka broker(s) and topic name
const kafkaConfig = {
    kafkaHost: config.KAFKA_BROKER_HOST, // Use the correct broker address and port
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    fromOffset: 'earliest', // Start reading from the beginning of the topic
};

const topicName = config.KAFKA_DHIS_UPDATE_TOPIC;

// Create a Kafka client
const kafkaClient = new KafkaClient(kafkaConfig);

// Create a Kafka consumer
const consumer = new Consumer(kafkaClient, [{ topic: topicName, partition: 0 }], { autoCommit: true });


// Exported listener function
export function listener() {
    // Set up a message event handler
    consumer.on('message', async (message: Message) => {
        try {
            // Parse the message value as an array of objects
            const messageObject: any = JSON.parse(message.value?.toString() || '{}');
            const ingestionDetails: any[] = messageObject?.Job?.ingestionDetails;
            console.log("IngestionDetails received:", ingestionDetails);

            // Find the first message with state 'inprogress'
            const inProgressIndex = ingestionDetails.findIndex((msg) => msg.state === 'inprogress');

            // Find the first message with state 'not-started'
            const notStartedIndex = ingestionDetails.findIndex((msg) => msg.state === 'not-started');

            if (inProgressIndex !== -1) {
                // Change 'inprogress' to 'done'
                ingestionDetails[inProgressIndex].state = 'done';

                // Log the modified message
                console.log(`Modified message: ${JSON.stringify(ingestionDetails[inProgressIndex])}`);
                messageObject.Job.ingestionDetails = ingestionDetails;

                // Produce the modified messages back to the same topic
                await produceModifiedMessages(messageObject);
            } else if (notStartedIndex !== -1) {
                // Change 'not-started' to 'inprogress'
                ingestionDetails[notStartedIndex].state = 'inprogress';

                // Log the modified message
                console.log(`Modified message: ${JSON.stringify(ingestionDetails[notStartedIndex])}`);

                // Produce the modified messages back to the same topic
                messageObject.Job.ingestionDetails = ingestionDetails;
                await produceModifiedMessages(messageObject);
            } else {
                // Log a message if no 'inprogress' or 'not-started' state is found
                console.log('No message with state "inprogress" or "not-started" found.');
            }
        } catch (error) {
            console.error(`Error processing message: ${error}`);
        }
    });

    // Set up error event handlers
    consumer.on('error', (err) => {
        console.error(`Consumer Error: ${err}`);
    });

    consumer.on('offsetOutOfRange', (err) => {
        console.error(`Offset out of range error: ${err}`);
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
                console.error(`Producer Error: ${err}`);
                reject(err);
            } else {
                console.log('Produced modified messages successfully.');
                resolve();
            }
        });
    });
}

// Gracefully disconnect from the Kafka broker when the process is terminated
process.on('SIGINT', () => {
    console.log('Disconnecting from Kafka...');
    consumer.close(true, () => {
        producer.close(() => {
            process.exit();
        });
    });
});

// Keep the process running to allow the consumer to receive messages
process.stdin.resume();
