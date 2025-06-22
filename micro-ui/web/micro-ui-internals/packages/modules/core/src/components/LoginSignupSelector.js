import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, PopUp, Button, HeaderComponent } from "@egovernments/digit-ui-components";
import { LinkButton } from "@egovernments/digit-ui-react-components";

const LoginSignupSelector = ({ onSelect, formData, control, formState, ...props }) => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();


    // useEffect(() => {
    //     onSelect("check", isChecked);
    // }, [isChecked]);
    const onButtonClickSignUP = () => {
        setShowPopUp(true);
    };
    const onButtonClickLogin = () => {
        setShowPopUp(true);
    };



    const isSignupPage = window.location.href.includes("sandbox-ui/user/sign-up");

    return (
        <React.Fragment>
            <div className="loginSignUpSelector">
                {
                    isSignupPage ?
                        <Button
                            label={t(`SB_ALREADY_HAVE_ACCOUNT`)}
                            variation={"link"}
                            size={"small"}
                            onClick={onButtonClickSignUP}
                            // isSuffix={true}
                            style={{ marginBottom: "0.5rem", paddingLeft: "0.2rem" }}
                        ></Button> :
                        <Button
                            label={t(`SB_DONT_HAVE_ACCOUNT`)}
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

export default LoginSignupSelector;
