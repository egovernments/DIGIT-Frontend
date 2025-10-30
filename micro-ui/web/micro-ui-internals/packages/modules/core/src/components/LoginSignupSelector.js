import React, { useState, useEffect, Fragment,useRef } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, PopUp, Button, HeaderComponent } from "@egovernments/digit-ui-components";
const LoginSignupSelector = ({ onSelect, formData, control, formState, ...props }) => {
    const { t } = useTranslation();
    const [isChecked, setIsChecked] = useState(true);
    const wrapperRef = useRef(null);
    const [topMargin, setTopMargin] = useState("-2rem");


    useEffect(() => {
        onSelect("check", isChecked);
    }, [isChecked]);
    const onButtonClickLogin = () => {
        window.location.replace(`/${window?.contextPath}/user/login`);
    };

     useEffect(() => {
        const computeTopMargin = () => {
          const width = window.innerWidth || window.screen.availWidth;
          const height = window.innerHeight || window.screen.availHeight;
          
          // Very small screens (mobile)
          if (width <= 480) {
            return "0.5rem";
          }
          // Small screens (tablet)
          else if (width <= 768) {
            return "0rem";
          }
          // Medium screens with high DPI
          else if (
            width <= 1366 ||
            (height <= 768 && window.devicePixelRatio > 1.0)
          ) {
            return "-1.5rem";
          }
          // Large screens
          return "-2rem";
        };
    
        setTopMargin(computeTopMargin());
    
        const handleResize = () => setTopMargin(computeTopMargin());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    

    const onButtonClickSignUP = () => {
        window.location.replace(`/${window?.contextPath}/user/sign-up`);
    };

    const isSignupPage = window.location.href.includes("sandbox-ui/user/sign-up");
    return (
        <React.Fragment>
            <div ref={wrapperRef} className="loginSignUpSelector" style={{ marginTop: topMargin }}>
                {
                    isSignupPage ?
                        <Button
                            label={t(`SB_ALREADY_HAVE_ACCOUNT`)}
                            variation={"link"}
                            size={"small"}
                            onClick={onButtonClickLogin}
                            // isSuffix={true}
                            style={{ 
                                marginBottom: "0.5rem", 
                                paddingLeft: "0.2rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}
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
