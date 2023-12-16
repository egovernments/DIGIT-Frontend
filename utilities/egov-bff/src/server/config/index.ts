// config.js
// const env = process.env.NODE_ENV; // 'dev' or 'test'

import { getErrorCodes } from "./constants";

const HOST = process.env.EGOV_HOST || "https://unified-dev.digit.org/";

if (!HOST) {
  console.log("You need to set the HOST variable");
  process.exit(1);
}

const config = {
  auth_token: process.env.AUTH_TOKEN,
  KAFKA_BROKER_HOST:
    process.env.KAFKA_BROKER_HOST || "kafka-v2.kafka-cluster:9092",
  KAFKA_RECEIVE_CREATE_JOB_TOPIC:
    process.env.KAFKA_RECEIVE_CREATE_JOB_TOPIC || "PDF_GEN_RECEIVE",
  KAFKA_BULK_PDF_TOPIC: process.env.KAFKA_BULK_PDF_TOPIC || "BULK_PDF_GEN",
  PDF_BATCH_SIZE: process.env.PDF_BATCH_SIZE || 40,
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "postgres",
  DB_PORT: process.env.DB_PORT || 5432,
  app: {
    port: parseInt(process.env.APP_PORT || "8080") || 8080,
    host: HOST,
    contextPath: process.env.CONTEXT_PATH || "/egov-bff",
  },
  configs: {
    DATA_CONFIG_URLS: 'file:///Users/klrao/Documents/pdf-config/data-config/consolidatedreceipt.json',
    FORMAT_CONFIG_URLS: process.env.FORMAT_CONFIG_URLS
  },
  host: {
    serverHost: HOST,
    localization: process.env.EGOV_LOCALIZATION_HOST || HOST,
    mdms: process.env.EGOV_MDMS_HOST || HOST || "http://localhost:8094/",
    pdf: process.env.EGOV_PDF_HOST || HOST || "http://localhost:8087/",
    user: process.env.EGOV_USER_HOST || HOST || "http://localhost:8089/",
    workflow:
      process.env.EGOV_WORKFLOW_HOST || HOST || "http://localhost:8091/",
    muster: process.env.EGOV_MUSTER_ROLL_HOST || HOST || "http://localhost:8070/",
    individual: process.env.EGOV_PROJECT_HOST || HOST|| "http://localhost:8071/",
    contract: process.env.EGOV_CONTRACT_HOST|| HOST || "http://localhost:8072/",
    estimate: process.env.EGOV_ESTIMATE_HOST || HOST|| "http://localhost:8073/",
    measurement: process.env.EGOV_MEASUREMENT_HOST|| HOST || "http://localhost:8074/",
  },
  paths: {
    pdf_create: "/pdf-service/v1/_createnosave",
    user_search: "/user/_search",
    mdms_search: "/egov-mdms-service/v1/_search",
    workflow_search: "/egov-workflow-v2/egov-wf/process/_search",
    ind_search: "/individual/v1/_search",
    mus_search: "/muster-roll/v1/_search",
    localization_search: "/localization/messages/v1/_search",
    contract_search: "/contract/v1/_search",
    estimate_search: "/estimate/v1/_search",
    measurement_search: "/measurement-service/v1/_search",
  },
};

export { getErrorCodes };
export default config;
