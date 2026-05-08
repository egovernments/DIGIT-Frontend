import { CheckPoint } from "@egovernments/digit-ui-react-components";

const PendingForAssignment = ({ isCompleted, text, customChild }) => (
  <CheckPoint isCompleted={isCompleted} label={text} customChild={customChild} />
);

export default PendingForAssignment;
