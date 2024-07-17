// config.js
// Importing necessary module
import { getErrorCodes } from "./constants";
// Defining the HOST variable
const HOST = process.env.EGOV_HOST ||
  "https://unified-dev.digit.org/";
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
  excludeHierarchyTypeFromBoundaryCodes: false,
  excludeBoundaryNameAtLastFromBoundaryCodes: false,
  boundary: {
    boundaryCode: process.env.BOUNDARY_CODE_HEADER_NAME || "HCM_ADMIN_CONSOLE_BOUNDARY_CODE",
    boundaryTab: process.env.BOUNDARY_TAB_NAME || "HCM_ADMIN_CONSOLE_BOUNDARY_DATA",
  },
  cacheValues: {
    cacheEnabled: process.env.CACHE_ENABLED,
    resetCache: process.env.RESET_CACHE,
    redisPort: process.env.REDIS_PORT || "6379",
  },
  kafka: {
    KAFKA_SAVE_BOUNDARY_DETAILS_TOPIC: process.env.KAFKA_SAVE_BOUNDARY_DETAILS_TOPIC || "save-boundary-details",
    KAFKA_UPDATE_BOUNDARY_DETAILS_TOPIC: process.env.KAFKA_UPDATE_BOUNDARY_DETAILS_TOPIC || "update-boundary-details",
  },

  // Database configuration
  DB_CONFIG: {
    DB_USER: process.env.DB_USER || "postgres",
    DB_HOST: process.env.DB_HOST?.split(':')[0] || "localhost",
    DB_NAME: process.env.DB_NAME || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
    DB_PORT: process.env.DB_PORT || "5432",
    DB_BOUNDARY_DETAILS_TABLE_NAME: `${getDBSchemaName(process.env.DB_SCHEMA)}.eg_boundary_bulk_details`,
  },
  // Application configuration
  app: {
    port: parseInt(process.env.APP_PORT || "8080") || 8080,
    host: HOST,
    contextPath: process.env.CONTEXT_PATH || "/boundary-bulk-bff",
    logLevel: process.env.APP_LOG_LEVEL || "debug",
    debugLogCharLimit: process.env.APP_MAX_DEBUG_CHAR ? Number(process.env.APP_MAX_DEBUG_CHAR) : 1000
  },
  localisation: {
    defaultLocale: process.env.LOCALE || "en_MZ",
    boundaryPrefix: "rainmaker-boundary",
    localizationModule: process.env.LOCALIZATION_MODULE || "rainmaker-hcm-admin-schemas",
  },
  host: {
    serverHost: HOST,
    KAFKA_BROKER_HOST: process.env.KAFKA_BROKER_HOST || "kafka-v2.kafka-cluster:9092",
    redisHost: process.env.REDIS_HOST || "localhost",
    filestore: process.env.EGOV_FILESTORE_SERVICE_HOST || "https://unified-dev.digit.org/",
    boundaryHost: process.env.EGOV_BOUNDARY_HOST || "https://unified-dev.digit.org/",
    localizationHost: process.env.EGOV_LOCALIZATION_HOST || "https://unified-dev.digit.org/",
  },
  values: {
    maxHttpRetries: "4",
    unfrozeTillRow: process.env.UNFROZE_TILL_ROW || "10000",
    unfrozeTillColumn: process.env.UNFROZE_TILL_COLUMN || "50",
  },
  // Paths for different services
  paths: {
    filestore: process.env.FILE_STORE_SERVICE_END_POINT || "filestore/v1/files",
    boundaryRelationship: process.env.EGOV_BOUNDARY_RELATIONSHIP_SEARCHPATH || "boundary-service/boundary-relationships/_search",
    boundaryHierarchy: process.env.EGOV_BOUNDARY_HIERARCHY_SEARCHPATH || "boundary-service/boundary-hierarchy-definition/_search",
    boundaryEntitySearch: process.env.EGOV_BOUNDARY_ENTITY_SEARCHPATH || "boundary-service/boundary/_search",
    boundaryEntityCreate: process.env.EGOV_BOUNDARY_ENTITY_CREATEPATH || "boundary-service/boundary/_create",
    localizationSearch: process.env.EGOV_LOCALIZATION_SEARCH || "localization/messages/v1/_search",
    localizationCreate: "localization/messages/v1/_upsert",
    boundaryRelationshipCreate: "boundary-service/boundary-relationships/_create",
  }
};
// Exporting getErrorCodes function and config object
export { getErrorCodes };
export default config;
