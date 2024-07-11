import { createGlobalState } from "./createState";

export const useUserState = createGlobalState("user", {
  name: "default",
  userType: "employee",
  roles: [],
  userId: null,
  mobileNumber: null,
  emailId: null,
  tenantId: null,
});
