import React from "react";
import { QueryClientProvider } from "react-query";
import { Example } from "@demo/shared";

function App({ title = "", queryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <h2>{title}</h2>
      <Example />
    </QueryClientProvider>
  );
}

export default App;
