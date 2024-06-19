import Redis from "ioredis"; // Import ioredis library
import config from "../config";


export const redis = new Redis({
    host: config.host.redisHost, // Replace with your Redis host
    port: parseInt(config.cacheValues.redisPort) // Replace with your Redis port
});
