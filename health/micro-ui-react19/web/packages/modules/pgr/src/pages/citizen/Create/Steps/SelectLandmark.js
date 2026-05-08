import { useState } from "react";
import { FormStep, TextArea, CardLabel } from "@egovernments/digit-ui-react-components";

const SelectLandmark = ({ t, config, onSelect, onSkip, value }) => {
  const [landmark, setLandmark] = useState(value?.landmark || "");

  return (
    <FormStep config={config} onSelect={() => onSelect({ landmark })} onSkip={onSkip} t={t}>
      <CardLabel>{t("CS_ADDCOMPLAINT_LANDMARK")}</CardLabel>
      <TextArea value={landmark} onChange={(e) => setLandmark(e.target.value)} name="landmark" />
    </FormStep>
  );
};

export default SelectLandmark;
