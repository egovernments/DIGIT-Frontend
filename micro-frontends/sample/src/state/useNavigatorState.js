import { createGlobalState } from "./createState";

export const useNavigatorState = createGlobalState("navigator", {
  currentScreen: "",
  history: [],
  previousScreen: "",
});
