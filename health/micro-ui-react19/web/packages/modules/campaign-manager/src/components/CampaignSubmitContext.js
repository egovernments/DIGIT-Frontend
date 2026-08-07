import { createContext, useContext } from "react";

// Tracks whether the campaign flow hosting the stepper has a save/update mutation in flight.
// Step components read this so they don't stack their own page loader on top of the flow's
// overlay loader - exactly one loader stays on screen, and the screen never goes blank.
const CampaignSubmitContext = createContext({ isSubmitting: false });

export const useCampaignSubmitting = () => useContext(CampaignSubmitContext)?.isSubmitting === true;

export default CampaignSubmitContext;
export { CampaignSubmitContext };
