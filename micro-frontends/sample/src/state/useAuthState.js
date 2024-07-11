import { createGlobalState } from "./createState";

export const useAuthState = createGlobalState("auth", {
  isSignedIn: false,
  loggedInAt: null,
  userId: null,
  token: null,
  tokenExpiresAt: null,
  refreshToken: null,
  refreshTokenExpiresAt: null,
  userType: "employee",
});
