import MANAGE_BILLS_ROLE_CONFIG, { MANAGE_BILLS_ROLES } from "../config/manageBillsRoleConfig";

// TODO: Wire isBank to MDMS/project config instead of hardcoding
export const isBank = true;

export const MANAGE_BILLS_ROLE_STORAGE_KEY = "manageBillsRole";

export const normalizeManageBillsRoleParam = (roleParam) => {
  if (!roleParam || typeof roleParam !== "string") return null;
  const normalized = roleParam.trim().toLowerCase();
  return ["editor", "reviewer", "approver"].includes(normalized) ? normalized : null;
};

/**
 * Determines the active manage-bills role for the current user.
 * Priority: PAYMENT_APPROVER > PAYMENT_REVIEWER > PAYMENT_EDITOR
 * When isBank is true, PAYMENT_APPROVER maps to PAYMENT_APPROVER_BANK.
 */
export const getManageBillsRole = (overrideRole) => {
  if (overrideRole === "EDITOR") {
    return MANAGE_BILLS_ROLES.PAYMENT_EDITOR;
  }

  if (overrideRole === "REVIEWER") {
    return MANAGE_BILLS_ROLES.PAYMENT_REVIEWER;
  }

  if (overrideRole === "APPROVER") {
    return isBank
      ? MANAGE_BILLS_ROLES.PAYMENT_APPROVER_BANK
      : MANAGE_BILLS_ROLES.PAYMENT_APPROVER;
  }

  // fallback (old logic)
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
export const getManageBillsConfig = (overrideRole) => {
  const role = getManageBillsRole(overrideRole);
  return role ? MANAGE_BILLS_ROLE_CONFIG[role] : null;
};
