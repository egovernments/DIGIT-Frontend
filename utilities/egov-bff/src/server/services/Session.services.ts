import { logger } from "../utils/logger";
import { AnalyticsSession } from "../models/AnalyticsSession.t";
import { produceModifiedMessages } from "../kafka/Producer";
import config from "../config";

async function createSession(AnalyticsSession: AnalyticsSession) {
  // Validate the request for creating a project type campaign
  logger.info("VALIDATING:: SESSION CREATE REQUEST");
  // await validateProjectCampaignRequest(request, "create");
  logger.info("VALIDATED:: SESSION CREATE REQUEST");

  logger.info("PROCESSING:: THE SESSION CREATE REQUEST");
  logger.debug(AnalyticsSession);
  // Process the action based on the request type
  // await processBasedOnAction(request, "create");
  try {
    const produceMessage: any = {
      AnalyticsSession,
    };
    await produceModifiedMessages(
      produceMessage,
      config?.kafka?.KAFKA_CREATE_SESSION_TOPIC
    );
    return AnalyticsSession;
  } catch (error: any) {
    throw new Error(error);
  }
}
async function endSession(AnalyticsSession: AnalyticsSession) {
  // Validate the request for creating a project type campaign
  logger.info("VALIDATING:: SESSION CREATE REQUEST");
  // await validateProjectCampaignRequest(request, "create");
  logger.info("VALIDATED:: SESSION CREATE REQUEST");

  logger.info("PROCESSING:: THE SESSION CREATE REQUEST");
  logger.debug(AnalyticsSession);
  // Process the action based on the request type
  // await processBasedOnAction(request, "create");
  try {
    const produceMessage: any = {
      AnalyticsSession,
    };
    await produceModifiedMessages(
      produceMessage,
      config?.kafka?.KAFKA_UPDATE_SESSION_TOPIC
    );
    return AnalyticsSession;
  } catch (error: any) {
    throw new Error(error);
  }
}
export { createSession, endSession };
