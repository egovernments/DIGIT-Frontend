import { FormStep } from "@egovernments/digit-ui-react-components";

// Geolocation step — map selection. Skippable.
// The actual map implementation should be wired to the existing framework map utilities.
const SelectGeolocation = ({ t, config, onSelect, onSkip }) => {
  return (
    <FormStep config={config || { texts: { submitBarLabel: "CS_COMMON_NEXT", skipText: "CORE_COMMON_SKIP_CONTINUE" } }} onSelect={() => onSelect({})} onSkip={onSkip} t={t}>
      <div className="pgr-geolocation-placeholder" style={{ height: "280px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span>{t("CS_ADDCOMPLAINT_MAP_PLACEHOLDER")}</span>
      </div>
    </FormStep>
  );
};

export default SelectGeolocation;
