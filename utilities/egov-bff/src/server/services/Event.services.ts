import { logger } from "../utils/logger";
import { AnalyticsEvent } from "../models/AnalyticsEvent.t";
import config from "../config";
import { produceModifiedMessages } from "../kafka/Producer";

async function createEvent(AnalyticsEvent: AnalyticsEvent) {
  // Validate the request for creating a project type campaign
  logger.info("VALIDATING:: EVENT CREATE REQUEST");
  // await validateProjectCampaignRequest(request, "create");
  logger.info("VALIDATED:: EVENT CREATE REQUEST");

  logger.info("PROCESSING:: THE EVENT CREATE REQUEST");
  logger.debug(AnalyticsEvent);
  // Process the action based on the request type
  // await processBasedOnAction(request, "create");
  try {
    const produceMessage: any = {
      AnalyticsEvent,
    };
    await produceModifiedMessages(
      produceMessage,
      config?.kafka?.KAFKA_EVENT_SESSION_TOPIC
    );
    return AnalyticsEvent;
  } catch (error: any) {
    throw new Error(error);
  }
}

export { createEvent };
