import MANAGE_BILLS_ROLE_CONFIG, { MANAGE_BILLS_ROLES } from "../config/manageBillsRoleConfig";

// TODO: Wire isBank to MDMS/project config instead of hardcoding
export const isBank = true;

/**
 * Determines the active manage-bills role for the current user.
 * Priority: PAYMENT_APPROVER > PAYMENT_REVIEWER > PAYMENT_EDITOR
 * When isBank is true, PAYMENT_APPROVER maps to PAYMENT_APPROVER_BANK.
 */
export const getManageBillsRole = () => {
  // TODO: Remove CAMPAIGN_SUPERVISOR mappings before production
  const ROLE_PRIORITY = [
    { target: MANAGE_BILLS_ROLES.PAYMENT_APPROVER, check: ["PAYMENT_APPROVER"] },
    { target: MANAGE_BILLS_ROLES.PAYMENT_REVIEWER, check: ["PAYMENT_REVIEWER"] },
    { target: MANAGE_BILLS_ROLES.PAYMENT_EDITOR, check: ["PAYMENT_EDITOR"] },
  ];

  for (const { target, check } of ROLE_PRIORITY) {
    if (Digit.Utils.didEmployeeHasAtleastOneRole(check)) {
      if (target === MANAGE_BILLS_ROLES.PAYMENT_APPROVER && isBank) {
        return MANAGE_BILLS_ROLES.PAYMENT_APPROVER_BANK;
      }
      return target;
    }
  }
  return null;
};

/**
 * Returns the full role config for the detected role, or null.
 */
export const getManageBillsConfig = () => {
  const role = getManageBillsRole();
  console.log("Detected manage bills role:", role);
  return role ? MANAGE_BILLS_ROLE_CONFIG[role] : null;
};
