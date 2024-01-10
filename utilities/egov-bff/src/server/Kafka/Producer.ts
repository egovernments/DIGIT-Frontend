import { Producer, KafkaClient } from 'kafka-node';
import config from '../config';

const kafkaConfig = {
    kafkaHost: config.KAFKA_BROKER_HOST,
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    sessionTimeout: 15000,
    fetchMaxBytes: 10 * 1024 * 1024,
    protocol: ['roundrobin'],
    fromOffset: 'latest',
    outOfRangeOffset: 'earliest',
    groupId: 'your_producer_group',
};

// Create a Kafka client
const kafkaClient = new KafkaClient(kafkaConfig);

// Create a Kafka producer
export const producer = new Producer(kafkaClient);

// Event handler for producer errors
producer.on('error', (error) => {
    console.error('Error in Kafka producer:', error);
});

// Event handler for producer ready
producer.on('ready', () => {
    console.log('Kafka producer is ready.');
});

// Make sure to wait for the 'ready' event before sending messages
// This ensures that the producer is ready to send messages to Kafka
