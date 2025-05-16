import { Switch } from "@egovernments/digit-ui-components"; // Added Switch import
import React from "react";

const CustomSwitch = ({onSelect, props, formData}) => {

    return (
        <Switch
            checked={formData?.enabled}
            onToggle={(value) => {onSelect("enabled", value)}}
            style={{ width: "fit-content" }}
        />
    )
};
export default CustomSwitch;