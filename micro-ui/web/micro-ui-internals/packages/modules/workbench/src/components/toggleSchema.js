import { ToggleSwitch } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ToggleSchema = function (props) {
    const { t } = useTranslation();

    return (
        <div className="toggle-schema-container" onClick={() => props.onChange(!props.value)}>
            <span className="label">{props.label}</span>
            {props.value ? <ToggleSwitch value={true} {...props} /> : <ToggleSwitch value={false} {...props} />}
        </div>
    );
};

export default ToggleSchema;
