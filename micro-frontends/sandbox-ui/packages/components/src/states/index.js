import { useAuthState } from "./useAuthState";
import { useDrawerState } from "./useDrawerState";
import { useLocaleState } from "./useLocaleState";
import { useNavigatorState } from "./useNavigatorState";
import { useTenantState } from "./useTenantState";
import { useUserState } from "./useUserState";

/**
 * Centralized export of state management hooks.
 * 
 * This file gathers and exports commonly used state hooks for easy access
 * across the application.
 * 
 * @author jagankumar-egov
 */

/**
 * States - An object containing state management hooks.
 * 
 * This object centralizes the export of state hooks, making them easier to import 
 * in other parts of the application.
 * 
 * @example
 * import States from 'path/to/States';
 * const { useUserState, useAuthState } = States;
 * 
 * @see {@link ./useUserState.js} for details on the useUserState hook.
 * @see {@link ./useAuthState.js} for details on the useAuthState hook.
 */
const States = {
  useUserState,
  useAuthState,
  useDrawerState,
  useLocaleState,
  useNavigatorState,
  useTenantState,
};

export default States;
