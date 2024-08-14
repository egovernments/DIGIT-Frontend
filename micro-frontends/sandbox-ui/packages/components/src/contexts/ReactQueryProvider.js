import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../states/stateConfigs";
// import { hydrateAllQueries, queryClient } from "./state/stateConfigs";

const ReactQueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export default ReactQueryProvider;
