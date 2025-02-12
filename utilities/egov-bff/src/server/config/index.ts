// config.js
// const env = process.env.NODE_ENV; // 'dev' or 'test'

import { getErrorCodes } from "./constants";

const HOST = process.env.EGOV_HOST || "https://unified-dev.digit.org/";

if (!HOST) {
  console.log("You need to set the HOST variable");
  process.exit(1);
}
const checkEnabled = process.env.EGOV_CLIENT_SECRET_CHECK_ENABLED || true;
const config = {
  client: {
    secret: process.env.EGOV_CLIENT_SECRET || "ZWdvdi11c2VyLWNsaWVudDo=",
    checkDisabled: checkEnabled ? false : true,
    schemaCode: process.env.EGOV_CLIENT_SCHEMA_CODE || "Integration.mForm",
  },
  stateTenantId: process.env.EGOV_STATE_TENANT_ID || "pg",
  auth_token: process.env.AUTH_TOKEN,

  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "postgres",
  DB_PORT: process.env.DB_PORT || 5432,
  app: {
    port: parseInt(process.env.APP_PORT || "8080") || 8080,
    host: HOST,
    contextPath: process.env.CONTEXT_PATH || "/egov-bff",
    apiSpecPath: "/api-docs",
    debugLogCharLimit: process.env.APP_MAX_DEBUG_CHAR
      ? Number(process.env.APP_MAX_DEBUG_CHAR)
      : 1000,
  },
  configs: {
    DATA_CONFIG_URLS:
      "file:///Users/klrao/Documents/pdf-config/data-config/consolidatedreceipt.json",
    FORMAT_CONFIG_URLS: process.env.FORMAT_CONFIG_URLS,
  },
  host: {
    serverHost: HOST,
    KAFKA_BROKER_HOST:
      process.env.KAFKA_BROKER_HOST || "localhost:9092",

    localization: process.env.EGOV_LOCALIZATION_HOST || HOST,
    mdms: process.env.EGOV_MDMS_HOST || HOST || "http://localhost:8094/",
    mdmsV2: process.env.EGOV_MDMS_V2_HOST || HOST || "http://localhost:8082/",
    pdf: process.env.EGOV_PDF_HOST || HOST || "http://localhost:8087/",
    user: process.env.EGOV_USER_HOST || HOST || "http://localhost:8081/",
    workflow:
      process.env.EGOV_WORKFLOW_HOST || HOST || "http://localhost:8091/",
    muster:
      process.env.EGOV_MUSTER_ROLL_HOST || HOST || "http://localhost:8070/",
    individual:
      process.env.EGOV_PROJECT_HOST || HOST || "http://localhost:8071/",
    contract:
      process.env.EGOV_CONTRACT_HOST || HOST || "http://localhost:8072/",
    estimate:
      process.env.EGOV_ESTIMATE_HOST || HOST || "http://localhost:8073/",
    measurement:
      process.env.EGOV_MEASUREMENT_HOST || HOST || "http://localhost:8074/",
  },
  kafka: {
    KAFKA_CREATE_SESSION_TOPIC:
      process.env.KAFKA_CREATE_SESSION_TOPIC || "create-analytics-session",
    KAFKA_UPDATE_SESSION_TOPIC:
      process.env.KAFKA_UPDATE_SESSION_TOPIC || "update-analytics-session",
    KAFKA_EVENT_SESSION_TOPIC:
      process.env.KAFKA_EVENT_SESSION_TOPIC || "create-analytics-event",
  },
  paths: {
    user_search: "/user/_search",
    mdms_search: "/egov-mdms-service/v1/_search",
    workflow_search: "/egov-workflow-v2/egov-wf/process/_search",
    mdmsV2_search:
      process.env.EGOV_MDMS_V2_SEARCH_ENDPOINT || "/mdms-v2/v2/_search",
    mdmsV2_create: "/mdms-v2/v2/_create",
    localization_search: "/localization/messages/v1/_search",
  },
};

export { getErrorCodes };
export default config;
