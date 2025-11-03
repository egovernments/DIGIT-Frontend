import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";

const ForgotOrganizationTooltip = ({ onSelect }) => {
    const { t } = useTranslation();
    const [showTip, setShowTip] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowTip(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
            <div ref={wrapperRef} className="loginSignUpSelector" style={{ position: "relative", marginTop: "-2rem" }}>
                <Button
                        label={t(`SB_FORGOTORGANIZATION_TOOLTIP`)}
                        variation={"link"}
                        size={"small"}
                        onClick={() => setShowTip((prev) => !prev)}
                        // isSuffix={true}
                        style={{ marginBottom: "0.5rem", paddingLeft: "0.2rem" }}
                ></Button>
                {showTip && (
                    <div
                    style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translateY(-4px)",
                        backgroundColor: "#0b4b66",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        maxWidth: "20rem",
                        zIndex: 1000,
                        fontSize: "0.875rem"
                    }}
                    >
                    {t("SB_FORGOTORGANIZATION_TOOLTIP_TEXT")}
                    </div>
                )}
            </div>
    );
};

export default ForgotOrganizationTooltip;
