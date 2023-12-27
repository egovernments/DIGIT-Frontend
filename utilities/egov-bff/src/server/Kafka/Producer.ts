import { Producer, KafkaClient } from "kafka-node";

import config from '../config';

// Replace with the correct Kafka broker(s) and topic name
const kafkaConfig = {
    kafkaHost: config.KAFKA_BROKER_HOST, // Use the correct broker address and port
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    fromOffset: 'earliest', // Start reading from the beginning of the topic
};

// Create a Kafka client
const kafkaClient = new KafkaClient(kafkaConfig);

export const producer = new Producer(kafkaClient);