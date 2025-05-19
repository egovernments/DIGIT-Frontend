import DocumentCard from "./components/DocumentCard";
import EngagementCard from "./components/EngagementCard";
import SelectName from "./components/SelectName";

// import { config as complaintConfig } from "./complaintConfig";

const pgrCustomizations = {
  // complaintConfig,
  getComplaintDetailsTableRows: ({ id, service, role, t }) => {
    return {};
  },
};

const overrideComponents = {
  SelectName: SelectName,
  DocumentCard,
  EngagementCard
};
export { pgrCustomizations, overrideComponents };
