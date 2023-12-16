import { KafkaClient, Consumer, Producer, Message, ProduceRequest } from 'kafka-node';

// TODO @ASHISH move consumer and producer outside folder 

// Replace with the correct Kafka broker(s) and topic name
const kafkaConfig = {
    kafkaHost: 'localhost:9092', // Use the correct broker address and port
    groupId: 'my-group',
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    fromOffset: 'earliest', // Start reading from the beginning of the topic
};

const topicName = 'topic-one';

// Create a Kafka client
const kafkaClient = new KafkaClient(kafkaConfig);

// Create a Kafka consumer
const consumer = new Consumer(kafkaClient, [{ topic: topicName, partition: 0 }], { autoCommit: true });

// Create a Kafka producer
const producer = new Producer(kafkaClient);

// Exported listener function
export function listener() {
    // Set up a message event handler
    consumer.on('message', async (message: Message) => {
        try {
            // Parse the message value as an array of objects
            const messagesArray: any[] = JSON.parse(message.value?.toString() || '[]');
            console.log("Message received:", messagesArray);

            // Find the first message with state 'inprogress'
            const inProgressIndex = messagesArray.findIndex((msg) => msg.state === 'inprogress');

            // Find the first message with state 'not-started'
            const notStartedIndex = messagesArray.findIndex((msg) => msg.state === 'not-started');

            if (inProgressIndex !== -1) {
                // Change 'inprogress' to 'done'
                messagesArray[inProgressIndex].state = 'done';

                // Log the modified message
                console.log(`Modified message: ${JSON.stringify(messagesArray[inProgressIndex])}`);

                // Produce the modified messages back to the same topic
                await produceModifiedMessages(messagesArray);
            } else if (notStartedIndex !== -1) {
                // Change 'not-started' to 'inprogress'
                messagesArray[notStartedIndex].state = 'inprogress';

                // Log the modified message
                console.log(`Modified message: ${JSON.stringify(messagesArray[notStartedIndex])}`);

                // Produce the modified messages back to the same topic
                await produceModifiedMessages(messagesArray);
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
