import { createGlobalState } from "./createState";

export const useTenantState = createGlobalState("tenant", {
  tenantId: null,
  rootTenantId: null,
  availableTenants: [],
  tenantsInfo: [],
});
