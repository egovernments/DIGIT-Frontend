import { createGlobalState } from "./createState";

/**
 * Custom hook for managing tenant state.
 * 
 * Utilizes the `createGlobalState` function to create a global state for user-related data.
 * This state includes information about the tenant details.
 * 
 * @author jagankumar-egov
 */
export const useTenantState = createGlobalState("tenant", {
  tenantId: null,
  rootTenantId: null,
  availableTenants: [],
  tenantsInfo: [],
});
