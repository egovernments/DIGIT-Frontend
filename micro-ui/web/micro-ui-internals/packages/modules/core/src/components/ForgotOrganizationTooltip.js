import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, PopUp, Button, HeaderComponent } from "@egovernments/digit-ui-components";
import { LinkButton } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
const ForgotOrganizationTooltip = ({ onSelect, formData, control, formState, ...props }) => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [isChecked, setIsChecked] = useState(true);
    const history = useHistory();


    useEffect(() => {
        onSelect("check", isChecked);
    }, [isChecked]);


    const onButtonClickLogin = () => {
        
    };
    
    return (
        <React.Fragment>
            <div className="loginSignUpSelector" style={{marginTop:"-2rem"}}>
                {
                    <Button
                        label={t(`SB_FORGOTORGANIZATION_TOOLTIP`)}
                        variation={"link"}
                        size={"small"}
                        onClick={onButtonClickLogin}
                        // isSuffix={true}
                        style={{ marginBottom: "0.5rem", paddingLeft: "0.2rem" }}
                    ></Button>
                }

            </div>
        </React.Fragment>
    );
};

export default ForgotOrganizationTooltip;
