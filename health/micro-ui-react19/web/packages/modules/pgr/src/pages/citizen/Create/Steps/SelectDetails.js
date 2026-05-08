import { useState } from "react";
import { FormStep, TextArea, CardLabel } from "@egovernments/digit-ui-react-components";

const SelectDetails = ({ t, config, onSelect, value }) => {
  const [details, setDetails] = useState(value?.details || "");

  return (
    <FormStep config={config} onSelect={() => onSelect({ details })} t={t}>
      <CardLabel>{t("CS_ADDCOMPLAINT_ADDITIONAL_DETAILS")}</CardLabel>
      <TextArea value={details} onChange={(e) => setDetails(e.target.value)} name="details" />
    </FormStep>
  );
};

export default SelectDetails;
