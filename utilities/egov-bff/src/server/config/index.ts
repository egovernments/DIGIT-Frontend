// config.js
// const env = process.env.NODE_ENV; // 'dev' or 'test'

import { getErrorCodes } from "./constants";

const HOST = process.env.EGOV_HOST ||
  // "http://127.0.0.1:8080/" ||
  "https://unified-uat.digit.org/";

if (!HOST) {
  console.log("You need to set the HOST variable");
  process.exit(1);
}

const config = {
  auth_token: process.env.AUTH_TOKEN,
  KAFKA_BROKER_HOST:
    // "localhost:9092" ||
    process.env.KAFKA_BROKER_HOST || "kafka-v2.kafka-cluster:9092",
  KAFKA_DHIS_UPDATE_TOPIC:
    process.env.KAFKA_DHIS_UPDATE_TOPIC || "update-dhis2-job",
  app: {
    port: parseInt(process.env.APP_PORT || "8080") || 8080,
    host: HOST,
    contextPath: process.env.CONTEXT_PATH || "/hcm-bff",
  },
  host: {
    serverHost: HOST,
    mdms: process.env.EGOV_MDMS_HOST || "https://unified-uat.digit.org/",
    filestore: process.env.EGOV_FILESTORE_SERVICE_HOST || "https://unified-uat.digit.org/",
    hcmBff: process.env.EGOV_HCM_BFF_HOST || "http://127.0.0.1:8080/",
  },
  paths: {
    filestore: "filestore/v1/files",
    mdms_search: "mdms-v2/v2/_search"
  },
};

export { getErrorCodes };
export default config;
