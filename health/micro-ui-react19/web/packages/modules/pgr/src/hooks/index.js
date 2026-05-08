import useSearchComplaints from "./useSearchComplaints";
import useCreateComplaint from "./useCreateComplaint";
import useUpdateComplaint from "./useUpdateComplaint";
import useComplaintTypes from "./useComplaintTypes";
import useInboxData from "./useInboxData";

// All PGR hooks — registered on Digit.Hooks.pgr in Module.js
export const pgr = {
  useSearchComplaints,
  useCreateComplaint,
  useUpdateComplaint,
  useComplaintTypes,
  useInboxData,
};
