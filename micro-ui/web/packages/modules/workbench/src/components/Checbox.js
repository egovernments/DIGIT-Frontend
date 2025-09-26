import { ToggleSwitch } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";


const CustomCheckbox = function (props) {
  const { t } = useTranslation();

  return (
    <div onClick={() => props?.readonly ? null : props.onChange(!props.value)} className={`custom-checkbox custom-checkbox-${props.disabled?"disabled":""}`}>
      {props.value && <ToggleSwitch value={true} disabled={props?.readonly}  {...props}></ToggleSwitch>}
      {!props.value && <ToggleSwitch value={false} disabled={props?.readonly} {...props}></ToggleSwitch>}
      <span className="custom-checkbox-label">{props.value ? t("WBH_BOOLEAN_VALUE_TRUE") :  t("WBH_BOOLEAN_VALUE_FALSE")}</span>
    </div>
  );
};

export default CustomCheckbox;
