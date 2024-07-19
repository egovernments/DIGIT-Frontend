// config.js
// Importing necessary module
import { getErrorCodes } from "./constants";
// Defining the HOST variable
const HOST = process.env.EGOV_HOST || "https://unified-dev.digit.org/";
// Checking if HOST is set, if not, exiting the process
if (!HOST) {
  console.log("You need to set the HOST variable");
  process.exit(1);
}


const getDBSchemaName = (dbSchema = "") => {
  return dbSchema ? (dbSchema == "egov" ? "public" : dbSchema) : "public";
}
// Configuration object containing various environment variables
const config = {
  cacheValues: {
    cacheEnabled: process.env.CACHE_ENABLED,
    resetCache: process.env.RESET_CACHE,
    redisPort: process.env.REDIS_PORT || "6379",
  },
  kafka: {
    KAFKA_SAVE_MDMS_DETAILS_TOPIC: process.env.KAFKA_SAVE_MDMS_DETAILS_TOPIC || "save-mdms-bulk-details",
    KAFKA_UPDATE_MDMS_DETAILS_TOPIC: process.env.KAFKA_UPDATE_MDMS_DETAILS_TOPIC || "update-mdms-bulk-details",
  },

  // Database configuration
  DB_CONFIG: {
    DB_USER: process.env.DB_USER || "postgres",
    DB_HOST: process.env.DB_HOST?.split(':')[0] || "localhost",
    DB_NAME: process.env.DB_NAME || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
    DB_PORT: process.env.DB_PORT || "5432",
    DB_MDMS_DETAILS_TABLE_NAME: `${getDBSchemaName(process.env.DB_SCHEMA)}.eg_mdms_bulk_details`,
  },
  // Application configuration
  app: {
    port: parseInt(process.env.APP_PORT || "8080") || 8080,
    host: HOST,
    contextPath: process.env.CONTEXT_PATH || "/mdms-bulk-bff",
    logLevel: process.env.APP_LOG_LEVEL || "debug",
    debugLogCharLimit: process.env.APP_MAX_DEBUG_CHAR ? Number(process.env.APP_MAX_DEBUG_CHAR) : 1000
  },
  host: {
    serverHost: HOST,
    KAFKA_BROKER_HOST: process.env.KAFKA_BROKER_HOST || "kafka-v2.kafka-cluster:9092",
    redisHost: process.env.REDIS_HOST || "localhost",
    filestore: process.env.EGOV_FILESTORE_SERVICE_HOST || "https://unified-dev.digit.org/",
    mdmsHost: process.env.EGOV_MDMS_HOST || "https://unified-dev.digit.org/",
  },
  // Paths for different services
  paths: {
    filestoreCreate: "filestore/v1/files",
    filestoreSearch: "filestore/v1/files/url",
    mdmsSchemaSearch: "mdms-v2/schema/v1/_search",
    mdmsDataSearch: "mdms-v2/v2/_search",
    mdmsDataCreate: "mdms-v2/v2/_create",
  },
  values: {
    maxHttpRetries: "4",
    mdmsSheetName: "MDMS Data",
    unfrozeTillRow: "10000",
    unfrozeTillColumn: "50",
  }
};
// Exporting getErrorCodes function and config object
export { getErrorCodes };
export default config;
