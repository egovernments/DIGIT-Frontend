import { useTranslation } from "react-i18next";
import { Card, FieldV1, Switch } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";
import React from "react";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { HeaderComponent, Button } from "@egovernments/digit-ui-components";

const StageActions = ({ label, type, desc, options, name, onClick, value }) => {
    const { t } = useTranslation();

    return (
        <Card style={{ width: "300px", gap: "0px" }}>
            {type === "switch" ? (
                <Switch
                    isLabelFirst={true}
                    label={label}
                    shapeOnOff={true}
                    isCheckedInitially={value}
                    onToggle={e => onClick([name,e])}
                    className="stage-action-switch"
                    style={{ justifyContent: "space-between" }}
                />
            ) : type === "dropdown" ? (
                <FieldV1
                    label={label}
                    onChange={e => onClick([name,e])}
                    populators={{
                        name: "dropdownField",
                        fieldPairClassName: "workflow-field-pair",
                        alignFieldPairVerically: true,
                        optionsKey: "code",
                        options: options || [],
                    }}
                    props={{
                        fieldStyle: { width: "100%" }
                    }}
                    type="multiselectdropdown"
                    value={value}
                />
            ) : type === "button" ? (
                <LabelFieldPair removeMargin={true} style={{ justifyContent: "space-between" }}>
                    <HeaderComponent className={`label`}>
                        <div className={`label-container`}>
                            <label className={`label-styles`}>{label}</label>
                        </div>
                    </HeaderComponent>
                    <div className="state-icon" style={{width: "40px", height: "40px"}}>
                        {<CustomSVG.PlaceholderSvg />}
                    </div>
                </LabelFieldPair>
            ) : null}
            <div class="step-description">{desc}</div>
        </Card>
    );
};

export default StageActions;
