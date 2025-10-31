import React from "react";
import { Switch } from "@egovernments/digit-ui-components";
const SwitchTemplate = ({ field, t }) => (
  <Switch label={t(field?.label)} onToggle={() => {}} isCheckedInitially={field?.value || false} shapeOnOff />
);

export default SwitchTemplate;
