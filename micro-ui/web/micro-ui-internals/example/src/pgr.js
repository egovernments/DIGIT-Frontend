import DocumentCard from "./components/DocumentCard";
import EngagementCard from "./components/EngagementCard";
import SelectName from "./components/SelectName";


const pgrCustomizations = {
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
