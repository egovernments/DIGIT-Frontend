import React from "react";
import { Switch } from "@egovernments/digit-ui-components";
const SwitchTemplate = ({ field, t }) => (
  <div style={{ width: "100%", boxSizing: "border-box" }}>
    <Switch label={t(field?.label)} onToggle={() => {}} isCheckedInitially={field?.value || false} shapeOnOff />
  </div>
);

export default SwitchTemplate;
