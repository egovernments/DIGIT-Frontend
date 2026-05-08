import { useState } from "react";
import { FormStep, TextInput, CardLabel } from "@egovernments/digit-ui-react-components";

const SelectPincode = ({ t, config, onSelect, onSkip, value }) => {
  const [pincode, setPincode] = useState(value?.pincode || "");
  const [error, setError] = useState(null);

  const validate = (val) => /^[1-9][0-9]{5}$/.test(val);

  const onSubmit = () => {
    if (pincode && !validate(pincode)) {
      setError(t("CORE_COMMON_PINCODE_INVALID"));
      return;
    }
    onSelect({ pincode });
  };

  return (
    <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} t={t} isDisabled={false}>
      <CardLabel>{t("CORE_COMMON_PINCODE")}</CardLabel>
      <TextInput
        value={pincode}
        onChange={(e) => { setPincode(e.target.value); setError(null); }}
        name="pincode"
        style={{ marginBottom: "8px" }}
      />
      {error && <span className="pgr-input-error">{error}</span>}
    </FormStep>
  );
};

export default SelectPincode;
