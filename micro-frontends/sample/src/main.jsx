import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./configs/i18.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { hydrateAllQueries, queryClient } from "./state/stateConfigs";
import './styles/index.scss'; // Import the common SCSS file

const initializeApp = async () => {
  await hydrateAllQueries();
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

initializeApp();
