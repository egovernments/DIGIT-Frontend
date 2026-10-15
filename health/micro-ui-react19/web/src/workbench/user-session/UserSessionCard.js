import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import {
  hasUserSessionAccess,
  getUserSessionRouteLink,
  USER_SESSION_ALLOWED_ACTION_KEYS,
  USER_SESSION_FALLBACK_ROLES,
} from "./config";
import { ensureUserSessionI18n } from "../../../packages/modules/campaign-manager/src/utils/i18nKeyConstants";

const getCurrentPathAction = (action = {}) => {
  return String(action?.name || action?.displayName || action?.path || "").toUpperCase();
};

const isUserSessionAction = (action = {}) => {
  const key = getCurrentPathAction(action);
  const route = String(action?.navigationURL || action?.url || action?.path || "");
  return (
    USER_SESSION_ALLOWED_ACTION_KEYS.includes(key) ||
    route.includes("/employee/user-session") ||
    route.includes("/employee/workbench/user-session")
  );
};

const UserSessionCard = () => {
  const { t } = useTranslation();
  useEffect(() => {
    ensureUserSessionI18n();
  }, []);
  const routeLink = getUserSessionRouteLink();

  const { data: accessControl } = Digit.Hooks.useAccessControl ? Digit.Hooks.useAccessControl() : { data: null };
  const userSessionAction = useMemo(() => {
    const actions = accessControl?.actions;
    if (!Array.isArray(actions)) return null;
    return actions.find(isUserSessionAction) || null;
  }, [accessControl]);

  const roleGuard = USER_SESSION_FALLBACK_ROLES;
  if (!hasUserSessionAccess()) {
    return null;
  }

  return (
    <EmployeeModuleCard
      Icon={"UpdateExpense"}
      moduleName={t("USER_SESSION_CARD_HEADER")}
      className="microplan-employee-module-card"
      kpis={[]}
      links={[
        {
          label: t("USER_SESSION_CARD_DESCRIPTION"),
          link: routeLink,
          roles: roleGuard,
        },
      ]}
    />
  );
};

export default UserSessionCard;
