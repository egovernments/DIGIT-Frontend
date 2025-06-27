import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, PopUp, Button, HeaderComponent } from "@egovernments/digit-ui-components";
const LoginSignupSelector = ({ onSelect, formData, control, formState, ...props }) => {
    const { t } = useTranslation();
    const [isChecked, setIsChecked] = useState(true);


    useEffect(() => {
        onSelect("check", isChecked);
    }, [isChecked]);
    const onButtonClickLogin = () => {
        window.location.replace(`/${window?.contextPath}/user/login`);
    };

    const onButtonClickSignUP = () => {
        window.location.replace(`/${window?.contextPath}/user/sign-up`);
    };

    const isSignupPage = window.location.href.includes("sandbox-ui/user/sign-up");
    return (
        <React.Fragment>
            <div className="loginSignUpSelector" style={{ marginTop: '-2rem' }}>
                {
                    isSignupPage ?
                        <Button
                            label={t(`SB_ALREADY_HAVE_ACCOUNT`)}
                            variation={"link"}
                            size={"small"}
                            onClick={onButtonClickLogin}
                            // isSuffix={true}
                            style={{ marginBottom: "0.5rem", paddingLeft: "0.2rem" }}
                        ></Button> :
                        <Button
                            label={t(`SB_DONT_HAVE_ACCOUNT`)}
                            variation={"link"}
                            size={"small"}
                            onClick={onButtonClickSignUP}
                            // isSuffix={true}
                            style={{ marginBottom: "0.5rem", paddingLeft: "0.2rem" }}
                        ></Button>

                }

            </div>
        </React.Fragment>
    );
};

export default LoginSignupSelector;
