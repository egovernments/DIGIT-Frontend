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
    // "localhost:9093" ||
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
    mdms: process.env.EGOV_MDMS_HOST
      // || "http://localhost:8084/"
      || "https://unified-uat.digit.org/",
    filestore: process.env.EGOV_FILESTORE_SERVICE_HOST
      // || "http://localhost:8083/"
      || "https://unified-uat.digit.org/",
    hcmBff: process.env.EGOV_HCM_BFF_HOST || "http://127.0.0.1:8080/",
    hcmMozImpl: process.env.HCM_MOZ_IMPL_SERVICE_HOST
      // || "http://localhost:8082/"
      || "https://unified-uat.digit.org/",
  },
  paths: {
    filestore: process.env.FILE_STORE_SERVICE_END_POINT
      || "filestore/v1/files",
    mdms_search: process.env.EGOV_MDMS_SEARCH_ENDPOINT
      || "egov-mdms-service/v2/_search",
    // mdms_search: "mdms-v2/v2/_search",
    hcmMozImpl: process.env.HCM_MOZ_IMPL_SERVICE_ENDPOINT
      || "hcm-moz-impl/v1/ingest",
  },
  values: {
    parsingTemplate: process.env.HCM_PARSING_TEMPLATE
      || "HCM.ParsingTemplate",
    transfromTemplate: process.env.HCM_TRANSFORM_TEMPLATE
      || "HCM.TransformTemplate",
    campaignType: process.env.HCM_CAMPAIGN_TEMPLATE
      || "HCM.HCMTemplate"
  }
};

export { getErrorCodes };
export default config;
