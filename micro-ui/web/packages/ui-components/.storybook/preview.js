import "@egovernments/digit-ui-css/example/index.css";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";

// TODO: It should be removed bcz we should not use any library in components
initLibraries();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
