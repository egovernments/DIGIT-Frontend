import { createContext, useContext } from "react";

/**
 * Carries the simulated preview scenario (or null for "All states") down to
 * renderTemplateComponent without threading a prop through every template.
 */
export const PreviewStateContext = createContext({ scenario: null });

export const usePreviewScenario = () => useContext(PreviewStateContext);
