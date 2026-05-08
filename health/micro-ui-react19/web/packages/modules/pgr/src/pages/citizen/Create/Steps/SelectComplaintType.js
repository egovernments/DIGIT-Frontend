import { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";

const SelectComplaintType = ({ t, config, onSelect, value }) => {
  const [complaintType, setComplaintType] = useState(value?.complaintType || {});
  const stateId = Digit.Utils.getMultiRootTenant?.() ? Digit.ULBService.getStateId() : Digit.ULBService.getCurrentTenantId();
  const menu = Digit.Hooks.pgr?.useComplaintTypes?.({ stateCode: stateId }) || [];

  return (
    <TypeSelectCard
      {...config.texts}
      menu={menu}
      optionsKey="name"
      selected={setComplaintType}
      selectedOption={complaintType}
      onSave={() => onSelect({ complaintType })}
      t={t}
      disabled={!complaintType || Object.keys(complaintType).length === 0}
    />
  );
};

export default SelectComplaintType;
