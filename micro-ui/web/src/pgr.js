import SelectName from "./Customisations/pgr/SelectName";
// import { config as complaintConfig } from "./complaintConfig";

const pgrCustomizations = {
  // complaintConfig,
  getComplaintDetailsTableRows: ({ id, service, role, t }) => {
    return {};
  },
};

const pgrComponents = {
  SelectName: SelectName,
};
export { pgrCustomizations, pgrComponents };
