/**
 * Delivery strategies.
 *
 * A campaign normally configures delivery as cycles (rounds) each containing deliveries (doses).
 * Some campaign types instead deliver a single round in several different ways - at home, at a
 * communal site, or at a transit point. Those ways are called delivery strategies.
 *
 * A campaign type opts in by declaring a `deliveryMethods` array on its
 * HCM-PROJECT-TYPES.projectTypes record, alongside the existing `roundTypes`. A campaign type
 * that declares none keeps the cycle screens unchanged, so no campaign type name appears
 * anywhere in this module.
 *
 * Naming: the screens say "delivery strategy"; the persisted field is `deliveryMethod`. They are
 * the same thing. The field could not be called `deliveryStrategy` because that name is already
 * used on every delivery for the DIRECT / INDIRECT observation value, which is unrelated.
 *
 * Where a strategy is stored, in the order it should be read:
 *   1. the wizard session, while the user is moving between steps
 *   2. `additionalDetails.cycleData.deliveryMethods` on a saved campaign
 *   3. `deliveryMethod` on each saved delivery
 */

/**
 * The delivery methods a campaign type offers, in the order it declares them.
 * Order drives both the checkbox list on Delivery Setup and the tab order on Delivery Rules, so a
 * campaign presents the same way no matter what order the user ticked things in.
 */
export const getDeliveryMethods = (projectTypeRecord) => {
  const methods = projectTypeRecord?.deliveryMethods;
  if (!Array.isArray(methods) || methods.length === 0) return [];
  return [...methods].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
};

/**
 * Delivery methods only work for a single round: one cycle carries one delivery date range, while
 * multi-round means several cycles with dates of their own. A campaign type using methods should
 * declare `roundTypes: ["SINGLE_ROUND"]`, so this is a guard rather than the primary control.
 * An absent round type means single round - that is what CycleSelection falls back to.
 */
export const isSingleRound = (roundType) => roundType !== "MULTI_ROUND";

/** Whether the delivery-strategy screens apply to this campaign. */
export const usesDeliveryMethods = (projectTypeRecord, roundType) =>
  getDeliveryMethods(projectTypeRecord).length > 0 && isSingleRound(roundType);

/** Method codes the user has ticked, read back off the cycle-configure session value. */
export const getSelectedMethodCodes = (cycleConfigure) =>
  Array.isArray(cycleConfigure?.deliveryMethods) ? cycleConfigure.deliveryMethods : [];

/**
 * Round type for the campaign being edited. Persisted on the campaign by the create flow; falls
 * back to the wizard's own round-type step for a campaign that has not been saved yet.
 */
export const getRoundType = (campaignData, sessionFormData) => {
  const persisted = campaignData?.additionalDetails?.roundType;
  if (persisted) return persisted;
  const selection = sessionFormData?.HCM_CAMPAIGN_TYPE?.CycleSelection;
  if (selection === "HCM_MULTI_ROUND") return "MULTI_ROUND";
  if (selection === "HCM_SINGLE_ROUND") return "SINGLE_ROUND";
  return undefined;
};

/**
 * Keep the ticked methods in the order the campaign type declares them, and drop anything no
 * longer offered. Guards against a stale selection surviving in session after MDMS changes.
 */
export const normaliseSelection = (selectedCodes, methods) =>
  methods.map((m) => m?.code).filter((code) => selectedCodes?.includes(code));

/**
 * Delivery strategies chosen on a saved campaign. Read from the cycle configuration the wizard
 * persists, falling back to the codes stamped on the saved deliveries.
 */
export const getCampaignDeliveryMethods = (campaignData) => {
  const fromCycleData = campaignData?.additionalDetails?.cycleData?.deliveryMethods;
  if (Array.isArray(fromCycleData) && fromCycleData.length > 0) return fromCycleData;
  const fromRules = campaignData?.deliveryRules?.[0]?.cycles?.[0]?.deliveries
    ?.map((d) => d?.deliveryMethod)
    ?.filter(Boolean);
  return Array.isArray(fromRules) ? fromRules : [];
};

/**
 * Whether a project, as returned by the project service, was configured with delivery strategies.
 *
 * Screens that edit a created campaign work from the project rather than the campaign. The project
 * carries the same deliveries, each stamped with the strategy it belongs to, so the presence of a
 * code is the signal. A campaign that uses no strategies has no code on any delivery.
 */
export const projectUsesDeliveryMethods = (project) =>
  Boolean(project?.additionalDetails?.projectType?.cycles?.some((cycle) => cycle?.deliveries?.some((d) => d?.deliveryMethod)));
