import React from "react";
import { Switch } from "@egovernments/digit-ui-components";
const SwitchTemplate = ({ field, t }) => {
  const containerStyle = field?.properties?.containerStyle;

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      <Switch
        label={t(field?.label)}
        onToggle={() => {}}
        isCheckedInitially={field?.value || false}
        shapeOnOff
        isLabelFirst={field?.properties?.isLabelFirst === true}
        style={containerStyle && typeof containerStyle === "object" ? containerStyle : undefined}
      />
    </div>
  );
};

export default SwitchTemplate;
