import { useEffect, useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";

const SelectSubType = ({ t, config, onSelect, value }) => {
  const [subType, setSubType] = useState(value?.subType || {});
  const stateId = Digit.Utils.getMultiRootTenant?.() ? Digit.ULBService.getStateId() : Digit.ULBService.getCurrentTenantId();
  const [subTypes, setSubTypes] = useState([]);

  useEffect(() => {
    if (value?.complaintType) {
      Digit.GetServiceDefinitions?.getSubMenu(stateId, value.complaintType, t).then(setSubTypes);
    }
  }, [value?.complaintType]);

  return (
    <TypeSelectCard
      {...config.texts}
      menu={subTypes}
      optionsKey="name"
      selected={setSubType}
      selectedOption={subType}
      onSave={() => onSelect({ subType })}
      t={t}
      disabled={!subType || Object.keys(subType).length === 0}
    />
  );
};

export default SelectSubType;
